import { ApiResponse } from "./match.api";
import apiConfig from "./apiConfig";
import { MatchVoteCountT } from "@/types/matchVote.type";

export const getMatchVotes = async (
  matchId: number
): Promise<ApiResponse<MatchVoteCountT>> => {
  try {
    const response = await apiConfig.get(`/matches/${matchId}/match-votes`);

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
