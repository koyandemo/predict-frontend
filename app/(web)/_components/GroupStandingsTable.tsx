"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamT } from "@/types/team.type";

interface GroupTeam {
  team: TeamT;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: ("W" | "D" | "L")[];
}

interface GroupStandingsTableProps {
  groupName: string;
  teams: GroupTeam[];
}

export function GroupStandingsTable({ groupName, teams }: GroupStandingsTableProps) {
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Group {groupName}</h3>
          <Badge variant="secondary">FIFA World Cup</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 px-2">Team</th>
                <th className="text-center w-8">P</th>
                <th className="text-center w-8">W</th>
                <th className="text-center w-8">D</th>
                <th className="text-center w-8">L</th>
                <th className="text-center w-8 hidden sm:table-cell">GF</th>
                <th className="text-center w-8 hidden sm:table-cell">GA</th>
                <th className="text-center w-8 hidden sm:table-cell">GD</th>
                <th className="text-center w-10 font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((team, index) => (
                <tr key={team.team.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index < 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                        index === 2 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                        'bg-transparent'
                      }`}>
                        {index + 1}
                      </span>
                      {team.team.logo_url && (
                        <img src={team.team.logo_url} alt={team.team.name} className="w-5 h-5 object-contain" />
                      )}
                      <span className="font-medium">{team.team.name}</span>
                    </div>
                  </td>
                  <td className="text-center">{team.played}</td>
                  <td className="text-center">{team.won}</td>
                  <td className="text-center">{team.drawn}</td>
                  <td className="text-center">{team.lost}</td>
                  <td className="text-center hidden sm:table-cell">{team.goalsFor}</td>
                  <td className="text-center hidden sm:table-cell">{team.goalsAgainst}</td>
                  <td className="text-center hidden sm:table-cell">
                    {team.goalDifference >= 0 ? '+' : ''}{team.goalDifference}
                  </td>
                  <td className="text-center font-bold">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center justify-center text-xs font-medium">1</span>
            <span>Qualifies for Round of 16</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 flex items-center justify-center text-xs font-medium">3</span>
            <span>Possible Round of 16 qualification (best third-placed teams)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
