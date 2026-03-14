"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MatchesListSkeleton, MatchListSkeleton } from "@/components/skeletons";
import type { MatchFilterT, MatchT } from "@/types/match.type";
import { getAllMatches } from "@/api/match.api";
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
import { FIFA_WORLD_CUP_GROUPS } from "@/lib/fifaWorldCupUtils";
import { useLeagues } from "@/hooks/useLeague";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon} from "lucide-react";

const buildFilters = (
  league_id: string | null,
  status: string | null,
  group_name: string | null
) => {
  const filters: Record<string, string | number> = {};

  if (league_id && league_id !== "all") filters.league_id = league_id;
  if (status && status !== "all") filters.status = status.toUpperCase();
  if (group_name && group_name !== "all")
    filters.group_name = group_name.toUpperCase();

  return Object.keys(filters).length ? filters : undefined;
};

export function MatchesList() {
  const [filterData, setFilterData] = useState<MatchFilterT>({
    league_id: "all",
    status: "SCHEDULED",
    group_name: "all",
    page: 1,
    limit: 10,
  });

  // Initialise filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilterData((prev) => ({
      ...prev,
      league_id: params.get("league_id") || "all",
      status: (params.get("status") as any) || "all",
      group_name: params.get("group_name") || "all",
    }));
  }, []);

  const {
    data: leagues = [],
    isLoading: loadingLeagues,
    error: leaguesError,
  } = useLeagues({ published: true });

  // Auto-set recommended gameweek when a league is selected
  useEffect(() => {
    if (!filterData.league_id || filterData.league_id === "all") return;
    const league = leagues.find(
      (l) => l.id === parseInt(filterData.league_id!)
    );
    if (league?.recommended_gameweek != null) {
      setFilterData((prev) => ({
        ...prev,
        gameWeek: league.recommended_gameweek!.toString(),
      }));
    }
  }, [filterData.league_id, leagues]);

  // Sync filterData → URL
  useEffect(() => {
    const url = new URL(window.location.href);

    filterData.league_id && filterData.league_id !== "all"
      ? url.searchParams.set("league_id", filterData.league_id)
      : url.searchParams.delete("league_id");

    filterData.status && filterData.status !== "all"
      ? url.searchParams.set("status", filterData.status)
      : url.searchParams.delete("status");

    filterData.group_name && filterData.group_name !== "all"
      ? url.searchParams.set("group_name", filterData.group_name)
      : url.searchParams.delete("group_name");

    window.history.replaceState({}, "", url);
  }, [filterData]);

  const {
    data: matches = [],
    isLoading: loadingMatches,
    error: matchesError,
  } = useQuery<MatchT[]>({
    queryKey: [
      "matches",
      filterData.league_id,
      filterData.status,
      filterData.group_name,
    ],
    queryFn: async () => {
      const filters = buildFilters(
        filterData.league_id || "all",
        filterData.status || "all",
        filterData.group_name || "all"
      );
      const res = await getAllMatches(filters as any);
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Failed to fetch matches");
      }
      return res.data;
    },
    // staleTime: 30_000, // treat data as fresh for 30 s
    refetchOnWindowFocus: false,
  });

  const title = useMemo(() => {
    if (filterData.status && filterData.status !== "all") {
      const s = filterData.status;
      return `${s[0].toUpperCase()}${s.slice(1).toLowerCase()} Matches`;
    }
    if (filterData.league_id && filterData.league_id !== "all") {
      const name =
        leagues.find((l) => l.id === parseInt(filterData.league_id!))?.name ??
        "";
      return `${name} Matches`;
    }
    return "All Matches";
  }, [filterData.league_id, filterData.status, leagues]);

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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <MatchListFilterCard title="Filter by League">
          <LeagueFilter
            leagues={leagues}
            selectedLeague={filterData.league_id as string}
            onSelectLeague={(val) =>
              // ✅ Fixed: was incorrectly setting `league` instead of `league_id`
              setFilterData((prev) => ({ ...prev, league_id: val }))
            }
          />
        </MatchListFilterCard>

        <div className="flex justify-end items-end gap-2 mt-10">
          <Select
            value={filterData.status?.toLocaleLowerCase()}
            onValueChange={(val) =>
              setFilterData((prev) => ({ ...prev, status: val as any }))
            }
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

          <Select
            value={filterData.group_name as string}
            onValueChange={(val) =>
              setFilterData((prev) => ({ ...prev, group_name: val }))
            }
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
          {(filterData.status !== "all" ||
            filterData.league_id !== "all" ||
            filterData.group_name !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilterData((prev) => ({
                  ...prev,
                  league_id: "all",
                  status: "all",
                  group_name: "all",
                }))
              }
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
