import { LeagueT } from "@/types/league.type";
import {
  ApiCommentT,
  ApiVoteCountT,
  MatchT,
} from "@/types/match.type";
import apiConfig from "./apiConfig";
import { TeamT } from "@/types/team.type";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const isUpcoming = (match: MatchT) => match.status !== "FINISHED";
export const isFinal = (m: MatchT) => m.type === "FINAL";
export const isSemiFinal = (m: MatchT) => m.type === "SEMIFINAL";
export const isQuarterFinal = (m: MatchT) => m.type === "QUARTERFINAL";

export const isDerby = (m: MatchT) =>
  m.derby && !isFinal(m) && !isSemiFinal(m) && !isQuarterFinal(m);

export const isBigMatch = (m: MatchT) =>
  m.big_match &&
  !isFinal(m) &&
  !isSemiFinal(m) &&
  !isQuarterFinal(m) &&
  !m.derby;

//no need
export const getAllMatches = async (filters?: {
  league_id?: number;
  status?: string;
}): Promise<ApiResponse<MatchT[]>> => {
  try {
    const params = new URLSearchParams();

    // default filter
    params.append("published", "true");

    if (filters?.league_id !== undefined) {
      params.append("league", filters.league_id.toString());
    }

    if (filters?.status) {
      params.append("status", filters.status);
    }

    const response = await apiConfig.get(`/matches?${params.toString()}`);
    const result = response.data;
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch matches",
      };
    }
    return {
      success: true,
      data: result?.data?.data || [],
    };
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch matches",
    };
  }
};

// need to update
export const getMatchById = async (
  id: string
): Promise<ApiResponse<MatchT>> => {
  try {
    const response = await apiConfig.get(`/matches/${id}`);

    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch match",
      };
    }

    return {
      success: true,
      data: result?.data,
    };
  } catch (error: any) {
    console.error("Error fetching match:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch match",
    };
  }
};

//no need
export const getAllLeagues = async () => {
  try {
    const response = await apiConfig.get(`/leagues`);

    const result = response.data;
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch leagues",
      };
    }

    return {
      success: true,
      data: result
        .data!.map((apiLeague: LeagueT) => ({
          id: apiLeague.id.toString(),
          name: apiLeague.name,
          logo: apiLeague.logo_url,
          country: apiLeague.country,
          sort_order: apiLeague.sort_order || 0,
        }))
        .sort((a: LeagueT, b: LeagueT) => a.sort_order - b.sort_order),
    };
  } catch (error: any) {
    console.error("Error fetching leagues:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leagues",
    };
  }
};

//no need
export const getAllTeams = async (): Promise<ApiResponse<TeamT[]>> => {
  try {
    const response = await apiConfig.get(`/teams`);

    const result: ApiResponse<TeamT[]> = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch teams",
      };
    }

    return {
      success: true,
      data: result.data!,
    };
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch teams",
    };
  }
};

// no need
export const getMatchVoteCounts = async (
  matchId: number
): Promise<ApiResponse<ApiVoteCountT>> => {
  try {
    const response = await apiConfig.get(
      `/matches/${matchId}/admin-match-votes`
    );

    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch vote counts",
      };
    }

    return {
      success: true,
      data: result.data!,
    };
  } catch (error: any) {
    console.error("Error fetching vote counts:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch vote counts",
    };
  }
};

// Get comments for a match
export const getMatchComments = async (
  matchId: string
): Promise<ApiResponse<ApiCommentT[]>> => {
  try {
    const response = await apiConfig.get(`/matches/${matchId}/comments`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: ApiResponse<ApiCommentT[]> = response.data;
    return result;
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return {
      success: false,
      message: "Failed to fetch comments",
      error: error.response?.data?.message || error.message || "Unknown error",
    };
  }
};
