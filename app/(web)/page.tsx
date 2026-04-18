import { getAllMatches, isUpcoming } from "@/apiConfig/match.api";
import { MatchCarousel } from "./_components/MatchCarousel";
import {
  buildGroupSections,
  buildKnockoutSections,
  FIFA_CLUB_WORLD_CUP_LEAGUE_ID,
} from "@/lib/fifaWorldCupUtils";
import WorldCupHeroBanner from "./_components/WorldCupHeroBanner";


export default async function HomePage() {
  const matchesRes = await getAllMatches({
    league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
    page: 1,
    // type: "ROUND_OF_16",
    limit: 200,
  });

  if (!matchesRes.success) {
    return (
      <ErrorState message="Failed to load matches. Please try again later." />
    );
  }

  const matches = matchesRes.data ?? [];

  if (matches.length === 0) {
    return (
      <ErrorState message="No matches found for the FIFA Club World Cup. Please check back later." />
    );
  }

  const upComingMatches = matches.filter(isUpcoming);//inhere in kickoff is already expired

  const groupMatchSectionData = buildGroupSections(upComingMatches);
  const finishedMatchData = matches.filter((m) => m.status === "FINISHED");
  const knockoutMatchSectionData = buildKnockoutSections(upComingMatches);
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-10">
        <WorldCupHeroBanner />

        {groupMatchSectionData.length > 0 && (
          <>
            {groupMatchSectionData.map(({ title, matches: sectionMatches }) => (
              <MatchCarousel
                key={title}
                title={title}
                route={`/matches/?status=scheduled&group=${title.replace(
                  "Group",
                  ""
                )}`}
                matches={sectionMatches}
                showViewAll={false}
              />
            ))}
          </>
        )}

        {knockoutMatchSectionData.length > 0 && (
          <>
            {knockoutMatchSectionData.map(
              ({ title, matches: sectionMatches }) => (
                <MatchCarousel
                  key={title}
                  title={title}
                  route={`/matches/?status=scheduled&type=${title
                    .toUpperCase()
                    .replace(" ", "_")}`}
                  matches={sectionMatches}
                  showViewAll={false}
                />
              )
            )}
          </>
        )}

        {finishedMatchData.length > 0 && (
          <MatchCarousel
            title="Finished Matches"
            route="/matches/?status=finished"
            matches={finishedMatchData}
          />
        )}
      </main>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <WorldCupHeroBanner />
        <p className="text-center py-12 text-muted-foreground">{message}</p>
      </main>
    </div>
  );
}
