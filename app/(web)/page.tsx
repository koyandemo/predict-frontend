import { getAllLeagues, getAllMatches, isUpcoming } from "@/api/match.api";
import { HeroBanner } from "./_components/HeroBanner";
import { MatchCarousel } from "./_components/MatchCarousel";
import { LeagueT } from "@/types/league.type";
import { groupMatchesByLeague, MATCH_GENRES } from "@/lib/utils";

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

  const specialMatches = MATCH_GENRES.flatMap((s) =>
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
      <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-10">
        <HeroBanner />

        {MATCH_GENRES.map(({ title, filter }) => {
          const data = upcomingMatches.filter(filter);
          return (
            data.length > 0 && (
              <div key={title}>
                <MatchCarousel
                  title={title}
                  route="/matches/?status=finished"
                  showViewAll={false}
                  matches={data}
                />
              </div>
            )
          );
        })}
        <hr />

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
