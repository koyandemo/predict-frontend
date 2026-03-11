import { addMinutes, isAfter, isBefore } from "date-fns";
import { convertTimezoneToUtc } from "@/lib/timezoneUtils";
import { AlertCircle, Calendar, Clock, Play, Trophy } from "lucide-react";
import { MatchT } from "@/types/match.type";
import { KICKOFF_SOON_MINUTES, MATCH_DURATION_MINUTES, MatchDisplayStatusT, MatchStatusConfigT } from "./utils";

export function getMatchDisplayStatus(match: MatchT): MatchDisplayStatusT {
  if (match.status === "FINISHED") return "finished";
  if (match.status === "LIVE") return "live";
  if (match.status === "POSTPONED") return "postponed";

  const kickoffLocal = new Date(`${match.kickoff}`);
  const kickoffUtc = convertTimezoneToUtc(kickoffLocal, match.timezone);

  const now = new Date();
  const matchEnd = addMinutes(kickoffUtc, MATCH_DURATION_MINUTES);
  const kickoffSoonThreshold = addMinutes(now, KICKOFF_SOON_MINUTES);

  if (isBefore(now, kickoffUtc)) {
    if (isBefore(kickoffUtc, kickoffSoonThreshold)) return "kickOffSoon";
    return "upcoming";
  }

  if (isAfter(now, kickoffUtc) && isBefore(now, matchEnd)) {
    return "live";
  }

  return "finished";
}

export const getStatusBadgeVariant = (status: MatchDisplayStatusT) => {
  switch (status) {
    case "live":
      return "destructive";
    case "finished":
      return "default";
    case "postponed":
      return "secondary";
    case "kickOffSoon":
      return "yellow";
    case "upcoming":
      return "blue";
    default:
      return "outline";
  }
};


export const MATCH_STATUS_CONFIG: Record<string, MatchStatusConfigT> = {
  scheduled: {
    icon: Calendar,
    title: "Upcoming Match",
    subtitle: "Match scheduled to start",
    badgeVariant: "secondary",
    badgeText: "Scheduled",
    showScores: false,
  },
  live: {
    icon: Play,
    title: "Debate Match",
    subtitle: "Match in progress",
    badgeVariant: "destructive",
    badgeText: "DEBATE",
    showScores: true,
    pulse: true,
  },
  finished: {
    icon: Trophy,
    title: "Full Time Result",
    subtitle: "Final score of the match",
    badgeVariant: "default",
    badgeText: "Finished",
    showScores: true,
  },
  postponed: {
    icon: AlertCircle,
    title: "Match Postponed",
    subtitle: "Match has been postponed",
    badgeVariant: "outline",
    badgeText: "Postponed",
    showScores: false,
  },
  kickOffSoon: {
    icon: Clock,
    title: "Match Kick Off Soon",
    subtitle: "Match will be start soon",
    badgeVariant: "yellow",
    badgeText: "Kick Off Soon",
    showScores: false,
  },
};

export function getMatchResultSummary(match: MatchT) {
  if (match.status !== "FINISHED") return null;
  if (match.home_score == null || match.away_score == null) return null;

  const diff = Math.abs(match.home_score - match.away_score);

  if (match.home_score === match.away_score) {
    return {
      text: "Match ended in a draw",
      className: "text-blue-500",
    };
  }

  if (match.home_score > match.away_score) {
    return {
      text: `${match.home_team.name} won by ${diff} goal${diff > 1 ? "s" : ""}`,
      className: "text-emerald-500",
    };
  }

  return {
    text: `${match.away_team.name} won by ${diff} goal${diff > 1 ? "s" : ""}`,
    className: "text-blue-500",
  };
}
