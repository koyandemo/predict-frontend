"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, TrendingUp, Users, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCardVoteBarSkeleton } from "@/components/skeletons";

import { formatCombinedMatchDateTimeForUser } from "@/lib/timezoneUtils";
import {
  getMatchDisplayStatus,
  getStatusBadgeVariant,
} from "@/lib/matchStatusUtils";

import { MatchT } from "@/types/match.type";
import { getMatchVoteCounts } from "@/api/match.api";

type VoteDataT = {
  home_votes: number;
  draw_votes: number;
  away_votes: number;
  total_votes: number;
};

interface MatchCardProps {
  match: MatchT;
}

const fallbackLogo = "/placeholder.svg";

export function MatchCard({ match }: MatchCardProps) {
  const showDraw = match.allow_draw !== false;

  const { date, time } = formatCombinedMatchDateTimeForUser(match.kickoff);

  const displayStatus = useMemo(() => getMatchDisplayStatus(match), [match]);

  const { data: voteData, isLoading } = useQuery<VoteDataT | null>({
    queryKey: ["match-votes-countss", match.id],
    queryFn: async () => {
      const res = await getMatchVoteCounts(match.id);
      if (!res.success || !res.data) return null;
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const percentages = useMemo(() => {
    if (!voteData || voteData.total_votes === 0) {
      return { home: 0, draw: 0, away: 0 };
    }

    return {
      home: Math.round((voteData.home_votes / voteData.total_votes) * 100),
      draw: Math.round((voteData.draw_votes / voteData.total_votes) * 100),
      away: Math.round((voteData.away_votes / voteData.total_votes) * 100),
    };
  }, [voteData]);

  const totalVotes = voteData?.total_votes ?? 0;

  const isHomeFav =
    percentages.home > percentages.away && percentages.home > percentages.draw;

  const isAwayFav =
    percentages.away > percentages.home && percentages.away > percentages.draw;

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="group p-0 h-full cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm shadow-md transition-all hover:border-primary/50 hover:shadow-lg">
        <CardContent className="flex h-full flex-col p-0">
          <div className="flex items-center justify-between border-b border-border bg-linear-to-r from-primary/10 to-secondary/10 p-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {match.league.name}
            </Badge>

            <Badge
              variant={getStatusBadgeVariant(displayStatus)}
              className="flex items-center gap-1 text-xs font-medium"
            >
              {displayStatus === "live" && (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  DEBATE
                </>
              )}
              {displayStatus === "scheduled" && "SCHEDULED"}
              {displayStatus === "finished" && "FINISHED"}
              {displayStatus === "postponed" && "POSTPONED"}
              {displayStatus === "upcoming" && "UPCOMING"}
              {displayStatus === "kickOffSoon" && "KICK OFF SOON"}
            </Badge>
          </div>

          <div className="flex flex-grow flex-col p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <TeamBlock
                team={match.home_team}
                score={match.home_score}
                isWinner={
                  displayStatus === "finished" &&
                  match.home_score! > (match.away_score ?? 0)
                }
                isFav={isHomeFav && displayStatus !== "finished"}
              />

              <div className="flex flex-col items-center">
                {displayStatus === "finished" ? (
                  <span className="text-xl font-bold text-muted-foreground">
                    FT
                  </span>
                ) : (
                  <>
                    <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-base font-bold text-primary">
                        VS
                      </span>
                    </div>
                    {showDraw && (
                      <Badge variant="outline" className="px-1 py-0 text-xs">
                        D {percentages.draw}%
                      </Badge>
                    )}
                  </>
                )}
              </div>

              <TeamBlock
                team={match.away_team}
                score={match.away_score}
                isWinner={
                  displayStatus === "finished" &&
                  match.away_score! > (match.home_score ?? 0)
                }
                isFav={isAwayFav && displayStatus !== "finished"}
              />
            </div>

            <div className="mb-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <InfoPill icon={<CalendarDays className="h-3 w-3" />} text={date} />
              <InfoPill icon={<Clock className="h-3 w-3" />} text={time} />
            </div>

            <div className="mt-auto">
              {isLoading ? (
                <MatchCardVoteBarSkeleton />
              ) : (
                <>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>{percentages.home}%</span>
                    {/* <span>{percentages.draw}%</span> */}
                    <span>{percentages.away}%</span>
                  </div>

                  <div className="flex h-2 overflow-hidden rounded-full bg-muted/50">
                    <div
                      style={{ width: `${percentages.home}%` }}
                      className="bg-emerald-500"
                    />

                    {showDraw && (
                      <div
                        style={{ width: `${percentages.draw}%` }}
                        className="bg-white"
                      />
                    )}

                    <div
                      style={{ width: `${percentages.away}%` }}
                      className="bg-blue-500"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {totalVotes.toLocaleString()} votes
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TeamBlock({
  team,
  score,
  isWinner,
  isFav,
}: {
  team: MatchT["home_team"];
  score?: number;
  isWinner: boolean;
  isFav: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm opacity-50" />
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border bg-card">
          <Image
            src={team.logo_url || fallbackLogo}
            alt={team.name}
            fill
            className="object-contain p-1"
            onError={(e) => ((e.target as HTMLImageElement).src = fallbackLogo)}
          />
        </div>

        {isFav && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <TrendingUp className="h-2.5 w-2.5 text-primary-foreground" />
          </div>
        )}

        {isWinner && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <Trophy className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      <h3 className="w-full truncate text-center text-sm font-bold">
        {team.short_code}
      </h3>

      {score !== undefined && (
        <span className="mt-1 text-lg font-bold text-green-600">{score}</span>
      )}
    </div>
  );
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-card/50 px-2 py-1">
      {icon}
      <span>{text}</span>
    </div>
  );
}
