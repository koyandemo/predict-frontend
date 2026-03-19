import { TeamT } from "./team.type";

export enum UserEnumT {
  USER = "USER",
  ADMIN = "ADMIN",
  SEED = "SEED",
}

export interface UserT {
  id: number;
  name: string;
  email: string;
  provider: "email" | "google" | string;
  role: "ADMIN" | "USER" |"SEED";
  avatar_url?: string | "";
  avatar_bg_color?: string | "";
  created_at: string;
  updated_at: string;
  team_id: number;
  team?:TeamT;
  token:string;
}
