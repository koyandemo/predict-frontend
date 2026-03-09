"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { LeagueT } from "@/types/league.type"

interface LeagueFilterProps {
  leagues: LeagueT[]
  selectedLeague: string | null
  onSelectLeague: (leagueId: string | null) => void
}

export function LeagueFilter({ leagues, selectedLeague, onSelectLeague }: LeagueFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleSelectLeague = (leagueId: string | null) => {
    onSelectLeague(leagueId)
    
    // Update URL with query parameter
    const params = new URLSearchParams(searchParams.toString())
    if (leagueId && leagueId !== "all") {
      params.set("league", leagueId)
    } else {
      params.delete("league")
    }
    
    router.push(`/matches/?${params.toString()}`)
  }



  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      <button
        onClick={() => handleSelectLeague("all")}
        className={cn(
          "flex items-center gap-2 px-3 md:px-4 h-[36px] md:h-[42px] rounded-full text-sm font-medium transition-all",
          selectedLeague === "all" || selectedLeague === null
            ? "bg-primary text-primary-foreground"
            : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border",
        )}
      >
        All Leagues
      </button>
      {leagues.map((league) => (
        <button
          key={league.id}
          onClick={() => handleSelectLeague(league.id)}
          className={cn(
            "flex items-center gap-2 px-3 md:px-4 h-[36px] md:h-[42px] rounded-full text-sm font-medium transition-all",
            selectedLeague === league.id
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border",
          )}
        >
          {league.logo && (
            <Image
              src={league.logo}
              alt={league.name}
              width={20}
              height={20}
              className="rounded-full object-cover"
            />
          )}
          {league.name}
        </button>
      ))}
    </div>
  )
}