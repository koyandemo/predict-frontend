import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { formatCombinedMatchDateTimeForUser } from "@/lib/timezoneUtils"
import { MatchT } from "@/types/match.type"

interface MatchHeaderProps {
  match: MatchT
}

interface TeamCardProps {
  name: string
  logo?: string
  label: "Home" | "Away"
}

interface MatchMetaItemProps {
  icon: React.ReactNode
  children: React.ReactNode
}


function TeamCard({ name, logo, label }: TeamCardProps) {
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-3">
        <Image
          src={logo || "/placeholder.svg"}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <h2 className="text-base md:text-xl font-bold text-foreground">
        {name}
      </h2>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function MatchMetaItem({ icon, children }: MatchMetaItemProps) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{children}</span>
    </div>
  )
}

export function MatchHeader({ match }: MatchHeaderProps) {
  // const { date, time } = formatCombinedMatchDateTimeForUser(
  //   match.date,
  //   match.time,
  //   match.timezone
  // )
  const { date, time } = formatCombinedMatchDateTimeForUser(match.kickoff)

  return (
    <header>
      <div className="container mx-auto px-4 py-4 md:py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to matches
        </Link>

        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="px-4 py-1 text-sm">
            {match.league.name}
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-16 mb-6 md:mb-8">
          <TeamCard
            name={match.home_team.name}
            logo={match.home_team.logo_url}
            label="Home"
          />

          <span className="text-3xl md:text-5xl font-bold text-muted-foreground">
            VS
          </span>

          <TeamCard
            name={match.away_team.name}
            logo={match.away_team.logo_url}
            label="Away"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <MatchMetaItem icon={<CalendarDays className="w-4 h-4" />}>
            {date}
          </MatchMetaItem>

          <MatchMetaItem icon={<Clock className="w-4 h-4" />}>
            {time}
          </MatchMetaItem>

          <MatchMetaItem icon={<MapPin className="w-4 h-4" />}>
            {match.venue}
          </MatchMetaItem>
        </div>
      </div>
    </header>
  )
}
