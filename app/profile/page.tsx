"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TeamT } from "@/types/team.type";
import { ProfileSkeleton, ProfileStatsSkeleton } from "@/components/skeletons";
import { UserEnumT} from "@/types/user.type";
import UserAvatar from "@/components/UserAvatar";
import { getUserStats, updateUserProfile } from "@/api/user.api";
import { getAllTeams } from "@/api/match.api";
import { useAuth } from "@/context/AuthContext";
import { AvatarSelector } from "@/components/AvatarSelector";

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
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0); // State to force avatar refresh
  const [favoriteTeamId, setFavoriteTeamId] = useState<number | null>(null);
  const [teams, setTeams] = useState<TeamT[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: "success" | "error" | "info", text: string} | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setName(user?.name || "");
    setAvatarUrl(user?.avatar_url || "");
    setFavoriteTeamId(user?.favorite_team_id || null);
  }, [user]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        setStatsLoading(true);
        try {
          const response = await getUserStats(user.user_id?.toString() || "0");
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
          setTeams(response.data.map(team => ({
            team_id: team.team_id,
            id: team.team_id.toString(),
            name: team.name,
            shortName: team.short_code,
            short_code: team.short_code,
            logo: team.logo_url,
            logo_url: team.logo_url,
            country: team.country,
            slug: team.slug
          })));
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
    setMessage(null);

    try {
      const profileData: {
        name?: string;
        avatar_url?: string;
        favorite_team_id?: number;
      } = {};

      if (name !== user.name) profileData.name = name;
      if (avatarUrl !== user.avatar_url) profileData.avatar_url = avatarUrl;
      if (favoriteTeamId !== (user.favorite_team_id || null)) {
        profileData.favorite_team_id = favoriteTeamId || undefined;
      }

      if (Object.keys(profileData).length > 0) {
        const response = await updateUserProfile(profileData);

        if (response.success && response.user) {

          const updatedUser = {
            ...user,
            ...response.user,
            name: response.user.name || user.name,
            avatar_url: response.user.avatar_url || user.avatar_url,
            favorite_team_id: response.user.favorite_team_id || user.favorite_team_id
          };
          
          setUser(updatedUser as any);
          
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          if (profileData.avatar_url) {
            setAvatarRefreshKey(prev => prev + 1);
          }
          
          setMessage({type: "success", text: "Profile updated successfully!"});
        } else {
          setMessage({type: "error", text: response.message || "Failed to update profile"});
        }
      } else {
        setMessage({type: "info", text: "No changes to save"});
      }
    } catch (error) {
      setMessage({type: "error", text: "Failed to update profile"});
    } finally {
      setSaving(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <ProfileSkeleton />
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
                  <UserAvatar
                    user={{
                      user_id: user?.user_id || '',
                      name: user?.name || '',
                      email: user?.email || '',
                      avatar_url: avatarUrl,
                      type: user?.type || UserEnumT.USER
                    }} 
                    className="mx-auto mb-3"
                    refreshTrigger={avatarRefreshKey}
                  />
                  <div className="text-lg font-semibold text-foreground">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
                
                <nav className="space-y-2">
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'profile' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'account' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                    onClick={() => setActiveTab('account')}
                  >
                    Account Settings
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'favorite-teams' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                    onClick={() => setActiveTab('favorite-teams')}
                  >
                    Favorite Teams
                  </button>
                  <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
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
                          Are you sure you want to log out? You will be redirected to the home page.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsLogoutDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleLogout}
                        >
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
              {activeTab === 'profile' && (
                <>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="border-b border-border p-6">
                      <h2 className="text-xl font-semibold">Profile Information</h2>
                      <p className="text-muted-foreground mt-1">
                        Update your personal information and preferences
                      </p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* Profile Picture */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">Profile Picture</Label>
                        <AvatarSelector
                          currentAvatar={avatarUrl}
                          onAvatarChange={(newAvatarUrl) => {
                            setAvatarUrl(newAvatarUrl);
                          }}
                          onAvatarUpdateSuccess={() => {
                            setAvatarRefreshKey(prev => prev + 1);

                            setTimeout(() => {
                              window.location.reload();
                            }, 1500);
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-base font-medium mb-3 block">Personal Information</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          <div>
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
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                      
                      {message && (
                        <div className={`p-4 rounded-lg ${
                          message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                          message.type === "error" ? "bg-red-50 text-red-800 border border-red-200" :
                          "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}>
                          <div className="flex items-center">
                            {message.type === "success" && <CheckCircle2 className="h-5 w-5 mr-2" />}
                            {message.type === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
                            <span>{message.text}</span>
                          </div>
                        </div>
                      )}
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
                            <div className="text-2xl font-bold">{userStats.prediction_accuracy.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                          </div>
                          
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <Target className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                            <div className="text-2xl font-bold">{userStats.total_predictions}</div>
                            <div className="text-sm text-muted-foreground">Total Predictions</div>
                          </div>
                          
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                            <div className="text-2xl font-bold">{userStats.correct_predictions}</div>
                            <div className="text-sm text-muted-foreground">Correct</div>
                          </div>
                          
                          <div className="bg-muted rounded-lg p-4 text-center">
                            <Hash className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                            <div className="text-2xl font-bold">{userStats.total_comments}</div>
                            <div className="text-sm text-muted-foreground">Comments</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Member since {new Date(userStats.join_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No statistics available</h3>
                        <p className="text-muted-foreground">
                          Your statistics will appear here once you start making predictions and engaging with the community.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {activeTab === 'account' && (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="border-b border-border p-6">
                    <h2 className="text-xl font-semibold">Account Settings</h2>
                    <p className="text-muted-foreground mt-1">
                      Manage your account preferences and security settings
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-3 block">Profile Picture</Label>
                      <AvatarSelector 
                        currentAvatar={avatarUrl}
                        onAvatarChange={(newAvatarUrl) => {
                          setAvatarUrl(newAvatarUrl);
                        }}
                        onAvatarUpdateSuccess={() => {
                          setAvatarRefreshKey(prev => prev + 1);
                          
                          setTimeout(() => {
                            window.location.reload();
                          }, 1500);
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium mb-3 block">Personal Information</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
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
                    
                    <div>
                      <Label className="text-base font-medium mb-3 block">Preferences</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="favorite-team">Favorite Team</Label>
                          <Select 
                            value={favoriteTeamId?.toString() || ""} 
                            onValueChange={(value) => setFavoriteTeamId(value && value !== "none" ? parseInt(value) : null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your favorite team" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No favorite team</SelectItem>
                              {teams.map((team) => (
                                <SelectItem key={team.team_id} value={team.team_id.toString()}>
                                  <div className="flex items-center">
                                    <img 
                                      src={team.logo_url} 
                                      alt={team.name} 
                                      className="w-6 h-6 mr-2 rounded-full object-cover"
                                    />
                                    {team.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                    
                    {message && (
                      <div className={`p-4 rounded-lg ${
                        message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                        message.type === "error" ? "bg-red-50 text-red-800 border border-red-200" :
                        "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}>
                        <div className="flex items-center">
                          {message.type === "success" && <CheckCircle2 className="h-5 w-5 mr-2" />}
                          {message.type === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
                          <span>{message.text}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'favorite-teams' && (
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
                          key={team.team_id} 
                          className={`border rounded-lg p-4 flex flex-col items-center text-center ${favoriteTeamId === team.team_id ? 'border-primary bg-primary/5' : 'border-border'}`}
                        >
                          <img 
                            src={team.logo_url} 
                            alt={team.name} 
                            className="w-16 h-16 rounded-full object-cover mb-3"
                          />
                          <h3 className="font-medium">{team.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{team.country}</p>
                          <button 
                            onClick={() => setFavoriteTeamId(team.team_id === favoriteTeamId ? null : team.team_id)}
                            className={`mt-3 px-3 py-1 rounded text-sm ${favoriteTeamId === team.team_id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                          >
                            {favoriteTeamId === team.team_id ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
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