"use client";

import { MatchT } from "@/types/match.type";
import { MatchCard } from "../matches/_components/MatchCard";

interface KnockoutBracketProps {
  roundOf16: MatchT[];
  quarterFinals: MatchT[];
  semiFinals: MatchT[];
  thirdPlacePlayoff?: MatchT;
  final?: MatchT;
}

export function KnockoutBracket({ 
  roundOf16, 
  quarterFinals, 
  semiFinals, 
  thirdPlacePlayoff, 
  final 
}: KnockoutBracketProps) {
  return (
    <div className="space-y-8">
      {/* Round of 16 */}
      {roundOf16.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Round of 16
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roundOf16.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Quarter Finals */}
      {quarterFinals.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Quarter Finals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quarterFinals.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Semi Finals */}
      {semiFinals.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Semi Finals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {semiFinals.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Third Place Playoff */}
      {thirdPlacePlayoff && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Third Place Playoff
          </h3>
          <div className="max-w-md">
            <MatchCard match={thirdPlacePlayoff} />
          </div>
        </section>
      )}

      {/* Final */}
      {final && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Final
          </h3>
          <div className="max-w-md">
            <MatchCard match={final} />
          </div>
        </section>
      )}
    </div>
  );
}
