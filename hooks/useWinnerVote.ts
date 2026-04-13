import { useState, useEffect, useCallback } from "react";
import {
  getLeagueSeasonWinnerVotes,
  getUserWinnerVote,
  createWinnerVote,
  updateWinnerVote,
  WinnerVoteT,
  UserWinnerVoteT,
} from "@/apiConfig/winnerVote.api";

interface UseWinnerVoteResult {
  votes: WinnerVoteT[];
  userVote: UserWinnerVoteT | null;
  loading: boolean;
  error: string | null;
  hasVoted: boolean;
  submitVote: (teamId: number) => Promise<boolean>;
  refreshVotes: () => Promise<void>;
}

export const useWinnerVote = (leagueSeasonId: number): UseWinnerVoteResult => {
  const [votes, setVotes] = useState<WinnerVoteT[]>([]);
  const [userVote, setUserVote] = useState<UserWinnerVoteT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [votesResponse, userVoteResponse] = await Promise.all([
        getLeagueSeasonWinnerVotes(leagueSeasonId),
        getUserWinnerVote(leagueSeasonId),
      ]);

      if (votesResponse.success && votesResponse.data) {
        setVotes(votesResponse.data.votes);
      }

      if (userVoteResponse.success) {
        setUserVote(userVoteResponse.data || null);
      }

      if (!votesResponse.success) {
        setError(votesResponse.error || "Failed to fetch votes");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [leagueSeasonId]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const submitVote = async (teamId: number): Promise<boolean> => {
    try {
      setError(null);

      if (userVote) {
        const response = await updateWinnerVote(userVote.id, { team_id: teamId });
        if (response.success && response.data) {
          setUserVote(response.data);
          await fetchVotes();
          return true;
        } else {
          setError(response.error || "Failed to update vote");
          return false;
        }
      } else {
        const response = await createWinnerVote({
          league_season_id: leagueSeasonId,
          team_id: teamId,
        });
        if (response.success && response.data) {
          setUserVote(response.data);
          await fetchVotes();
          return true;
        } else {
          setError(response.error || "Failed to submit vote");
          return false;
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return false;
    }
  };

  return {
    votes,
    userVote,
    loading,
    error,
    hasVoted: !!userVote,
    submitVote,
    refreshVotes: fetchVotes,
  };
};
