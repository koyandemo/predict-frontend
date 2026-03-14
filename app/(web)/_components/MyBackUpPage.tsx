import { getAllLeagues, getAllMatches, isUpcoming, isKnockoutMatch, isGroupStage } from "@/api/match.api";
import { LeagueT } from "@/types/league.type";
import { groupMatchesByLeague, MATCH_GENRES } from "@/lib/utils";
import { HeroBanner } from "./HeroBanner";
import { MatchCarousel } from "./MatchCarousel";

export default async function HomePage() {
  const [matchesRes, leaguesRes] = await Promise.all([
    //for fifa league_id :16
    getAllMatches({league_id:16}),
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

  // Find World Cup league
  const worldCupLeague = leagues.find((l: LeagueT) => l.is_tournament || l.slug === "fifa-world-cup-2026");
  
  // Get World Cup matches if tournament exists
  const worldCupMatches = worldCupLeague 
    ? matches.filter(m => m.league_id === worldCupLeague.id && isUpcoming(m))
    : [];

  const specialMatches = MATCH_GENRES.map(({ title, filter }) => ({
    title,
    matches: upcomingMatches.filter(filter),
  })).filter((group) => group.matches.length > 0);

  const matchesByLeague = groupMatchesByLeague(upcomingMatches, leagues);

  const finishedMatches = matches.filter(
    (match) => match.status === "FINISHED"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-10">
        <HeroBanner />

        {/* FIFA World Cup Section */}
        {worldCupLeague && worldCupMatches.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">FIFA World Cup 2026 🏆</h2>
              <a 
                href="/world-cup" 
                className="text-sm text-primary hover:underline font-medium"
              >
                View Full Tournament →
              </a>
            </div>
            <MatchCarousel
              title="Featured Matches"
              route="/world-cup"
              matches={worldCupMatches.slice(0, 8)}
              showViewAll={false}
            />
          </section>
        )}

        {specialMatches.map(({ title, matches }: any) => {
          return (
            matches.length > 0 && (
              <div key={title}>
                <MatchCarousel
                  title={title}
                  route="/matches/?status=finished"
                  showViewAll={false}
                  matches={matches}
                />
              </div>
            )
          );
        })}

        {/* League sections */}
        {leagues.map((league: LeagueT) => {
          const leagueMatches = matchesByLeague[league.id] ?? [];
          return (
            leagueMatches.length > 0 && (
              <div key={league.id}>
                <MatchCarousel
                  title={league.name}
                  route={`/matches/?status=scheduled`}
                  matches={leagueMatches}
                />
                
              </div>
            )
          );
        })}
        {/* Finished matches */}
        {finishedMatches.length > 0 && (
          <div>
            <MatchCarousel
              title={"Finished Matches"}
              route="/matches/?status=finished"
              matches={finishedMatches}
            />
          </div>
        )}
      </main>
    </div>
  );
}
