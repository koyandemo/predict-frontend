import { UserT } from "./user.type";

// export interface CommentT {
//   id: string;
//   matchId: string;
//   userId: string;
//   userName: string;
//   userAvatar: string;
//   userType?: UserEnumT;
//   userAvatarColor:string;
//   content: string;
//   timestamp: string;
//   likes: number;
//   dislikes: number;
//   replyCount?: number;
//   isReply?: boolean;
//   parentId?: string;
//   hasUserLiked?: boolean;
// }

export interface CommentT {
  id: number;
  match_id: number;
  user_id: number;
  user: UserT;
  text: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  reply_count: number;
  is_replay: boolean;
  parent_id: number;
  has_user_liked: boolean;
}
