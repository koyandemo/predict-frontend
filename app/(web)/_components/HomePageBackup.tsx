import { getAllLeagues, getAllMatches, isUpcoming, isKnockoutMatch, isGroupStage } from "@/api/match.api";
import { LeagueT } from "@/types/league.type";
import { HeroBanner } from "./HeroBanner";
import { MatchCarousel } from "./MatchCarousel";

export default async function HomePage() {
  const [matchesRes, leaguesRes] = await Promise.all([
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

  // Find World Cup league
  const worldCupLeague = leagues.find((l: LeagueT) => l.is_tournament || l.slug === "fifa-world-cup-2026");
  
  // Get World Cup matches if tournament exists
  const worldCupMatches = worldCupLeague 
    ? matches.filter(m => m.league_id === worldCupLeague.id && isUpcoming(m))
    : [];

  // Group matches by group_name (Group A, Group B, etc.)
  const matchesByGroup = new Map<string, typeof worldCupMatches>();
  worldCupMatches.forEach(match => {
    const groupName = match.group_name || "Other";
    if (!matchesByGroup.has(groupName)) {
      matchesByGroup.set(groupName, []);
    }
    matchesByGroup.get(groupName)!.push(match);
  });

  // Convert map to array for rendering
  const groupMatches = Array.from(matchesByGroup.entries()).map(([groupName, matches]) => ({
    title: `Group ${groupName}`,
    matches,
  }));

  // Special knockout stage matches
  const knockoutMatches = worldCupMatches.filter(isKnockoutMatch);
  const roundOf16Matches = knockoutMatches.filter(m => m.type === "ROUND_OF_16");
  const quarterFinalMatches = knockoutMatches.filter(m => m.type === "QUARTERFINAL");
  const semiFinalMatches = knockoutMatches.filter(m => m.type === "SEMIFINAL");
  const thirdPlaceMatch = knockoutMatches.find(m => m.type === "THIRD_PLACE_PLAYOFF");
  const finalMatch = knockoutMatches.find(m => m.type === "FINAL");

  const specialKnockoutSections = [
    ...(roundOf16Matches.length > 0 ? [{ title: "Round of 16", matches: roundOf16Matches }] : []),
    ...(quarterFinalMatches.length > 0 ? [{ title: "Quarter Finals", matches: quarterFinalMatches }] : []),
    ...(semiFinalMatches.length > 0 ? [{ title: "Semi Finals", matches: semiFinalMatches }] : []),
    ...(thirdPlaceMatch ? [{ title: "Third Place Playoff", matches: [thirdPlaceMatch] }] : []),
    ...(finalMatch ? [{ title: "Final", matches: [finalMatch] }] : []),
  ];

  const finishedMatches = matches.filter(
    (match) => match.status === "FINISHED"
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-10">
        <HeroBanner />

        {/* FIFA World Cup Section */}
        {worldCupLeague && worldCupMatches.length > 0 && (
          <>
            {/* Group Stage Matches */}
            {groupMatches.map(({ title, matches }) => (
              <div key={title}>
                <MatchCarousel
                  title={title}
                  route={`/matches/?status=scheduled&group=${title.replace("Group ", "")}`}
                  matches={matches}
                  showViewAll={false}
                />
              </div>
            ))}

            {/* Knockout Stage Matches */}
            {specialKnockoutSections.map(({ title, matches }) => (
              <div key={title}>
                <MatchCarousel
                  title={title}
                  route={`/matches/?status=scheduled&type=${title.toUpperCase().replace(" ", "_")}`}
                  matches={matches}
                  showViewAll={false}
                />
              </div>
            ))}

            {/* All Upcoming World Cup Matches */}
            {worldCupMatches.length > 0 && (
              <div>
                <MatchCarousel
                  title="All Upcoming Matches"
                  route="/world-cup"
                  matches={worldCupMatches}
                  showViewAll={true}
                />
              </div>
            )}
          </>
        )}

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
