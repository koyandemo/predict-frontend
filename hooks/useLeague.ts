import { getAllLeagues } from "@/api/league.api";
import { LeagueT } from "@/types/league.type";
import { useQuery } from "@tanstack/react-query";

type UseLeaguesParams = {
  published?: boolean;
};

export function useLeagues(params?: UseLeaguesParams) {
  return useQuery<LeagueT[]>({
    queryKey: ["leagues", params],
    queryFn: async () => {
      const res = await getAllLeagues({ published: params?.published ?? true });

      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Failed to fetch leagues");
      }

      return res.data;
    },
    // staleTime: 1000 * 60 * 5,
  });
}
