import { UserEnumT } from "./user.type";

export interface CommentT {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userType?: UserEnumT;
  userAvatarColor:string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replyCount?: number;
  isReply?: boolean;
  parentId?: string;
  hasUserLiked?: boolean;
}
