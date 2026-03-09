import { FootballApiStatisticsT } from "@/types/football.type";

export const mockFootballApi = {
  async getLiveStats(): Promise<FootballApiStatisticsT> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      totalMatches: 10000,
      totalGoals: 25000,
      totalPredictions: 50000,
      activeUsers: 10000,
      liveMatches: 12,
    };
  },
};

export const footballApiService = {
  async getLiveStats(): Promise<FootballApiStatisticsT> {
    try {
      return await mockFootballApi.getLiveStats();
    } catch (error) {
      console.error("Error fetching live stats:", error);
      return {
        totalMatches: 0,
        totalGoals: 0,
        totalPredictions: 0,
        activeUsers: 0,
        liveMatches: 0,
      };
    }
  },
};
