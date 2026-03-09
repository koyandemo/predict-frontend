import apiConfig from "@/api/apiConfig";
import { ApiResponseT } from "@/types/api.type";


// Define interfaces for our enhanced comment system
export interface EnhancedComment {
  comment_id: number;
  match_id: number;
  user_id: string;
  comment_text: string;
  timestamp: string;
  parent_comment_id?: number;
  like_count: number;
  dislike_count: number;
  reply_count: number;
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
    avatar_bg_color?:string;
    type?: 'user' | 'admin' | 'seed';
  };
}

export interface CommentReaction {
  reaction_id: number;
  comment_id: number;
  user_id: string;
  reaction_type: 'like' | 'dislike';
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface CommentReactionSummary {
  like_count: number;
  dislike_count: number;
}

export interface CommentReplyCount {
  comment_id: number;
  reply_count: number;
}

/**
 * Enhanced comment service with proper typing and error handling
 */
export class EnhancedCommentService {
  /**
   * Get replies for a comment with pagination
   */
  static async getCommentReplies(
    commentId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<ApiResponseT<{
    data: EnhancedComment[],
    pagination: {
      current_page: number,
      per_page: number,
      total: number,
      total_pages: number
    }
  }>> {
    try {
      const response = await apiConfig.get(
        `/matches/${commentId}/comments/replies?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching comment replies:", error);
      return {
        success: false,
        message: "Failed to fetch comment replies",
        error: error.response?.data?.message || error.message || "Unknown error",
      };
    }
  }

  /**
   * Create a reply to a comment
   */
  static async createCommentReply(
    parentCommentId: string,
    data: {
      user_id: string;
      comment_text: string;
      match_id?: number;
    }
  ): Promise<ApiResponseT<EnhancedComment>> {
    try {
      const response = await apiConfig.post(
        `/matches/${parentCommentId}/comments/replies`,
        data
      );

      return response.data;
    } catch (error: any) {
      console.error("Error creating comment reply:", error);
      return {
        success: false,
        message: "Failed to create reply",
        error: error.response?.data?.message || error.message || "Unknown error",
      };
    }
  }

  /**
   * Get all reactions for a comment
   */
  static async getCommentReactions(
    commentId: string
  ): Promise<ApiResponseT<CommentReaction[]>> {
    try {
      const response = await apiConfig.get(
        `/matches/${commentId}/comments/reactions`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching comment reactions:", error);
      return {
        success: false,
        message: "Failed to fetch comment reactions",
        error: error.response?.data?.message || error.message || "Unknown error",
      };
    }
  }

  /**
   * Get reaction summary for a comment
   */
  static async getCommentReactionSummary(
    commentId: string
  ): Promise<ApiResponseT<CommentReactionSummary>> {
    try {
      const response = await apiConfig.get(
        `/matches/${commentId}/comments/reactions/summary`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching comment reaction summary:", error);
      return {
        success: false,
        message: "Failed to fetch comment reaction summary",
        error: error.response?.data?.message || error.message || "Unknown error",
      };
    }
  }

  /**
   * Add or remove reaction to a comment
   */
  static async addCommentReaction(
    commentId: string,
    data: {
      user_id: string;
      reaction_type: 'like' | 'dislike';
    }
  ): Promise<ApiResponseT<{
    action: string;
    reaction_count: number;
  }>> {
    try {
      const response = await apiConfig.post(
        `/matches/${commentId}/comments/reactions`,
        data
      );

      return response.data;
    } catch (error: any) {
      console.error("Error adding comment reaction:", error);
      return {
        success: false,
        message: "Failed to add reaction",
        error: error.response?.data?.message || error.message || "Unknown error",
      };
    }
  }

  /**
   * Get reply count for a comment
   */
  static async getCommentReplyCount(
    commentId: string
  ): Promise<ApiResponseT<CommentReplyCount>> {
    try {
      const response = await apiConfig.get(
        `/matches/${commentId}/comments/reply-count`,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching reply count:", error);
      return {
        success: false,
        message: "Failed to fetch reply count",
        error: error.response?.data?.message || error.message || "Unknown error",
      };
    }
  }
}