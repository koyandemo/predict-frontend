import { MatchT } from "@/types/match.type";
import { TrendingUp, Trophy } from "lucide-react";
import Image from "next/image";

function TeamBlock({
  team,
  score,
  isWinner,
  isFav,
}: {
  team: MatchT["home_team"] | MatchT["away_team"];
  score?: number;
  isWinner: boolean;
  isFav: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm opacity-50" />
        {/* //border bg-card */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          <Image
            src={team.logo_url || "/football-field.png"}
            alt={team.name}
            fill
            className="object-contain p-1"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/football-field.png")
            }
          />
        </div>

        {isFav && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <TrendingUp className="h-2.5 w-2.5 text-primary-foreground" />
          </div>
        )}

        {isWinner && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <Trophy className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>

      <h3 className="w-full truncate text-center text-sm font-bold">
        {team.short_code}
      </h3>

      {score !== undefined && (
        <span className="mt-1 text-lg font-bold text-green-600">{score}</span>
      )}
    </div>
  );
}

export default TeamBlock;
