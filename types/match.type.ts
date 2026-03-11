import { LeagueT } from "./league.type";
import { TeamT } from "./team.type";

export type MatchT = {
  id: number;
  kickoff: string;
  timezone: string;
  venue: string;
  slug: string;
  status: "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";
  type: "NORMAL" | "FINAL" | "SEMIFINAL" | "QUARTERFINAL" | "FRIENDLY";
  allow_draw: boolean;
  big_match: boolean;
  derby: boolean;
  home_score: number;
  away_score: number;
  published: boolean;
  home_team_id: number;
  away_team_id: number;
  league_id: number;
  home_team: TeamT;
  away_team: TeamT;
  league: LeagueT;
};

export interface ApiMatchT {
  match_id: number;
  league_id: number;
  home_team_id: number;
  away_team_id: number;
  match_date: string; 
  match_time: string;
  venue: string;
  status: string;
  slug: string;
  home_score?: number;
  away_score?: number;
  allow_draw: boolean;
  match_timezone: string; 
  big_match?: boolean;
  derby?: boolean;
  match_type?: string;
  home_team: {
    name: string;
    logo_url: string;
    short_code: string;
  };
  away_team: {
    name: string;
    logo_url: string;
    short_code: string;
  };
  league: {
    name: string;
    country: string;
  };
}

export type MatchVoteT = {
  home_votes: number;
  draw_votes: number;
  away_votes: number;
  total_votes: number;
};

export interface ApiVoteCountT {
  vote_id: number;
  match_id: number;
  home_votes: number;
  draw_votes: number;
  away_votes: number;
  total_votes: number;
  home_percentage?: number;
  draw_percentage?: number;
  away_percentage?: number;
  current_user_vote?: "HOME" | "DRAW" | "AWAY" | "";
}

export interface ApiCommentT {
  comment_id: number;
  match_id: number;
  user_id: string;
  comment_text: string;
  timestamp: string;
  parent_comment_id?: number;
  like_count?: number;
  dislike_count?: number;
  reply_count?: number;
}

export interface ScorePredictionT {
  admin_votes: number;
  away_score: number;
  home_score: number;
  id: number;
  percent: number;
  user_votes: number;
  current_user_vote: boolean;
  votes: number;
}
