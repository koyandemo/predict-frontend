"use client";

import { useState, useEffect, useMemo } from "react";
import { useWinnerVote } from "@/hooks/useWinnerVote";
import { getTeamsByVote, TeamWithVotesT } from "@/api/team.api";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  CheckCircle2,
  Vote,
  MapPin,
  Users,
  Star,
  Shield,
  Globe,
  Flame,
} from "lucide-react";
import Image from "next/image";
import { FIFA_CLUB_WORLD_CUP_LEAGUE_ID } from "@/lib/fifaWorldCupUtils";


export default function WorldCupVotingPage() {
  const {
    userVote,
    loading: voteLoading,
    error,
    hasVoted,
    submitVote,
  } = useWinnerVote(FIFA_CLUB_WORLD_CUP_LEAGUE_ID);

  const [teams, setTeams] = useState<TeamWithVotesT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithVotesT | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await getTeamsByVote(FIFA_CLUB_WORLD_CUP_LEAGUE_ID);
        if (response.success && response.data) {
          setTeams(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch teams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  },[]);

  const teamsByGroup = useMemo(() => {
    const grouped: Record<string, TeamWithVotesT[]> = {};
    teams.forEach((team) => {
      const groupName = team.group_name || "Unknown";
      if (!grouped[groupName]) grouped[groupName] = [];
      grouped[groupName].push(team);
    });
    return grouped;
  }, [teams]);

  const groups = useMemo(() => {
    const uniqueGroups = Array.from(
      new Set(teams.map((t) => t.group_name).filter(Boolean))
    ).sort() as string[];
    return ["all", ...uniqueGroups];
  }, [teams]);

  const handleTeamClick = (team: TeamWithVotesT) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const handleVote = async (teamId: number) => {
    setIsSubmitting(true);
    const success = await submitVote(teamId);
    setIsSubmitting(false);
    if (success) {
      setIsDialogOpen(false);
      setSelectedTeam(null);
      const response = await getTeamsByVote(FIFA_CLUB_WORLD_CUP_LEAGUE_ID);
      if (response.success && response.data) setTeams(response.data);
    }
  };

  const totalVotes = teams.reduce((sum, team) => sum + team.total_votes, 0);

  const getRankMedal = (index: number) => {
    if (index === 0) return { emoji: "🥇", color: "text-yellow-400" };
    if (index === 1) return { emoji: "🥈", color: "text-slate-300" };
    if (index === 2) return { emoji: "🥉", color: "text-amber-600" };
    return { emoji: `#${index + 1}`, color: "text-slate-500" };
  };

  if (loading || voteLoading) {
    return (
      <div className="wc-root flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="wc-spinner mx-auto mb-6" />
          <p className="wc-loading-text">Loading the squads…</p>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="wc-root min-h-screen">
      <style>{styles}</style>

      {/* ── HERO ── */}
      <header className="wc-hero">
        <div className="wc-hero-noise" />
        <div className="wc-hero-inner container mx-auto px-4 py-20 text-center relative z-10">
          <div className="wc-trophy-ring mx-auto mb-6">
            <Trophy className="wc-trophy-icon" />
          </div>
          <p className="wc-eyebrow mb-2">FIFA • USA · Canada · Mexico</p>
          <h1 className="wc-title">FIFA World Cup 2026</h1>
          <p className="wc-subtitle">Cast your vote — who lifts the trophy?</p>

          {hasVoted && (
            <div className="wc-voted-banner mx-auto mt-8">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>
                Your vote goes to <strong>{userVote?.team.name}</strong>
              </span>
            </div>
          )}

          <div className="wc-stats-row mx-auto mt-10">
            <div className="wc-stat">
              <span className="wc-stat-value">{totalVotes.toLocaleString()}</span>
              <span className="wc-stat-label">Total Votes</span>
            </div>
            <div className="wc-stat-divider" />
            <div className="wc-stat">
              <span className="wc-stat-value">{teams.length}</span>
              <span className="wc-stat-label">Teams</span>
            </div>
            <div className="wc-stat-divider" />
            <div className="wc-stat">
              <span className="wc-stat-value">{groups.length - 1}</span>
              <span className="wc-stat-label">Groups</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── ERROR ── */}
      {error && (
        <div className="container mx-auto px-4 mt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* ── TABS ── */}
      <main className="container mx-auto px-4 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="wc-tab-list mb-8">
            {groups.map((group) => (
              <TabsTrigger key={group} value={group} className="wc-tab-trigger">
                {group === "all" ? "All Teams" : `Group ${group}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── ALL TEAMS — leaderboard ── */}
          <TabsContent value="all">
            <div className="wc-leaderboard-grid">
              {teams.map((team, index) => {
                const pct =
                  totalVotes > 0
                    ? ((team.total_votes / totalVotes) * 100).toFixed(1)
                    : "0";
                const isVoted = userVote?.team.id === team.id;
                const medal = getRankMedal(index);

                return (
                  <div
                    key={team.id}
                    onClick={() => handleTeamClick(team)}
                    className={`wc-leader-row ${isVoted ? "wc-leader-row--voted" : ""} ${index < 3 ? "wc-leader-row--podium" : ""}`}
                  >
                    {/* rank */}
                    <span className={`wc-rank ${medal.color}`}>
                      {medal.emoji}
                    </span>

                    {/* logo */}
                    <div className="wc-team-logo-sm">
                      {team.logo_url ? (
                        <Image src={team.logo_url} alt={team.name} fill className="object-contain" />
                      ) : (
                        <Shield className="h-6 w-6 text-slate-500" />
                      )}
                    </div>

                    {/* name + country */}
                    <div className="wc-team-info flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="wc-team-name">{team.name}</span>
                        {team.isHost && (
                          <span className="wc-host-badge">
                            <Flame className="h-3 w-3 mr-1" /> Host
                          </span>
                        )}
                        {isVoted && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                      <span className="wc-team-country">
                        <Globe className="h-3 w-3 mr-1 inline" />
                        {team.country}
                        {team.group_name && (
                          <> &nbsp;·&nbsp; Group {team.group_name}</>
                        )}
                      </span>
                    </div>

                    {/* votes + bar */}
                    <div className="wc-vote-col">
                      <div className="wc-vote-bar-wrap">
                        <Progress value={parseFloat(pct)} className="wc-vote-bar" />
                      </div>
                      <div className="wc-vote-pct">{pct}%</div>
                      <div className="wc-vote-count">{team.total_votes.toLocaleString()}</div>
                    </div>

                    {/* action */}
                    <Button
                      size="sm"
                      variant={isVoted ? "outline" : "default"}
                      onClick={(e) => { e.stopPropagation(); handleTeamClick(team); }}
                      className={isVoted ? "wc-btn-voted" : "wc-btn-vote"}
                    >
                      {isVoted ? (
                        <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Voted</>
                      ) : (
                        <><Vote className="h-3.5 w-3.5 mr-1" /> Vote</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ── GROUP TABS — cards ── */}
          {groups.filter((g) => g !== "all").map((group) => (
            <TabsContent key={group} value={group}>
              <h2 className="wc-group-title mb-6">Group {group}</h2>
              <div className="wc-cards-grid">
                {(teamsByGroup[group] ?? []).map((team: TeamWithVotesT) => {
                  const pct =
                    totalVotes > 0
                      ? ((team.total_votes / totalVotes) * 100).toFixed(1)
                      : "0";
                  const isVoted = userVote?.team.id === team.id;

                  return (
                    <div
                      key={team.id}
                      onClick={() => handleTeamClick(team)}
                      className={`wc-card ${isVoted ? "wc-card--voted" : ""}`}
                    >
                      {/* top badges */}
                      <div className="wc-card-badges">
                        <span className="wc-group-badge">Group {team.group_name}</span>
                        {team.isHost && (
                          <span className="wc-host-badge">
                            <Flame className="h-3 w-3 mr-1" /> Host
                          </span>
                        )}
                        {isVoted && (
                          <span className="wc-voted-badge">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Your Pick
                          </span>
                        )}
                      </div>

                      {/* logo */}
                      <div className="wc-card-logo-wrap">
                        {team.logo_url ? (
                          <Image src={team.logo_url} alt={team.name} fill className="object-contain drop-shadow-xl" />
                        ) : (
                          <Shield className="h-16 w-16 text-slate-600" />
                        )}
                      </div>

                      {/* name */}
                      <h3 className="wc-card-name">{team.name}</h3>
                      <p className="wc-card-country">
                        <Globe className="h-3.5 w-3.5 mr-1 inline" />
                        {team.country}
                      </p>

                      {/* meta row */}
                      <div className="wc-card-meta">
                        {team.ranking != null && (
                          <span className="wc-meta-chip">
                            <Star className="h-3 w-3 mr-1" />
                            Rank {team.ranking}
                          </span>
                        )}
                        {team.participations != null && (
                          <span className="wc-meta-chip">
                            <Trophy className="h-3 w-3 mr-1" />
                            {team.participations}× WC
                          </span>
                        )}
                        {team.venue && (
                          <span className="wc-meta-chip wc-meta-chip--venue">
                            <MapPin className="h-3 w-3 mr-1" />
                            {team.venue}
                          </span>
                        )}
                      </div>

                      {/* progress */}
                      <div className="wc-card-progress">
                        <Progress value={parseFloat(pct)} className="wc-vote-bar h-1.5" />
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-slate-400">
                            <Users className="h-3 w-3 inline mr-1" />
                            {team.total_votes.toLocaleString()} votes
                          </span>
                          <span className="wc-pct-label">{pct}%</span>
                        </div>
                      </div>

                      {/* cta */}
                      <Button
                        className={`w-full mt-4 ${isVoted ? "wc-btn-voted" : "wc-btn-vote"}`}
                        variant={isVoted ? "outline" : "default"}
                        onClick={(e) => { e.stopPropagation(); handleTeamClick(team); }}
                      >
                        {isVoted ? (
                          <><CheckCircle2 className="h-4 w-4 mr-2" /> Your Pick</>
                        ) : (
                          <><Vote className="h-4 w-4 mr-2" /> Vote for {team.short_code}</>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* ── VOTE DIALOG ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="wc-dialog max-w-lg">
          {selectedTeam && (() => {
            const pct =
              totalVotes > 0
                ? ((selectedTeam.total_votes / totalVotes) * 100).toFixed(1)
                : "0";
            const isVoted = hasVoted && userVote?.team.id === selectedTeam.id;

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="wc-dialog-title">
                    {isVoted ? "Your Vote" : "Cast Your Vote"}
                  </DialogTitle>
                  <DialogDescription className="wc-dialog-desc">
                    {isVoted
                      ? "You've already backed this team."
                      : hasVoted
                      ? `Switch your vote from ${userVote?.team.name}?`
                      : "Support this team to lift the trophy."}
                  </DialogDescription>
                </DialogHeader>

                {/* team spotlight */}
                <div className="wc-dialog-team">
                  <div className="wc-dialog-logo-wrap">
                    {selectedTeam.logo_url ? (
                      <Image src={selectedTeam.logo_url} alt={selectedTeam.name} fill className="object-contain" />
                    ) : (
                      <Shield className="h-16 w-16 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="wc-dialog-team-name">{selectedTeam.name}</h3>
                    <p className="wc-dialog-team-sub">
                      {selectedTeam.country}
                      {selectedTeam.group_name && <> · Group {selectedTeam.group_name}</>}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTeam.isHost && (
                        <span className="wc-host-badge">
                          <Flame className="h-3 w-3 mr-1" /> Host Nation
                        </span>
                      )}
                      {selectedTeam.ranking != null && (
                        <span className="wc-meta-chip">
                          <Star className="h-3 w-3 mr-1" /> FIFA Rank {selectedTeam.ranking}
                        </span>
                      )}
                      {selectedTeam.participations != null && (
                        <span className="wc-meta-chip">
                          <Trophy className="h-3 w-3 mr-1" /> {selectedTeam.participations} World Cups
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* stats */}
                <div className="wc-dialog-stats">
                  <div className="wc-dialog-stat">
                    <span className="wc-dialog-stat-val">{selectedTeam.total_votes.toLocaleString()}</span>
                    <span className="wc-dialog-stat-lbl">Votes</span>
                  </div>
                  <div className="wc-dialog-stat">
                    <span className="wc-dialog-stat-val">{pct}%</span>
                    <span className="wc-dialog-stat-lbl">Vote share</span>
                  </div>
                  {selectedTeam.ranking && (
                    <div className="wc-dialog-stat">
                      <span className="wc-dialog-stat-val">#{selectedTeam.ranking}</span>
                      <span className="wc-dialog-stat-lbl">FIFA Rank</span>
                    </div>
                  )}
                </div>

                {/* progress */}
                <div className="px-1">
                  <Progress value={parseFloat(pct)} className="wc-vote-bar h-2" />
                </div>

                {/* venue */}
                {selectedTeam.venue && (
                  <p className="wc-dialog-venue">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedTeam.venue}
                  </p>
                )}

                <DialogFooter className="gap-2 pt-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="wc-btn-cancel">
                    Cancel
                  </Button>
                  {isVoted ? (
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="wc-btn-voted">
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Already Voted
                    </Button>
                  ) : (
                    <Button
                      onClick={() => selectedTeam && handleVote(selectedTeam.id)}
                      disabled={isSubmitting}
                      className="wc-btn-vote wc-btn-vote--lg"
                    >
                      {isSubmitting
                        ? "Submitting…"
                        : hasVoted
                        ? `Switch to ${selectedTeam.short_code}`
                        : `Vote for ${selectedTeam.short_code}`}
                    </Button>
                  )}
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  :root {
    --wc-bg:        #080f0a;
    --wc-bg2:       #0d1810;
    --wc-surface:   #111c14;
    --wc-border:    #1e2e22;
    --wc-gold:      #d4a017;
    --wc-gold-lite: #f0c94a;
    --wc-green:     #1a3a22;
    --wc-accent:    #2ecc71;
    --wc-text:      #e8f0ea;
    --wc-muted:     #6b8070;
    --wc-voted:     #1c3d2a;
    --wc-voted-border: #2ecc71;
  }

  .wc-root {
    background: var(--wc-bg);
    color: var(--wc-text);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── SPINNER ── */
  .wc-spinner {
    width: 48px; height: 48px;
    border: 3px solid var(--wc-border);
    border-top-color: var(--wc-gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .wc-loading-text {
    color: var(--wc-muted);
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.05em;
  }

  /* ── HERO ── */
  .wc-hero {
    position: relative;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, #1a4a2a 0%, transparent 70%),
      linear-gradient(180deg, #0a1a0e 0%, var(--wc-bg) 100%);
    border-bottom: 1px solid var(--wc-border);
    overflow: hidden;
  }
  .wc-hero-noise {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }
  .wc-trophy-ring {
    width: 80px; height: 80px;
    background: radial-gradient(circle, #2a4a1a, #111c14);
    border: 1px solid var(--wc-gold);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 40px rgba(212,160,23,0.25), inset 0 1px 0 rgba(212,160,23,0.15);
  }
  .wc-trophy-icon {
    width: 36px; height: 36px;
    color: var(--wc-gold);
    filter: drop-shadow(0 0 8px rgba(212,160,23,0.6));
  }
  .wc-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--wc-gold);
    font-weight: 500;
  }
  .wc-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 7vw, 5rem);
    letter-spacing: 0.04em;
    line-height: 1;
    color: var(--wc-text);
    text-shadow: 0 2px 40px rgba(0,0,0,0.6);
  }
  .wc-subtitle {
    font-size: 1.05rem;
    color: var(--wc-muted);
    margin-top: 0.5rem;
  }
  .wc-voted-banner {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(46,204,113,0.1);
    border: 1px solid rgba(46,204,113,0.3);
    color: #7ee9a8;
    font-size: 0.9rem;
    padding: 0.5rem 1.2rem;
    border-radius: 999px;
  }
  .wc-stats-row {
    display: flex; align-items: center; justify-content: center;
    gap: 2rem; max-width: 480px;
  }
  .wc-stat { text-align: center; }
  .wc-stat-value {
    display: block;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    color: var(--wc-gold-lite);
    letter-spacing: 0.06em;
    line-height: 1;
  }
  .wc-stat-label {
    display: block;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--wc-muted);
    margin-top: 2px;
  }
  .wc-stat-divider {
    width: 1px; height: 40px;
    background: var(--wc-border);
  }

  /* ── TABS ── */
  .wc-tab-list {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    background: transparent;
    padding: 0;
    height: auto;
  }
  .wc-tab-trigger {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--wc-muted);
    background: var(--wc-surface);
    border: 1px solid var(--wc-border);
    border-radius: 6px;
    padding: 0.45rem 1rem;
    transition: all 0.15s;
  }
  .wc-tab-trigger[data-state='active'] {
    background: var(--wc-gold);
    color: #080f0a;
    border-color: var(--wc-gold);
    font-weight: 700;
  }

  /* ── LEADERBOARD ── */
  .wc-leaderboard-grid {
    display: flex; flex-direction: column; gap: 0.4rem;
  }
  .wc-leader-row {
    display: flex; align-items: center; gap: 1rem;
    background: var(--wc-surface);
    border: 1px solid var(--wc-border);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  .wc-leader-row:hover { background: #162219; transform: translateX(2px); }
  .wc-leader-row--voted {
    border-color: var(--wc-voted-border);
    background: var(--wc-voted);
  }
  .wc-leader-row--podium {
    border-color: rgba(212,160,23,0.25);
  }
  .wc-rank {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    width: 2.5rem;
    text-align: center;
    flex-shrink: 0;
  }
  .wc-team-logo-sm {
    position: relative;
    width: 36px; height: 36px;
    flex-shrink: 0;
  }
  .wc-team-name {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--wc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wc-team-country {
    font-size: 0.75rem;
    color: var(--wc-muted);
    display: flex; align-items: center;
  }
  .wc-vote-col {
    display: flex; align-items: center; gap: 0.75rem;
    flex-shrink: 0;
  }
  .wc-vote-bar-wrap { width: 100px; }
  .wc-vote-pct {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    color: var(--wc-gold-lite);
    min-width: 3rem;
    text-align: right;
  }
  .wc-vote-count {
    font-size: 0.75rem;
    color: var(--wc-muted);
    min-width: 3rem;
    text-align: right;
  }

  /* ── CARDS ── */
  .wc-group-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    letter-spacing: 0.1em;
    color: var(--wc-gold);
  }
  .wc-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.25rem;
  }
  .wc-card {
    background: var(--wc-surface);
    border: 1px solid var(--wc-border);
    border-radius: 14px;
    padding: 1.25rem;
    cursor: pointer;
    transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
    display: flex; flex-direction: column;
  }
  .wc-card:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    border-color: rgba(212,160,23,0.35);
    transform: translateY(-2px);
  }
  .wc-card--voted {
    border-color: var(--wc-voted-border);
    background: var(--wc-voted);
    box-shadow: 0 0 20px rgba(46,204,113,0.1);
  }
  .wc-card-badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .wc-card-logo-wrap {
    position: relative;
    width: 80px; height: 80px;
    margin: 0 auto 1rem;
  }
  .wc-card-name {
    font-weight: 700;
    font-size: 1rem;
    text-align: center;
    color: var(--wc-text);
    margin-bottom: 0.2rem;
  }
  .wc-card-country {
    font-size: 0.75rem;
    color: var(--wc-muted);
    text-align: center;
    margin-bottom: 0.75rem;
  }
  .wc-card-meta {
    display: flex; flex-wrap: wrap; gap: 0.35rem;
    justify-content: center;
    margin-bottom: 0.75rem;
  }
  .wc-card-progress { margin-top: auto; }

  /* ── BADGES / CHIPS ── */
  .wc-group-badge {
    font-size: 0.7rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 0.2rem 0.55rem;
    background: rgba(212,160,23,0.1);
    color: var(--wc-gold-lite);
    border: 1px solid rgba(212,160,23,0.2);
    border-radius: 4px;
  }
  .wc-host-badge {
    display: inline-flex; align-items: center;
    font-size: 0.7rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
    padding: 0.2rem 0.55rem;
    background: rgba(231,76,60,0.12);
    color: #ff7b6b;
    border: 1px solid rgba(231,76,60,0.25);
    border-radius: 4px;
  }
  .wc-voted-badge {
    display: inline-flex; align-items: center;
    font-size: 0.7rem; font-weight: 600;
    padding: 0.2rem 0.55rem;
    background: rgba(46,204,113,0.12);
    color: var(--wc-accent);
    border: 1px solid rgba(46,204,113,0.25);
    border-radius: 4px;
  }
  .wc-meta-chip {
    display: inline-flex; align-items: center;
    font-size: 0.68rem;
    padding: 0.18rem 0.5rem;
    background: rgba(255,255,255,0.04);
    color: var(--wc-muted);
    border: 1px solid var(--wc-border);
    border-radius: 4px;
    white-space: nowrap;
  }
  .wc-meta-chip--venue {
    max-width: 160px;
    overflow: hidden; text-overflow: ellipsis;
  }
  .wc-pct-label {
    color: var(--wc-gold-lite);
    font-weight: 600;
  }

  /* ── BUTTONS ── */
  .wc-btn-vote {
    background: var(--wc-gold) !important;
    color: #080f0a !important;
    font-weight: 700;
    border: none;
    transition: filter 0.15s, transform 0.1s;
  }
  .wc-btn-vote:hover { filter: brightness(1.1); transform: scale(1.02); }
  .wc-btn-vote--lg { padding: 0.6rem 1.5rem; font-size: 0.95rem; }
  .wc-btn-voted {
    background: transparent !important;
    color: var(--wc-accent) !important;
    border: 1px solid rgba(46,204,113,0.4) !important;
  }
  .wc-btn-cancel {
    background: transparent !important;
    color: var(--wc-muted) !important;
    border: 1px solid var(--wc-border) !important;
  }

  /* ── VOTE BAR ── */
  .wc-vote-bar {
    background: rgba(255,255,255,0.06) !important;
  }
  .wc-vote-bar > div {
    background: linear-gradient(90deg, var(--wc-green), var(--wc-accent)) !important;
  }

  /* ── DIALOG ── */
  .wc-dialog {
    background: var(--wc-surface) !important;
    border: 1px solid var(--wc-border) !important;
    color: var(--wc-text) !important;
  }
  .wc-dialog-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.06em;
    color: var(--wc-text);
  }
  .wc-dialog-desc { color: var(--wc-muted); font-size: 0.9rem; }
  .wc-dialog-team {
    display: flex; gap: 1.25rem; align-items: flex-start;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--wc-border);
    border-radius: 10px;
    padding: 1rem;
  }
  .wc-dialog-logo-wrap {
    position: relative;
    width: 72px; height: 72px; flex-shrink: 0;
  }
  .wc-dialog-team-name {
    font-weight: 700; font-size: 1.2rem;
    color: var(--wc-text);
  }
  .wc-dialog-team-sub {
    font-size: 0.8rem; color: var(--wc-muted); margin-top: 2px;
  }
  .wc-dialog-stats {
    display: flex; gap: 1rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--wc-border);
    border-radius: 8px;
    padding: 0.75rem 1rem;
  }
  .wc-dialog-stat { flex: 1; text-align: center; }
  .wc-dialog-stat-val {
    display: block;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    color: var(--wc-gold-lite);
    line-height: 1;
  }
  .wc-dialog-stat-lbl {
    font-size: 0.7rem; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--wc-muted);
    margin-top: 2px;
  }
  .wc-dialog-venue {
    display: flex; align-items: center;
    font-size: 0.8rem; color: var(--wc-muted);
    padding: 0.1rem 0;
  }

  @media (max-width: 640px) {
    .wc-vote-col { display: none; }
    .wc-cards-grid { grid-template-columns: 1fr 1fr; }
    .wc-dialog-stats { flex-wrap: wrap; }
  }
`;