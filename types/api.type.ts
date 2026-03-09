import { UserT } from '@/types/user.type';

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  type: string;
  prediction_accuracy: number;
  total_predictions: number;
  correct_predictions: number;
  points: number;
  rank: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponseT<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface AuthResponse extends ApiResponseT {
  token?: string;
  user?: UserT;
}