import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCombinedMatchDateTimeForUser } from "@/lib/timezoneUtils";
import { MatchT } from "@/types/match.type";
import { TeamCard } from "./TeamCard";
import MatchMetaItem from "./MatchMetaItem";

interface MatchHeaderProps {
  match: MatchT;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  const { date, time } = formatCombinedMatchDateTimeForUser(match.kickoff);

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
            name={match.home_team_name}
            logo={match.home_team.logo_url}
            label="Home"
          />

          <span className="text-3xl md:text-5xl font-bold text-muted-foreground">
            VS
          </span>

          <TeamCard
            name={match.away_team_name}
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
  );
}
