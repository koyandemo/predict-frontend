"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { LeagueT } from "@/types/league.type";

interface LeagueFilterProps {
  leagues: LeagueT[];
  selectedLeague: string | null;
  onSelectLeague: (leagueId: string | null) => void;
}

const PILL_BASE = "flex items-center gap-2 px-3 md:px-4 h-9 rounded-full text-sm font-medium transition-all";
const PILL_ACTIVE = "bg-primary text-primary-foreground";
const PILL_INACTIVE = "bg-card text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground";

function isActive(selectedLeague: string | null, leagueId: string) {
  if (leagueId === "all") return selectedLeague === "all" || selectedLeague === null;
  return selectedLeague === leagueId;
}

export function LeagueFilter({ leagues, selectedLeague, onSelectLeague }: LeagueFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (leagueId: string | null) => {
    onSelectLeague(leagueId);

    const params = new URLSearchParams(searchParams.toString());
    leagueId && leagueId !== "all"
      ? params.set("league", leagueId)
      : params.delete("league");

    router.push(`/matches/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      <LeaguePill
        label="All Leagues"
        active={isActive(selectedLeague, "all")}
        onClick={() => handleSelect("all")}
      />
      {leagues.map((league) => (
        <LeaguePill
          key={league.id}
          label={league.name}
          active={isActive(selectedLeague, String(league.id))}
          logo={league.logo_url}
          onClick={() => handleSelect(String(league.id))}
        />
      ))}
    </div>
  );
}

interface LeaguePillProps {
  label: string;
  active: boolean;
  logo?: string | null;
  onClick: () => void;
}

function LeaguePill({ label, active, logo, onClick }: LeaguePillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(PILL_BASE, active ? PILL_ACTIVE : PILL_INACTIVE)}
    >
      {logo && (
        <Image
          src={logo}
          alt={`${label} logo`}
          width={20}
          height={20}
          className="w-[20px] h-[20px] rounded-full object-contain"
        />
      )}
      {label}
    </button>
  );
}