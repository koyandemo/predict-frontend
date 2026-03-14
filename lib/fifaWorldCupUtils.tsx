import { isKnockoutMatch } from "@/api/match.api";
import { MatchSectionT, MatchT } from "@/types/match.type";

export const FIFA_WORLD_CUP_2026_GROUP_STANDINGS = {
  A: [
    {
      team: { id: 1, name: "Argentina", logo_url: "", short_code: "ARG" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 2, name: "Brazil", logo_url: "", short_code: "BRA" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 3, name: "Canada", logo_url: "", short_code: "CAN" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 4, name: "Australia", logo_url: "", short_code: "AUS" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
  ],
  B: [
    {
      team: { id: 5, name: "France", logo_url: "", short_code: "FRA" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 6, name: "Spain", logo_url: "", short_code: "ESP" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 7, name: "Mexico", logo_url: "", short_code: "MEX" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 8, name: "Senegal", logo_url: "", short_code: "SEN" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
  ],
  C: [
    {
      team: { id: 9, name: "England", logo_url: "", short_code: "ENG" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 10, name: "Germany", logo_url: "", short_code: "GER" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 11, name: "Japan", logo_url: "", short_code: "JPN" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
    {
      team: { id: 12, name: "Nigeria", logo_url: "", short_code: "NGA" },
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
  ],
};

export const FIFA_WORLD_CUP_GROUPS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

export const KNOCKOUT_TYPES = [
  { type: "FINAL", title: "Final" },
  { type: "SEMIFINAL", title: "Semi Finals" },
  { type: "THIRD_PLACE_PLAYOFF", title: "Third Place Playoff" },
  { type: "QUARTERFINAL", title: "Quarter Finals" },
  { type: "ROUND_OF_16", title: "Round of 16" },
] as const;

export function buildGroupSections(matches: MatchT[]): MatchSectionT[] {
  const byGroup = new Map<string, MatchT[]>();

  for (const match of matches) {
    const key = match.group_name ?? "Other";
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(match);
  }

  return Array.from(byGroup.entries()).map(([groupName, groupMatches]) => ({
    title: `Group ${groupName}`,
    matches: groupMatches,
  }));
}

export function buildKnockoutSections(matches: MatchT[]): MatchSectionT[] {
  const knockouts = matches.filter(isKnockoutMatch);

  return KNOCKOUT_TYPES.reduce<MatchSectionT[]>((acc, { type, title }) => {
    const filtered = knockouts.filter((m) => m.type === type);
    if (filtered.length > 0) acc.push({ title, matches: filtered });
    return acc;
  }, []);
}
