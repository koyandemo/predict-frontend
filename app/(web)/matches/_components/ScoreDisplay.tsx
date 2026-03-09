import { MatchT } from "@/types/match.type"

export function ScoreDisplay({ match }: { match: MatchT }) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      <TeamScore
        score={match.home_score}
        name={match.home_team.short_code}
      />
      <span className="text-2xl font-bold text-muted-foreground">-</span>
      <TeamScore
        score={match.away_score}
        name={match.away_team.short_code}
      />
    </div>
  )
}

function TeamScore({
  score,
  name,
}: {
  score?: number
  name: string
}) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold">{score}</div>
      <p className="text-sm text-muted-foreground truncate max-w-[100px]">
        {name}
      </p>
    </div>
  )
}
