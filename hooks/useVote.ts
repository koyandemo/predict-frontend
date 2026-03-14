import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MatchT } from "@/types/match.type";
import { submitPrediction } from "@/api/prediction.api";
import { getMatchVotes } from "@/api/matchVote.api";
import { useAuth } from "@/context/AuthContext";

export type VoteChoice = "HOME" | "AWAY" | "DRAW";

export function useVoting(match: MatchT, onVoteUpdate?: () => void) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const matchId = Number(match.id);

  const { data, isLoading } = useQuery({
    queryKey: ["match-votes-count", matchId],
    queryFn: async () => {
      const res = await getMatchVotes(matchId);
      if (!res.success || !res.data) return null;
      return res.data;
    },
    enabled: !!matchId,
  });

  const voteMutation = useMutation({
    mutationFn: (choice: VoteChoice) => submitPrediction(matchId, choice),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["match-votes-count", matchId],
      });

      onVoteUpdate?.();
    },
  });

  const handleVote = async (choice: VoteChoice) => {
    if (!isAuthenticated) return;

    if (["FINISHED", "POSTPONED"].includes(match.status)) {
      alert("Voting is closed for this match");
      return;
    }

    await voteMutation.mutateAsync(choice);
  };

  return {
    votes: {
      home: data?.home_percentage ?? 0,
      draw: data?.draw_percentage ?? 0,
      away: data?.away_percentage ?? 0,
    },

    totalVotes: data?.total_votes ?? 0,

    userVote: data?.current_user_vote ?? null,

    isVoting: voteMutation.isPending,
    isLoading,
    isAuthenticated: isAuthenticated,

    handleVote,
  };
}
