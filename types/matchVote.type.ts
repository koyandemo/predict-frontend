export type MatchVoteT = {
  home_votes: number;
  draw_votes: number;
  away_votes: number;
  total_votes: number;
};

export interface MatchVoteCountT {
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
