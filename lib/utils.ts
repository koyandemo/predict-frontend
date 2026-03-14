import {
  isBigMatch,
  isDerby,
  isFinal,
  isQuarterFinal,
  isSemiFinal,
  isRoundOf16,
  isThirdPlacePlayoff,
} from "@/api/match.api";
import { MatchT } from "@/types/match.type";
import { clsx, type ClassValue } from "clsx";
import { LucideIcon, MessageSquare, TrendingUp, Users } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MatchDisplayStatusT =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "upcoming"
  | "kickOffSoon";

export interface MatchStatusConfigT {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  badgeVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "yellow"
    | "blue";
  badgeText: string;
  showScores: boolean;
  pulse?: boolean;
}

export const MATCH_DURATION_MINUTES = 120;
export const KICKOFF_SOON_MINUTES = 30;

type Stats = {
  activeUsers?: number;
  totalPredictions?: number;
};

export const AUTH_STORAGE_KEYS = {
  USER: "user",
  TOKEN: "authToken",
  USER_ID: "userId",
};

export const MATCH_GENRES = [
  { title: "Final Matches", filter: isFinal },
  { title: "Semi-Final Matches", filter: isSemiFinal },
  { title: "Quarter-Final Matches", filter: isQuarterFinal },
  { title: "Round of 16", filter: isRoundOf16 },
  { title: "Third Place Playoff", filter: isThirdPlacePlayoff },
  { title: "Derby Matches", filter: isDerby },
  { title: "Big Matches", filter: isBigMatch },
];

export function generateHeroBanners(stats?: Stats) {
  const formatK = (num?: number, divisor = 1000, fallback = "10K+") => {
    if (!num) return fallback;
    return `${Math.floor(num / divisor)}K+`;
  };

  return [
    {
      image: "/football-action.png",
      title: "Predict. Vote. Debate.",
      description:
        "Join thousands of football fans predicting match outcomes. Vote for your favorite teams and share your insights with the community.",
      stats: [
        {
          icon: Users,
          value: formatK(stats?.activeUsers, 1000, "10K+"),
          label: "Active Fans",
        },
        {
          icon: MessageSquare,
          value: formatK(stats?.totalPredictions, 1000, "50K+"),
          label: "Predictions",
        },
        { icon: TrendingUp, value: "78%", label: "Accuracy" },
      ],
    },
    {
      image: "/premier-league-trophy.png",
      title: "Premier League Action",
      description:
        "Stay up to date with the latest Premier League matches, predictions, and fan debates.",
      stats: [
        {
          icon: Users,
          value: formatK(stats?.activeUsers, 2000, "20K+"),
          label: "PL Fans",
        },
        {
          icon: MessageSquare,
          value: formatK(stats?.totalPredictions, 1000, "100K+"),
          label: "Votes",
        },
        { icon: TrendingUp, value: "82%", label: "Engagement" },
      ],
    },
    {
      image: "/champions-league-trophy.png",
      title: "Champions League Drama",
      description:
        "Experience the thrill of Europe's elite competition with real-time predictions and discussions.",
      stats: [
        {
          icon: Users,
          value: formatK(stats?.activeUsers, 1500, "15K+"),
          label: "UCL Fans",
        },
        {
          icon: MessageSquare,
          value: formatK(stats?.totalPredictions, 1000, "75K+"),
          label: "Predictions",
        },
        { icon: TrendingUp, value: "85%", label: "Accuracy" },
      ],
    },
  ];
}

export const groupMatchesByLeague = (
  matches: MatchT[],
  leagues: { id: string }[]
): Record<string, MatchT[]> => {
  const map: Record<string, MatchT[]> = {};

  leagues.forEach((league) => {
    map[league.id] = [];
  });

  matches.forEach((match) => {
    map[match.league_id]?.push(match);
  });

  return map;
};

// export const groupMatchesByLeague = (
//   groups: { title: string; matches: MatchT[] }[],
//   leagues: { id: string }[]
// ): Record<string, MatchT[]> => {
//   const map: Record<string, MatchT[]> = {};

//   // initialize map with league ids
//   leagues.forEach((league) => {
//     map[league.id] = [];
//   });

//   // flatten grouped matches
//   groups.forEach((group) => {
//     group.matches.forEach((match) => {
//       if (map[match.league_id]) {
//         map[match.league_id].push(match);
//       }
//     });
//   });

//   return map;
// };


export const formatCommentTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const generateGameWeeks = (startIndex: number) => {
  const totalWeeks = 3;

  const length = totalWeeks - startIndex + 1;

  return Array.from({ length: length > 0 ? length : 0 }, (_, i) => startIndex + i);
};