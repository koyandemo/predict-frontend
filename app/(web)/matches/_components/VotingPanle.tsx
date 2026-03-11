"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MatchT } from "@/types/match.type";
import { usePathname } from "next/navigation";
import { VoteButton } from "./VoteButton";
import { useVoting } from "@/hooks/useVote";

interface Props {
  match: MatchT;
  onVoteUpdate?: () => void;
}

export default function VotingPanel({ match, onVoteUpdate }: Props) {
  const pathname = usePathname();
  const { votes, totalVotes, userVote, isVoting, isAuthenticated, handleVote } =
    useVoting(match, onVoteUpdate);

  const showDraw = match.allow_draw !== false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Cast Your Vote
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="w-4 h-4" />
            {totalVotes}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div
          className={cn("grid gap-3", showDraw ? "grid-cols-3" : "grid-cols-2")}
        >
          <VoteButton
            active={userVote === "HOME"}
            disabled={isVoting}
            label={match.home_team.short_code}
            logo={match.home_team.logo_url}
            percent={votes.home}
            colorClass="border-emerald-500 bg-emerald-500/10"
            onClick={() => handleVote("HOME")}
          />

          {showDraw && (
            <VoteButton
              active={userVote === "DRAW"}
              disabled={isVoting}
              label="Draw"
              percent={votes.draw}
              colorClass="border-white bg-white/20"
              onClick={() => handleVote("DRAW")}
            />
          )}

          <VoteButton
            active={userVote === "AWAY"}
            disabled={isVoting}
            label={match.away_team.short_code}
            logo={match.away_team.logo_url}
            percent={votes.away}
            colorClass="border-blue-500 bg-blue-500/10"
            onClick={() => handleVote("AWAY")}
          />
        </div>

        {!isAuthenticated && (
          <p className="text-center text-sm text-muted-foreground">
            <a
              href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
              className="text-blue-500 hover:underline"
            >
              Login
            </a>{" "}
            to vote
          </p>
        )}
      </CardContent>
    </Card>
  );
}
