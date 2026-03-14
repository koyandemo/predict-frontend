import { getAllLeagues, getAllMatches, isUpcoming, isKnockoutMatch } from "@/api/match.api";
import { HeroBanner } from "./_components/HeroBanner";
import { MatchCarousel } from "./_components/MatchCarousel";
import { LeagueT } from "@/types/league.type";
import { MatchT } from "@/types/match.type";
import { buildGroupSections, buildKnockoutSections, KNOCKOUT_TYPES } from "@/lib/fifaWorldCupUtils";
import WorldCupHeroBanner from "./_components/WorldCupHeroBanner";



export default async function HomePage() {
  const [matchesRes, leaguesRes] = await Promise.all([
    getAllMatches({ league_id: 16 }),
    getAllLeagues(),
  ]);

  if (!matchesRes.success || !leaguesRes.success) {
    return <ErrorState />;
  }

  const matches  = matchesRes.data  ?? [];
  const leagues  = leaguesRes.data  ?? [];

  const worldCupLeague = leagues.find(
    (l: LeagueT) => l.is_tournament || l.slug === "fifa-world-cup-2026"
  );

  const upcomingWorldCupMatches = worldCupLeague
    ? matches.filter((m) => m.league_id === worldCupLeague.id && isUpcoming(m))
    : [];

  const groupSections   = buildGroupSections(upcomingWorldCupMatches);
  const knockoutSections = buildKnockoutSections(upcomingWorldCupMatches);
  const finishedMatches = matches.filter((m) => m.status === "FINISHED");

  const hasWorldCupContent =
    worldCupLeague != null && upcomingWorldCupMatches.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-10">
        {/* <HeroBanner /> */}
        <WorldCupHeroBanner />

        {hasWorldCupContent && (
          <>
            {groupSections.map(({ title, matches: sectionMatches }) => (
              <MatchCarousel
                key={title}
                title={title}
                route={`/matches/?status=scheduled&group=${title.replace("Group ", "")}`}
                matches={sectionMatches}
                showViewAll={false}
              />
            ))}

            {knockoutSections.map(({ title, matches: sectionMatches }) => (
              <MatchCarousel
                key={title}
                title={title}
                route={`/matches/?status=scheduled&type=${title.toUpperCase().replace(" ", "_")}`}
                matches={sectionMatches}
                showViewAll={false}
              />
            ))}
          </>
        )}

        {finishedMatches.length > 0 && (
          <MatchCarousel
            title="Finished Matches"
            route="/matches/?status=finished"
            matches={finishedMatches}
          />
        )}
      </main>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* <HeroBanner /> */}
        <WorldCupHeroBanner />
        <p className="text-center py-12 text-muted-foreground">
          Failed to load matches. Please try again later.
        </p>
      </main>
    </div>
  );
}