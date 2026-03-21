import {
  MatchFilterT,
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
export const isRoundOf16 = (m: MatchT) => m.type === "ROUND_OF_16";
export const isThirdPlacePlayoff = (m: MatchT) =>
  m.type === "THIRD_PLACE_PLAYOFF";
export const isGroupStage = (m: MatchT) => m.type === "GROUP_STAGE";

export const isDerby = (m: MatchT) =>
  m.derby && !isFinal(m) && !isSemiFinal(m) && !isQuarterFinal(m);

export const isBigMatch = (m: MatchT) =>
  m.big_match &&
  !isFinal(m) &&
  !isSemiFinal(m) &&
  !isQuarterFinal(m) &&
  !m.derby;

export const isKnockoutMatch = (m: MatchT) =>
  isFinal(m) ||
  isSemiFinal(m) ||
  isQuarterFinal(m) ||
  isRoundOf16(m) ||
  isThirdPlacePlayoff(m);


export const getAllMatches = async (
  payload?: MatchFilterT
): Promise<ApiResponse<MatchT[]>> => {
  try {
    const response = await apiConfig.get(`/matches`, {
      params: payload,
    });
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






