"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MatchT, ScorePredictionT } from "@/types/match.type";
import { useAuth } from "@/context/AuthContext";
import { getScorePredictions, voteScorePrediction } from "@/api/prediction.api";

interface ScorePredictionCardProps {
  match: MatchT;
}

function useScorePredictions(matchId: number) {
  return useQuery({
    queryKey: ["score-predictions", matchId],
    queryFn: async () => {
      const res = await getScorePredictions(matchId);

      if (!res.success || !res.data) return [];

      return res.data.predictions;
    },
    enabled: !!matchId,
  });
}

function useVotePrediction(matchId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (predictionId: number) =>
      voteScorePrediction(matchId, predictionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["score-predictions", matchId],
      });
    },
  });
}

export function ScorePredictionCard({ match }: ScorePredictionCardProps) {
  const { user, isAuthenticated } = useAuth();
  const matchId = Number(match.id);

  const { data: predictions = [] } = useScorePredictions(matchId);
  const voteMutation = useVotePrediction(matchId);

  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(
    
  );

  const totalVotes = predictions.reduce(
    (sum: number, p: any) => sum + p.votes,
    0
  );

  const handleSelect = async (p: ScorePredictionT) => {
    if (!isAuthenticated || !user?.user_id) {
      alert("Please login to vote");
      return;
    }

    // if (["FINISHED","POSTPONED"].includes(match.status)) {
    //   alert("Voting is closed for this match");
    //   return;
    // }

    const key = `${p.home_score}-${p.away_score}`;

    if (key === selectedPrediction) return;

    await voteMutation.mutateAsync(p.id);

    setSelectedPrediction(key);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base md:text-lg">
            ⚽ Score Predictions
          </CardTitle>

          <span className="text-xs md:text-sm font-semibold text-primary">
            {totalVotes.toLocaleString()} votes
          </span>
        </div>

        <p className="text-xs md:text-sm text-muted-foreground">
          Select your predicted final score
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3">
          {predictions.map((p: ScorePredictionT, index: number) => {
            const key = `${p.home_score}-${p.away_score}`;
            const isSelected = selectedPrediction === key || p.current_user_vote;

            const isDraw = p.home_score === p.away_score;
            const isHomeWin = p.home_score > p.away_score;
            const isAwayWin = p.home_score < p.away_score;

            return (
              <button
                key={key}
                onClick={() => handleSelect(p)}
                disabled={!isAuthenticated || voteMutation.isPending}
                className={cn(
                  "relative flex items-center justify-between rounded-lg border p-3 md:p-4 transition",
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-border/50 hover:border-primary/40"
                )}
              >
                <div className="flex items-center gap-5">
                  <span className="text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {match.home_team.short_code}
                    </span>

                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md font-bold",
                        isHomeWin
                          ? "bg-primary/20 text-primary"
                          : isDraw
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-muted"
                      )}
                    >
                      {p.home_score}
                    </span>

                    <span className="text-muted-foreground text-xs">vs</span>

                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md font-bold",
                        isAwayWin
                          ? "bg-primary/20 text-primary"
                          : isDraw
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-muted"
                      )}
                    >
                      {p.away_score}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {match.away_team.short_code}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm md:text-lg font-bold">{p.percent}%</p>

                  <p className="text-[10px] text-muted-foreground">
                    {p.votes.toLocaleString()} votes
                  </p>
                </div>

                {isSelected && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isAuthenticated && (
          <p className="mt-4 text-center text-xs md:text-sm text-muted-foreground">
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>{" "}
            to vote on score predictions
          </p>
        )}
      </CardContent>
    </Card>
  );
}