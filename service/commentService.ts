// import {
//     getMatchComments,
//     createComment,
//     updateComment,
//     deleteComment,
//     addCommentReaction,
//   } from "@/lib/apiService";
import {
  addCommentReaction,
  createComment,
  deleteComment,
  getMatchComments,
  updateComment,
} from "@/api/comment.api";
import { CommentT } from "@/types/comment.type";
import { UserEnumT } from "@/types/user.type";
import { EnhancedCommentService } from "./enhancedCommentService";

export interface CommentService {
  // Fetch comments for a match
  fetchMatchComments: (
    matchId: string,
    page?: number,
    limit?: number
  ) => Promise<{
    success: boolean;
    data?: CommentT[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    error?: string;
  }>;

  // Create a new comment
  createNewComment: (params: {
    matchId: number;
    content: string;
    userId: string;
  }) => Promise<{
    success: boolean;
    data?: CommentT;
    error?: string;
  }>;

  // Create a reply to a comment
  createReply: (params: {
    matchId: number;
    content: string;
    userId: string;
    parentCommentId: string;
  }) => Promise<{
    success: boolean;
    data?: CommentT;
    error?: string;
  }>;

  // Update an existing comment
  updateExistingComment: (params: {
    commentId: number;
    content: string;
  }) => Promise<{
    success: boolean;
    data?: CommentT;
    error?: string;
  }>;

  // Delete a comment
  deleteComment: (params: { commentId: number }) => Promise<{
    success: boolean;
    error?: string;
  }>;

  // Add reaction to a comment
  addReaction: (params: {
    commentId: string;
    userId: string;
    reactionType: string;
  }) => Promise<{
    success: boolean;
    data?: {
      action: string;
      reaction_count: number;
    };
    error?: string;
  }>;

  // Get replies for a comment
  fetchReplies: (params: {
    commentId: string;
    page?: number;
    limit?: number;
  }) => Promise<{
    success: boolean;
    data?: CommentT[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    error?: string;
  }>;
}

export const commentService: CommentService = {
  fetchMatchComments: async (matchId, page = 1, limit = 10) => {
    try {
      // Pass pagination parameters to the API call
      const response = await getMatchComments(matchId, page, limit);
      if (response.success && response.data) {
        // Transform API comments to client comments
        const transformedComments: CommentT[] = response.data.map(
          (comment: any) => ({
            id: `comment-${comment.comment_id}`,
            matchId: comment.match_id.toString(),
            userId: comment.user_id.toString(),
            userName: comment.user?.name || `User ${comment.user_id}`,
            userAvatar: comment.user?.avatar_url,
            userAvatarColor: comment.user?.avatar_bg_color,
            userType:
              comment.user?.type &&
              Object.values(UserEnumT).includes(comment.user.type as UserEnumT)
                ? (comment.user.type as UserEnumT)
                : UserEnumT.USER,
            content: comment.comment_text,
            timestamp: comment.timestamp,
            likes: comment.like_count || 0,
            dislikes: comment.dislike_count || 0,
            replyCount: comment.reply_count || 0,
          })
        );

        return {
          success: true,
          data: transformedComments,
          pagination: response.pagination,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to fetch comments",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch comments",
      };
    }
  },

  createNewComment: async ({ matchId, content, userId }) => {
    try {
      const response = await createComment(matchId, content, userId);

      if (response.success && response.data) {
        // Transform API comment to client comment
        const newComment: CommentT = {
          id: `comment-${response.data.comment_id}`,
          matchId: response.data.match_id.toString(),
          userId: response.data.user_id.toString(),
          userName: response.data.user?.name || `User ${response.data.user_id}`,
          userAvatar:
            response.data.user?.avatar_url ||
            `/football-fan-avatar-${Math.floor(Math.random() * 3) + 1}.jpg`,
          userAvatarColor: response?.data?.user?.avatar_bg_color,
          userType:
            response.data.user?.type &&
            Object.values(UserEnumT).includes(
              response.data.user.type as UserEnumT
            )
              ? (response.data.user.type as UserEnumT)
              : UserEnumT.USER,
          content: response.data.comment_text,
          timestamp: response.data.timestamp,
          likes: response.data.like_count || 0,
          dislikes: response.data.dislike_count || 0,
          replyCount: response.data.reply_count || 0,
        };

        return {
          success: true,
          data: newComment,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to create comment",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create comment",
      };
    }
  },

  createReply: async ({ matchId, content, userId, parentCommentId }) => {
    try {
      const response = await EnhancedCommentService.createCommentReply(
        parentCommentId,
        {
          user_id: userId,
          comment_text: content,
          match_id: matchId,
        }
      );

      if (response.success && response.data) {
        const newReply: CommentT = {
          id: `comment-${response.data.comment_id}`,
          matchId: response.data.match_id.toString(),
          userId: response.data.user_id.toString(),
          userName: response.data.user?.name || `User ${response.data.user_id}`,
          userAvatar: response.data.user?.avatar_url || "",
          userAvatarColor: response.data.user?.avatar_bg_color || "",
          userType:
            response.data.user?.type &&
            Object.values(UserEnumT).includes(
              response.data.user.type as UserEnumT
            )
              ? (response.data.user.type as UserEnumT)
              : UserEnumT.USER,
          content: response.data.comment_text,
          timestamp: response.data.timestamp,
          likes: response.data.like_count || 0,
          dislikes: response.data.dislike_count || 0,
          replyCount: response.data.reply_count || 0,
          isReply: true,
          parentId: `comment-${parentCommentId}`,
        };

        return {
          success: true,
          data: newReply,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to create reply",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create reply",
      };
    }
  },

  updateExistingComment: async ({ commentId, content }) => {
    try {
      const response = await updateComment(commentId, content);

      if (response.success && response.data) {
        // Transform API comment to client comment
        const updatedComment: CommentT = {
          id: `comment-${response.data.comment_id}`,
          matchId: response.data.match_id.toString(),
          userId: response.data.user_id.toString(),
          userName: response.data.user?.name || `User ${response.data.user_id}`,
          userAvatar: response.data.user?.avatar_url || "",
          userAvatarColor: response.data.user?.avatar_bg_color || "",
          userType:
            response.data.user?.type &&
            Object.values(UserEnumT).includes(
              response.data.user.type as UserEnumT
            )
              ? (response.data.user.type as UserEnumT)
              : UserEnumT.USER,
          content: response.data.comment_text,
          timestamp: response.data.timestamp,
          likes: response.data.like_count || 0,
          dislikes: response.data.dislike_count || 0,
          replyCount: response.data.reply_count || 0,
        };

        return {
          success: true,
          data: updatedComment,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to update comment",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update comment",
      };
    }
  },

  deleteComment: async ({ commentId }) => {
    try {
      const response = await deleteComment(commentId);

      if (response.success) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to delete comment",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete comment",
      };
    }
  },

  // Add reaction to a comment
  addReaction: async ({ commentId, userId, reactionType }) => {
    try {
      const response = await addCommentReaction(
        commentId,
        userId,
        reactionType as "like" | "dislike"
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to add reaction",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to add reaction",
      };
    }
  },

  fetchReplies: async ({ commentId, page = 1, limit = 5 }) => {
    try {
      const response = await EnhancedCommentService.getCommentReplies(
        commentId,
        page,
        limit
      );

      if (response.success && response.data) {
        const { data, pagination } = response.data;

        const transformedReplies: CommentT[] = data.map((reply: any) => ({
          id: `comment-${reply.comment_id}`,
          matchId: reply.match_id?.toString() || "",
          userId: reply.user_id?.toString() || "",
          userName: reply.user?.name || `User ${reply.user_id || "unknown"}`,
          userAvatar: reply.data.user?.avatar_url || "",
          userAvatarColor: reply.data.user?.avatar_bg_color || "",
          userType:
            reply.user?.type &&
            Object.values(UserEnumT).includes(reply.user.type as UserEnumT)
              ? (reply.user.type as UserEnumT)
              : UserEnumT.USER,
          content: reply.comment_text || "",
          timestamp: reply.timestamp || new Date().toISOString(),
          likes: Math.max(0, reply.like_count || 0),
          dislikes: Math.max(0, reply.dislike_count || 0),
          replyCount: reply.reply_count || 0,
          isReply: true,
          parentId: `comment-${commentId}`,
        }));

        return {
          success: true,
          data: transformedReplies,
          pagination,
        };
      }

      return {
        success: false,
        error: response.message || "Failed to fetch replies",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch replies",
      };
    }
  },
};
