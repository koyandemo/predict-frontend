export interface TeamT {
  id: number;
  name: string;
  slug: string;
  short_code: string;
  logo_url: string;
  country: string;
  type: string;
  venue: string;
  league_id: number;
  league: {
    id: number;
    name: string;
    country: string;
    logo_url: string;
  };
  group_name: string | null;
  ranking: number | null;
  participations: number | null;
  isHost: boolean;
}
