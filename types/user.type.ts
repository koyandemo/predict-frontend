export enum UserEnumT {
    USER = "user",
    ADMIN = "admin",
    SEED = "seed",
  }
  
  export interface UserT {
    user_id: string;
    name: string;
    email: string;
    avatar_url?: string;
    favorite_team_id?: number;
    avatar_bg_color?: string;
    type: UserEnumT;
  }
  