"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MatchesListSkeleton,
  FilterSkeleton,
  MatchListSkeleton,
} from "@/components/skeletons";
import type { MatchT } from "@/types/match.type";
import type { LeagueT } from "@/types/league.type";
import { getAllLeagues, getAllMatches } from "@/api/match.api";
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
import { generateGameWeeks } from "@/lib/utils";
import { FIFA_WORLD_CUP_GROUPS } from "@/lib/fifaWorldCupUtils";

type FilterData = {
  league: string | null;
  status: string;
  gameWeek: string;
  group_name:string;
};

const buildFilters = (
  league: string | null,
  status: string | null,
  gameWeek: string | null,
  group_name:string|null,
) => {
  const filters: Record<string, string | number> = {};

  if (league && league !== "all") {
    filters.league_id = Number(league);
  }

  if (status && status !== "all") {
    filters.status = status;
  }

  if (gameWeek && gameWeek !== "all") {
    filters.gameweek_id = gameWeek;
  }

  if(group_name && group_name !== "all"){
    filters.group_name = group_name;
  }

  return Object.keys(filters).length ? filters : undefined;
};

export function MatchesList() {
  const [filterData, setFilterData] = useState<FilterData>({
    league: null,
    status: "scheduled",
    gameWeek: "all",
    group_name:"all"
  });
  // const GAME_WEEKS = generateGameWeeks(1);

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilterData({
      league: params.get("league"),
      status: params.get("status") || "all",
      gameWeek: params.get("gameWeek") || "1",
      group_name:params.get("group_name") || "all"
    });
  }, []);

  // Fetch leagues
  const {
    data: leagues = [],
    isLoading: loadingLeagues,
    error: leaguesError,
  } = useQuery<LeagueT[]>({
    queryKey: ["leagues"],
    queryFn: async () => {
      const res = await getAllLeagues();
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Failed to fetch leagues");
      }
      return res.data;
    },
  });

  // Auto-update gameWeek when league changes based on recommended_gameweek
  useEffect(() => {
    if (!filterData.league || filterData.league === "all") return;

    const league = leagues.find((l) => l.id === parseInt(filterData.league!));
    if (league?.recommended_gameweek != null) {
      setFilterData((prev) => ({
        ...prev,
        gameWeek: league.recommended_gameweek!.toString(),
      }));
    }
  }, [filterData.league, leagues]);

  // Fetch matches — re-runs automatically when filterData changes
  const {
    data: matches = [],
    isLoading: loadingMatches,
    error: matchesError,
  } = useQuery<MatchT[]>({
    queryKey: ["matches", filterData],
    queryFn: async () => {
      const filters = buildFilters(
        filterData.league,
        filterData.status,
        filterData.gameWeek,
        filterData.group_name
      );
      const res = await getAllMatches(filters);
      if (!res.success || !res.data) {
        throw new Error(res.error ?? "Failed to fetch matches");
      }
      return res.data;
    },
  });

  // Sync filters to URL
  useEffect(() => {
    const url = new URL(window.location.href);

    filterData.league && filterData.league !== "all"
      ? url.searchParams.set("league", filterData.league)
      : url.searchParams.delete("league");

    filterData.status && filterData.status !== "all"
      ? url.searchParams.set("status", filterData.status)
      : url.searchParams.delete("status");

    filterData.gameWeek && filterData.gameWeek !== "all"
      ? url.searchParams.set("gameWeek", filterData.gameWeek)
      : url.searchParams.delete("gameWeek");

    window.history.replaceState({}, "", url);
  }, [filterData]);

  const title = useMemo(() => {
    if (filterData.status && filterData.status !== "all") {
      return `${filterData.status[0].toUpperCase()}${filterData.status.slice(1)} Matches`;
    }
    if (filterData.league && filterData.league !== "all") {
      return `${
        leagues.find((l) => l.id === parseInt(filterData.league!))?.name ?? ""
      } Matches`;
    }
    return "All Matches";
  }, [filterData.league, filterData.status, leagues]);

  if (loadingLeagues) return <MatchesListSkeleton />;

  if (leaguesError || matchesError) {
    return (
      <ErrorDisplay
        error={
          leaguesError?.message ??
          matchesError?.message ??
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
            selectedLeague={filterData.league}
            onSelectLeague={(val) =>
              setFilterData((prev) => ({ ...prev, league: val }))
            }
          />
        </MatchListFilterCard>
        <div className="flex justify-end items-end gap-2 mt-10">
          <div>
            <Select
              value={filterData.status}
              onValueChange={(val) =>
                setFilterData((prev) => ({ ...prev, status: val }))
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
          </div>
           <div>
            <Select
              value={filterData.group_name}
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
                {/* <SelectItem value="A">Group A</SelectItem>
                <SelectItem value="B">Group B</SelectItem>
                <SelectItem value="C">Group C</SelectItem>
                <SelectItem value="D">Group D</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <Select
              value={filterData.gameWeek}
              onValueChange={(val) =>
                setFilterData((prev) => ({ ...prev, gameWeek: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Game Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gameweek</SelectItem>
                {GAME_WEEKS.map((gw) => (
                  <SelectItem key={gw} value={gw.toString()}>
                    Gameweek {gw}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
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