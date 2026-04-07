import apiConfig from "./apiConfig";
import { ApiResponseT } from "@/types/api.type";

export interface WinnerVoteT {
  team_id: number;
  team_name: string;
  team_logo: string;
  user_votes: number;
  admin_votes: number;
  total_votes: number;
}

export interface UserWinnerVoteT {
  id: number;
  user_id: number;
  league_season_id: number;
  team_id: number;
  team: {
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
  };
  created_at: string;
  updated_at: string;
}

interface LeagueSeasonWinnerVotesResponse {
  league_season: {
    id: number;
    league_id: number;
    season_id: number;
    created_at: string;
    league: {
      id: number;
      name: string;
      country: string;
      logo_url: string | null;
    };
    season: {
      id: number;
      name: string;
      year: number | null;
    };
  };
  votes: WinnerVoteT[];
}

export const getLeagueSeasonWinnerVotes = async (
  leagueSeasonId: number
): Promise<ApiResponseT<LeagueSeasonWinnerVotesResponse>> => {
  try {
    const response = await apiConfig.get(`/winner-votes/league-season/${leagueSeasonId}`);
    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch winner votes",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching winner votes:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to fetch winner votes",
    };
  }
};

export const getUserWinnerVote = async (
  leagueSeasonId: number
): Promise<ApiResponseT<UserWinnerVoteT | null>> => {
  try {
    const response = await apiConfig.get(`/winner-votes/user/${leagueSeasonId}`);
    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch your vote",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching user vote:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to fetch your vote",
    };
  }
};

export const createWinnerVote = async (
  data: { league_season_id: number; team_id: number }
): Promise<ApiResponseT<UserWinnerVoteT>> => {
  try {
    const response = await apiConfig.post("/winner-votes/vote", data);
    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to submit vote",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error creating winner vote:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to submit vote",
    };
  }
};

export const updateWinnerVote = async (
  voteId: number,
  data: { team_id: number }
): Promise<ApiResponseT<UserWinnerVoteT>> => {
  try {
    const response = await apiConfig.put(`/winner-votes/vote/${voteId}/key`, data);
    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to update vote",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error updating winner vote:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to update vote",
    };
  }
};
