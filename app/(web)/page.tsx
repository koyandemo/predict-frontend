import {
  getAllLeagues,
  getAllMatches,
  isBigMatch,
  isDerby,
  isFinal,
  isQuarterFinal,
  isSemiFinal,
  isUpcoming,
} from "@/api/match.api";
import { MatchT } from "@/types/match.type";
import { HeroBanner } from "./_components/HeroBanner";
import { MatchCard } from "./matches/_components/MatchCard";
import { SpecialMatchCarousel } from "./_components/SpecialMatchCarousel";
import { MatchCarousel } from "./_components/MatchCarousel";
import { LeagueT } from "@/types/league.type";

const groupMatchesByLeague = (
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

export default async function HomePage() {
  const [matchesRes, leaguesRes] = await Promise.all([
    getAllMatches(),
    getAllLeagues(),
  ]);



  if (!matchesRes.success || !leaguesRes.success) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <HeroBanner />
          <p className="text-center py-12 text-muted-foreground">
            Failed to load matches. Please try again later.
          </p>
        </main>
      </div>
    );
  }

  const matches = matchesRes.data ?? [];
  const leagues = leaguesRes.data ?? [];

  const upcomingMatches = matches.filter(isUpcoming);

  const specialSections = [
    { title: "Final Matches", filter: isFinal },
    { title: "Semi-Final Matches", filter: isSemiFinal },
    { title: "Quarter-Final Matches", filter: isQuarterFinal },
    { title: "Derby Matches", filter: isDerby },
    { title: "Big Matches", filter: isBigMatch },
  ];

  const specialMatches = specialSections.flatMap((s) =>
    upcomingMatches.filter(s.filter)
  );

  const regularMatches = upcomingMatches.filter(
    (m) => !specialMatches.includes(m)
  );

  const matchesByLeague = groupMatchesByLeague(regularMatches, leagues);

  const finishedMatches = matches.filter(
    (match) => match.status === "FINISHED"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8">
        <HeroBanner />

        {/* Special match sections */}
        {specialSections.map(({ title, filter }) => {
          const data = upcomingMatches.filter(filter);
          return (
            data.length > 0 && (
              <div key={title} className="mb-12">
                <SpecialMatchCarousel title={title} matches={data} />
              </div>
            )
          );
        })}

        {/* League sections */}
        {leagues.map((league:LeagueT) => {
          const leagueMatches = matchesByLeague[league.id] ?? [];
          return (
            leagueMatches.length > 0 && (
              <div key={league.id} className="mb-12">
                <MatchCarousel
                  title={league.name}
                  leagueId={league.id}
                  matches={leagueMatches}
                />
              </div>
            )
          );
        })}

        {/* Finished matches */}
        {finishedMatches.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Finished Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
