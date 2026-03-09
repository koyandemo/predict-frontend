import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MatchT } from "@/types/match.type";
import { ScoreDisplay } from "./ScoreDisplay";
import {
  getMatchDisplayStatus,
  getMatchResultSummary,
  MATCH_STATUS_CONFIG,
} from "@/lib/matchStatusUtils";

interface Props {
  match: MatchT;
}

export function MatchResult({ match }: Props) {
  const displayStatus = getMatchDisplayStatus(match);

  const status =
    MATCH_STATUS_CONFIG[displayStatus as keyof typeof MATCH_STATUS_CONFIG] ??
    MATCH_STATUS_CONFIG.unknown;

  const StatusIcon = status.icon;
  const result = getMatchResultSummary(match);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5 text-yellow-500" />
            {status.title}
          </CardTitle>
          <Badge
            variant={status.badgeVariant as any}
            className={cn(status.pulse && "animate-pulse")}
          >
            {status.badgeText}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{status.subtitle}</p>
      </CardHeader>

      <CardContent>
        {status.showScores ? (
          <>
            <ScoreDisplay match={match} />

            {displayStatus === "live" && (
              <p className="text-center text-sm text-orange-500 font-medium">
                Match in progress
              </p>
            )}

            {result && (
              <p
                className={cn(
                  "text-center text-sm font-medium",
                  result.className
                )}
              >
                {result.text}
              </p>
            )}
          </>
        ) : (
          <FallbackView displayStatus={displayStatus} />
        )}
      </CardContent>
    </Card>
  );
}

function FallbackView({ displayStatus }: { displayStatus: string }) {
  if (displayStatus === "postponed") {
    return (
      <p className="text-center text-sm text-orange-500">
        This match has been postponed. New date will be announced soon.
      </p>
    );
  }

  if (displayStatus === "scheduled") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Match scheduled
      </p>
    );
  }

  if (displayStatus === "kickOffSoon") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Match will be start soon.
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      Match information not available
    </p>
  );
}
