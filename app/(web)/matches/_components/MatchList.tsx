"use client";

import { useEffect, useMemo, useState } from "react";
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
import { StatusFilter } from "./StatusFilter";

const buildFilters = (league: string | null, status: string | null) => {
  const filters: Record<string, string | number> = {};

  if (league && league !== "all") {
    filters.league_id = Number(league);
  }

  if (status && status !== "all") {
    filters.status = status;
  }

  return Object.keys(filters).length ? filters : undefined;
};

export function MatchesList() {
  const [matches, setMatches] = useState<MatchT[]>([]);
  const [leagues, setLeagues] = useState<LeagueT[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedLeague(params.get("league"));
    setSelectedStatus(params.get("status"));
  }, []);

  useEffect(() => {
    const fetchLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const res = await getAllLeagues();
        if (res.success && res.data) {
          setLeagues(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch leagues:", err);
        setError("Failed to load leagues");
      } finally {
        setLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoadingMatches(true);
      setError(null);

      try {
        const filters = buildFilters(selectedLeague, selectedStatus);
        const res = await getAllMatches(filters);

        if (!res.success || !res.data) {
          throw new Error(res.error ?? "Failed to fetch matches");
        }

        setMatches(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch matches");
      } finally {
        setLoadingMatches(false);
      }
    };

    fetchMatches();
  }, [selectedLeague, selectedStatus]);

  useEffect(() => {
    const url = new URL(window.location.href);

    selectedLeague && selectedLeague !== "all"
      ? url.searchParams.set("league", selectedLeague)
      : url.searchParams.delete("league");

    selectedStatus && selectedStatus !== "all"
      ? url.searchParams.set("status", selectedStatus)
      : url.searchParams.delete("status");

    window.history.replaceState({}, "", url);
  }, [selectedLeague, selectedStatus]);

  const title = useMemo(() => {
    if (selectedStatus && selectedStatus !== "all") {
      return `${selectedStatus[0].toUpperCase()}${selectedStatus.slice(
        1
      )} Matches`;
    }

    if (selectedLeague && selectedLeague !== "all") {
      return `${
        leagues.find((l) => l.id === selectedLeague)?.name ?? ""
      } Matches`;
    }

    return "All Matches";
  }, [selectedLeague, selectedStatus, leagues]);

  if (loadingLeagues) return <MatchesListSkeleton />;

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="space-y-8">
      {loadingLeagues ? (
        <FilterSkeleton />
      ) : (
        <div className="space-y-4">
          <FilterCard title="Filter by League">
            <LeagueFilter
              leagues={leagues}
              selectedLeague={selectedLeague}
              onSelectLeague={setSelectedLeague}
            />
          </FilterCard>

          <FilterCard title="Filter by Status">
            <StatusFilter
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
            />
          </FilterCard>
        </div>
      )}

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

function FilterCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card/50 rounded-2xl p-4 border border-border">
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        {title}
      </h2>
      {children}
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
