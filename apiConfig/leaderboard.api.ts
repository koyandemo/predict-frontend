import { AuthResponseT } from "@/types/auth.type";
import apiConfig from "./apiConfig";


export const getLeaderboard = async (): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.get(`/predictions/leaderboard`);
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to fetch leaderboard',
      error: e.response?.data?.message || e.message,
    };
  }
};