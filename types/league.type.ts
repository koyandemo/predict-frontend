export interface LeagueT {
  id: number;
  name: string;
  country: string;
  logo_url: string;
  slug: string;
  recommended_gameweek: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
