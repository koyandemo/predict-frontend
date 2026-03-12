"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Trophy,
  Calendar,
  Hash,
  Target,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeamT } from "@/types/team.type";
import { ProfileSkeleton, ProfileStatsSkeleton } from "@/components/skeletons";
import UserAvatar from "@/components/UserAvatar";
import { getUserStats, updateUserProfile } from "@/api/user.api";
import { getAllTeams } from "@/api/match.api";
import { AvatarSelector } from "@/components/AvatarSelector";
import { UserT } from "@/types/user.type";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

interface UserStats {
  total_predictions: number;
  correct_predictions: number;
  prediction_accuracy: number;
  total_comments: number;
  total_likes_received: number;
  total_dislikes_received: number;
  join_date: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const user = session?.user as UserT;
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [team_id, setTeam_id] = useState<number | null>(null);
  const [teams, setTeams] = useState<TeamT[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    setName(session?.user?.name || "");
    setAvatarUrl(user?.avatar_url || "");
    setTeam_id(user?.team_id || null);
  }, [user]);

  //need to update
  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        setStatsLoading(true);
        try {
          const response = await getUserStats(user.id);
          if (response.success && response.data) {
            setUserStats(response.data);
          }
        } catch (error) {
        } finally {
          setStatsLoading(false);
        }
      } else {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await getAllTeams();
        if (response.success && response.data) {
          setTeams(response.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const response = await updateUserProfile({
        name,
        avatar_url: avatarUrl,
        team_id: team_id || undefined,
      });
      if (response.success && response.data) {
        await update({
          ...session,
          user: {
            ...(session?.user as UserT),
            name: response.data.name || session?.user.name,
            avatar_url: response.data.avatar_url || session?.user.avatar_url,
            team_id: response.data.team_id || session?.user.team_id,
          },
        });

        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and view your statistics
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-8">
                <div className="text-center mb-6">
                  <UserAvatar user={user as UserT} className="mx-auto mb-3" />
                  <div className="text-lg font-semibold text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user?.email}
                  </div>
                </div>

                <nav className="space-y-2">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                      activeTab === "profile"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                      activeTab === "favorite-teams"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setActiveTab("favorite-teams")}
                  >
                    Favorite Teams
                  </button>
                  <Dialog
                    open={isLogoutDialogOpen}
                    onOpenChange={setIsLogoutDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <button className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to log out? You will be
                          redirected to the home page.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsLogoutDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                          Logout
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="border-b border-border p-6">
                      <h2 className="text-xl font-semibold">
                        Profile Information
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Update your personal information and preferences
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Profile Picture
                        </Label>
                        <AvatarSelector
                          currentAvatar={avatarUrl}
                          onAvatarChange={(newAvatarUrl) => {
                            setAvatarUrl(newAvatarUrl);
                            setTimeout(() => {
                              window.location.reload();
                            }, 1500);
                          }}
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Personal Information
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={user?.email || ""}
                              disabled
                              placeholder="Enter your email"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              Email cannot be changed
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button onClick={handleSaveProfile} disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border overflow-hidden mt-6">
                    <div className="border-b border-border p-6">
                      <h2 className="text-xl font-semibold">Statistics</h2>
                      <p className="text-muted-foreground mt-1">
                        Your prediction and engagement statistics
                      </p>
                    </div>

                    {statsLoading ? (
                      <ProfileStatsSkeleton />
                    ) : userStats ? (
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                            <div className="text-2xl font-bold">
                              {userStats.prediction_accuracy.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Accuracy
                            </div>
                          </div>

                          <div className="bg-muted rounded-lg p-4 text-center">
                            <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                            <div className="text-2xl font-bold">
                              {userStats.total_predictions}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Predictions
                            </div>
                          </div>

                          <div className="bg-muted rounded-lg p-4 text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                            <div className="text-2xl font-bold">
                              {userStats.correct_predictions}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Correct
                            </div>
                          </div>

                          <div className="bg-muted rounded-lg p-4 text-center">
                            <Hash className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                            <div className="text-2xl font-bold">
                              {userStats.total_comments}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Comments
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              Member since{" "}
                              {new Date(
                                userStats.join_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No statistics available
                        </h3>
                        <p className="text-muted-foreground">
                          Your statistics will appear here once you start making
                          predictions and engaging with the community.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "favorite-teams" && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="border-b border-border p-6">
                    <h2 className="text-xl font-semibold">Favorite Teams</h2>
                    <p className="text-muted-foreground mt-1">
                      Browse and manage your favorite teams
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className={`border rounded-lg p-4 flex flex-col items-center text-center ${
                            team_id === team.id
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="w-16 h-16 rounded-full object-cover mb-3"
                          />
                          <h3 className="font-medium">{team.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {team.country}
                          </p>
                          <button
                            onClick={() =>
                              setTeam_id(team.id === team_id ? null : team.id)
                            }
                            className={`mt-3 px-3 py-1 rounded text-sm ${
                              team_id === team.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {team_id === team.id ? "Selected" : "Select"}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
