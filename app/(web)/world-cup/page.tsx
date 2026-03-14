import {
  getAllLeagues,
  getAllMatches,
  isUpcoming,
  isKnockoutMatch,
  isGroupStage,
} from "@/api/match.api";
import { HeroBanner } from "../_components/HeroBanner";
import { MatchCarousel } from "../_components/MatchCarousel";
import { LeagueT } from "@/types/league.type";
import { GroupStandingsTable } from "../_components/GroupStandingsTable";
import { KnockoutBracket } from "../_components/KnockoutBracket";
import { Badge } from "@/components/ui/badge";
import { FIFA_WORLD_CUP_2026_GROUP_STANDINGS } from "@/lib/fifaWorldCupUtils";
import WorldCupHeroBanner from "../_components/WorldCupHeroBanner";

export default async function WorldCupPage() {
  const [matchesRes, leaguesRes] = await Promise.all([
    getAllMatches({ league_id: 16 }),
    getAllLeagues(),
  ]);

  if (!matchesRes.success || !leaguesRes.success) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <p className="text-center py-12 text-muted-foreground">
            Failed to load World Cup data. Please try again later.
          </p>
        </main>
      </div>
    );
  }

  const matches = matchesRes.data ?? [];
  const leagues = leaguesRes.data ?? [];

  const worldCupLeague = leagues.find(
    (l: LeagueT) => l.is_tournament || l.slug === "fifa-world-cup-2026"
  );

  if (!worldCupLeague) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <HeroBanner />
          <p className="text-center py-12 text-muted-foreground">
            FIFA World Cup 2026 tournament not found. Please check back later.
          </p>
        </main>
      </div>
    );
  }

  // Filter World Cup matches
  const worldCupMatches = matches.filter(
    (m) => m.league_id === worldCupLeague.id
  );
  const upcomingWorldCupMatches = worldCupMatches.filter(isUpcoming);

  const groupStageMatches = upcomingWorldCupMatches.filter(isGroupStage);
  const knockoutMatches = upcomingWorldCupMatches.filter(isKnockoutMatch);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 flex flex-col gap-10">
        {/* Hero Section */}
        <WorldCupHeroBanner />

        {/* Group Stage Section */}
        {groupStageMatches.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Group Stage</h2>
              <Badge variant="outline">6 Groups</Badge>
            </div>

            <div className="grid gap-6">
              {Object.entries(FIFA_WORLD_CUP_2026_GROUP_STANDINGS).map(
                ([groupName, teams]) => (
                  <GroupStandingsTable
                    key={groupName}
                    groupName={groupName}
                    teams={teams as any}
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* Knockout Stage Section */}
        {knockoutMatches.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Knockout Stage</h2>
              <Badge variant="destructive">Single Elimination</Badge>
            </div>

            <KnockoutBracket
              roundOf16={knockoutMatches.filter(
                (m) => m.type === "ROUND_OF_16"
              )}
              quarterFinals={knockoutMatches.filter(
                (m) => m.type === "QUARTERFINAL"
              )}
              semiFinals={knockoutMatches.filter((m) => m.type === "SEMIFINAL")}
              thirdPlacePlayoff={knockoutMatches.find(
                (m) => m.type === "THIRD_PLACE_PLAYOFF"
              )}
              final={knockoutMatches.find((m) => m.type === "FINAL")}
            />
          </section>
        )}

        {/* All World Cup Matches */}
        {upcomingWorldCupMatches.length > 0 && (
          <div>
            <MatchCarousel
              title="All Upcoming Matches"
              route="/matches/?status=scheduled&league=fifa-world-cup-2026"
              matches={upcomingWorldCupMatches}
            />
          </div>
        )}
      </main>
    </div>
  );
}
