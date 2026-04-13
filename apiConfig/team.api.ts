import { TeamT } from "@/types/team.type";
import apiConfig from "./apiConfig";
import { ApiResponseT } from "@/types/api.type";
import { FIFA_WORLD_CUP_LEAGUE_SEASON_ID } from "@/lib/fifaWorldCupUtils";

export interface TeamWithVotesT extends TeamT {
  total_votes: number;
}

/**
 * Get all teams with vote statistics for World Cup voting page
 * @param leagueSeasonId - The league season ID to filter votes
 */
export const getTeamsByVote = async (
  leagueSeasonId?: number
): Promise<ApiResponseT<TeamWithVotesT[]>> => {
  try {
    const url = leagueSeasonId
      ? `/teams/by-vote/${leagueSeasonId}`
      : "/teams/by-vote";

    const response = await apiConfig.get(url);
    const result = response.data;

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch teams with votes",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error fetching teams with votes:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch teams with votes",
    };
  }
};

export const getFifaWorldCupStanding = async () => {
  try {
    const response = await apiConfig.get(
      `/teams/fifa/world-cup-team-standings?league_season_id=${FIFA_WORLD_CUP_LEAGUE_SEASON_ID}`,
    );
    return response?.data?.data;
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch FIFA World Cup standings",
    };
  }
};
