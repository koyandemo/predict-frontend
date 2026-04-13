import { LeagueT } from "@/types/league.type";
import apiConfig from "./apiConfig";

export const getAllLeagues = async ({ published }: { published: boolean }) => {
  try {
    const response = await apiConfig.get(`/leagues?published=${published}`);

    const result = response.data;
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch leagues",
      };
    }

    return {
      success: true,
      data: result.data.sort(
        (a: LeagueT, b: LeagueT) => a.sort_order - b.sort_order
      ),
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
