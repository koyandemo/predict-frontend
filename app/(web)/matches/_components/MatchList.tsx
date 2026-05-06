"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MatchesListSkeleton, MatchListSkeleton } from "@/components/skeletons";
import type { MatchT, MatchTypeT } from "@/types/match.type";
import { getAllMatches } from "@/apiConfig/match.api";
import { MatchCard } from "./MatchCard";
import { ErrorDisplay } from "../../../../components/ErrorDisplay";
import { LeagueFilter } from "./LeagueFilter";
import MatchListFilterCard from "./MatchListFilterCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FIFA_WORLD_CUP_GROUPS,
  FIFA_WORLD_CUP_TYPES,
} from "@/lib/fifaWorldCupUtils";
import { useLeagues } from "@/hooks/useLeague";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LIMIT = 8;

const normalize = (val: string | null, fallback = "all") =>
  val?.trim() || fallback;

const buildFilters = (
  league_id: string,
  status: string,
  group_name: string,
  type: MatchTypeT,
  page: number
) => {
  const filters: Record<string, string | number> = {
    page,
    limit: LIMIT,
  };
  if (league_id !== "all") filters.league_id = league_id;
  if (status !== "all") filters.status = status.toUpperCase();
  if (group_name !== "all") filters.group_name = group_name.toUpperCase();
  if (type) filters.type = type.toUpperCase();
  return filters;
};

export function MatchesList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const league_id = normalize(searchParams.get("league_id"));
  const status = normalize(
    searchParams.get("status")?.toUpperCase() as string,
    "all"
  );
  const group_name = normalize(searchParams.get("group_name"));
  const type = normalize(searchParams.get("type") || "GROUP_STAGE");

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(true);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value === "all" ? params.delete(key) : params.set(key, value.toUpperCase());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const {
    data: leagues = [],
    isLoading: loadingLeagues,
    error: leaguesError,
  } = useLeagues({ published: true });

  useEffect(() => {
    if (!league_id || league_id === "all") return;
    const league = leagues.find((l) => l.id === parseInt(league_id));
    if (league?.recommended_gameweek != null) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("gameweek_id", league.recommended_gameweek.toString());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [league_id, leagues]);

  const {
    data,
    isLoading: loadingMatches,
    error: matchesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MatchT[]>({
    queryKey: ["matches", league_id, status, group_name, type],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const filters = buildFilters(
        league_id,
        status,
        group_name,
        type as MatchTypeT,
        pageParam as number
      );
      const res = await getAllMatches(filters as any);
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Failed to fetch matches");
      }
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If last page returned fewer than LIMIT, no more pages
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length + 1;
    },
    refetchOnWindowFocus: false,
  });

  const matches = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  // Update hasMoreRef in sync with hasNextPage
  useEffect(() => {
    hasMoreRef.current = !!hasNextPage;
  }, [hasNextPage]);

  // Window scroll infinite load
  const handleScroll = useCallback(() => {
    if (!hasMoreRef.current || isFetchingNextPage) return;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (scrollTop + windowHeight >= docHeight - 400) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // If content doesn't fill the page, keep loading until scrollable
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const isScrollable =
      document.documentElement.scrollHeight > window.innerHeight;
    if (!isScrollable) {
      fetchNextPage();
    }
  }, [matches, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const title = useMemo(() => {
    if (status && status !== "all") {
      return `${status[0].toUpperCase()}${status
        .slice(1)
        .toLowerCase()} Matches`;
    }
    if (league_id && league_id !== "all") {
      const name =
        leagues.find((l) => l.id === parseInt(league_id))?.name ?? "";
      return `${name} Matches`;
    }
    return "All Matches";
  }, [league_id, status, leagues]);

  if (loadingLeagues) return <MatchesListSkeleton />;

  if (leaguesError || matchesError) {
    return (
      <ErrorDisplay
        error={
          (leaguesError as Error)?.message ??
          (matchesError as Error)?.message ??
          "Something went wrong"
        }
      />
    );
  }

  const hasActiveFilters =
    league_id !== "all" ||
    status !== "all" ||
    group_name !== "all" ||
    type !== "GROUP_STAGE";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <MatchListFilterCard title="Filter by League">
          <LeagueFilter
            leagues={leagues}
            selectedLeague={league_id}
            onSelectLeague={(val) => setParam("league_id", val as string)}
          />
        </MatchListFilterCard>

        <div className="flex justify-end items-end gap-2 mt-10">
          <Select
            value={status.toLowerCase()}
            onValueChange={(val) => setParam("status", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
              <SelectItem value="postponed">Postponed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(val) => setParam("type", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              {FIFA_WORLD_CUP_TYPES.map((data) => (
                <SelectItem key={data} value={data}>
                  {data}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {type?.toUpperCase() === "GROUP_STAGE" && (
            <Select
              value={group_name}
              onValueChange={(val) => setParam("group_name", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Group</SelectItem>
                {FIFA_WORLD_CUP_GROUPS.map((data) => (
                  <SelectItem key={data} value={data}>
                    Group {data}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground gap-1 h-[36px]"
            >
              <RefreshCwIcon className="h-3.5 w-3.5" />
              Reset All
            </Button>
          )}
        </div>
      </div>

      <div>
        {loadingMatches ? (
          <MatchListSkeleton />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <span className="text-sm text-muted-foreground">
                {matches.length} matches
              </span>
            </div>

            {matches.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}

            {/* Bottom sentinel & loading indicator */}
            <div ref={loadMoreRef} className="h-1" />
            {isFetchingNextPage && (
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-xl border border-border p-4 h-[200px]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <Skeleton className="h-8 w-12 rounded-lg" />
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-12 w-12 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-2 w-full rounded-full mb-2" />
                    <div className="flex items-center justify-center gap-1">
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!hasNextPage && matches.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">
                All matches loaded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">No matches found</p>
    </div>
  );
}

/**
 * @old_version
 */

// "use client";

// import { useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";
// import { MatchesListSkeleton, MatchListSkeleton } from "@/components/skeletons";
// import type { MatchT, MatchTypeT } from "@/types/match.type";
// import { getAllMatches } from "@/apiConfig/match.api";
// import { MatchCard } from "./MatchCard";
// import { ErrorDisplay } from "../../../../components/ErrorDisplay";
// import { LeagueFilter } from "./LeagueFilter";
// import MatchListFilterCard from "./MatchListFilterCard";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   FIFA_WORLD_CUP_GROUPS,
//   FIFA_WORLD_CUP_TYPES,
// } from "@/lib/fifaWorldCupUtils";
// import { useLeagues } from "@/hooks/useLeague";
// import { Button } from "@/components/ui/button";
// import { RefreshCwIcon } from "lucide-react";

// const normalize = (val: string | null, fallback = "all") =>
//   val?.trim() || fallback;

// const buildFilters = (
//   league_id: string,
//   status: string,
//   group_name: string,
//   type: MatchTypeT
// ) => {
//   const filters: Record<string, string | number> = {};
//   if (league_id !== "all") filters.league_id = league_id;
//   if (status !== "all") filters.status = status.toUpperCase();
//   if (group_name !== "all") filters.group_name = group_name.toUpperCase();
//   if (type) filters.type = type.toUpperCase();
//   return Object.keys(filters).length ? filters : undefined;
// };

// export function MatchesList() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const league_id = normalize(searchParams.get("league_id"));
//   const status = normalize(
//     searchParams.get("status")?.toUpperCase() as string,
//     "all"
//   );
//   const group_name = normalize(searchParams.get("group_name"));
//   const type = normalize(searchParams.get("type") || "GROUP_STAGE");

//   const setParam = (key: string, value: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     value === "all" ? params.delete(key) : params.set(key, value.toUpperCase());
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   };

//   const resetFilters = () => {
//     router.replace(pathname, { scroll: false });
//   };

//   const {
//     data: leagues = [],
//     isLoading: loadingLeagues,
//     error: leaguesError,
//   } = useLeagues({ published: true });

//   useEffect(() => {
//     if (!league_id || league_id === "all") return;
//     const league = leagues.find((l) => l.id === parseInt(league_id));
//     if (league?.recommended_gameweek != null) {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("gameweek_id", league.recommended_gameweek.toString());
//       router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//     }
//   }, [league_id, leagues]);

//   const {
//     data: matches = [],
//     isLoading: loadingMatches,
//     error: matchesError,
//   } = useQuery<MatchT[]>({
//     queryKey: ["matches", league_id, status, group_name, type],
//     queryFn: async () => {
//       const filters = buildFilters(
//         league_id,
//         status,
//         group_name,
//         type as MatchTypeT
//       );
//       const res = await getAllMatches(filters as any);
//       if (!res.success || !res.data) {
//         throw new Error(res.error ?? "Failed to fetch matches");
//       }
//       return res.data;
//     },
//     refetchOnWindowFocus: false,
//   });

//   const title = useMemo(() => {
//     if (status && status !== "all") {
//       return `${status[0].toUpperCase()}${status
//         .slice(1)
//         .toLowerCase()} Matches`;
//     }
//     if (league_id && league_id !== "all") {
//       const name =
//         leagues.find((l) => l.id === parseInt(league_id))?.name ?? "";
//       return `${name} Matches`;
//     }
//     return "All Matches";
//   }, [league_id, status, leagues]);

//   if (loadingLeagues) return <MatchesListSkeleton />;

//   if (leaguesError || matchesError) {
//     return (
//       <ErrorDisplay
//         error={
//           (leaguesError as Error)?.message ??
//           (matchesError as Error)?.message ??
//           "Something went wrong"
//         }
//       />
//     );
//   }

//   const hasActiveFilters =
//     league_id !== "all" ||
//     status !== "all" ||
//     group_name !== "all" ||
//     type !== "GROUP_STAGE";

//   return (
//     <div className="space-y-8">
//       <div className="space-y-4">
//         <MatchListFilterCard title="Filter by League">
//           <LeagueFilter
//             leagues={leagues}
//             selectedLeague={league_id}
//             onSelectLeague={(val) => setParam("league_id", val as string)}
//           />
//         </MatchListFilterCard>

//         <div className="flex justify-end items-end gap-2 mt-10">
//           <Select
//             value={status.toLowerCase()} // display lowercase in UI
//             onValueChange={(val) => setParam("status", val)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="scheduled">Scheduled</SelectItem>
//               <SelectItem value="live">Live</SelectItem>
//               <SelectItem value="finished">Finished</SelectItem>
//               <SelectItem value="postponed">Postponed</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select value={type} onValueChange={(val) => setParam("type", val)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Filter by Type" />
//             </SelectTrigger>
//             <SelectContent>
//               {FIFA_WORLD_CUP_TYPES.map((data) => (
//                 <SelectItem key={data} value={data}>
//                   {data}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {type?.toUpperCase() === "GROUP_STAGE" && (
//             <Select
//               value={group_name}
//               onValueChange={(val) => setParam("group_name", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by Group" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Group</SelectItem>
//                 {FIFA_WORLD_CUP_GROUPS.map((data) => (
//                   <SelectItem key={data} value={data}>
//                     Group {data}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}

//           {hasActiveFilters && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={resetFilters}
//               className="text-muted-foreground hover:text-foreground gap-1 h-[36px]"
//             >
//               <RefreshCwIcon className="h-3.5 w-3.5" />
//               Reset All
//             </Button>
//           )}
//         </div>
//       </div>

//       <div>
//         {loadingMatches ? (
//           <MatchListSkeleton />
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold">{title}</h2>
//               <span className="text-sm text-muted-foreground">
//                 {matches.length} matches
//               </span>
//             </div>

//             {matches.length === 0 ? (
//               <EmptyState />
//             ) : (
//               <div className="grid gap-3 md:gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
//                 {matches.map((match) => (
//                   <MatchCard key={match.id} match={match} />
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="text-center py-12">
//       <p className="text-muted-foreground">No matches found</p>
//     </div>
//   );
// }
