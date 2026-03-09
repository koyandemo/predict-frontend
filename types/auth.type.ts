import { UserT } from "./user.type";

export interface AuthResponseT {
  success: boolean;
  message: string;
  token?: string;
  user?: UserT;
  data?: any;
  error?: string;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
