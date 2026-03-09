import { AuthResponseT } from "@/types/auth.type";
import apiConfig from "./apiConfig";


export const getMatchComments = async (
  matchId: string,
  page = 1,
  limit = 10
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.get(
      `/matches/${matchId}/comments?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to fetch match comments',
      error: e.response?.data?.message || e.message,
    };
  }
};

export const createComment = async (
  matchId: number,
  commentText: string,
  userId: string
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.post(`/matches/${matchId}/comments`, {
      user_id: userId,
      comment_text: commentText,
    });
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to create comment',
      error: e.response?.data?.message || e.message,
    };
  }
};

export const updateComment = async (
  commentId: number,
  commentText: string
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.put(`/comments/${commentId}`, {
      comment_text: commentText,
    });
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to update comment',
      error: e.response?.data?.message || e.message,
    };
  }
};

export const deleteComment = async (
  commentId: number
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.delete(`/comments/${commentId}`);
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to delete comment',
      error: e.response?.data?.message || e.message,
    };
  }
};

export const getCommentReplies = async (
  commentId: string,
  page = 1,
  limit = 5
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.get(
      `/matches/${commentId}/comments/replies?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to fetch replies',
      error: e.response?.data?.message || e.message,
    };
  }
};

export const createReply = async (
  matchId: number,
  commentText: string,
  userId: string,
  parentCommentId: string
): Promise<AuthResponseT> => {
  try {
    const res = await apiConfig.post(
      `/matches/${parentCommentId}/comments/replies`,
      {
        match_id: matchId,
        user_id: userId,
        comment_text: commentText,
      }
    );
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: 'Failed to create reply',
      error: e.response?.data?.message || e.message,
    };
  }
};

export const addCommentReaction = async (
    commentId: string,
    userId: string,
    reactionType: 'like' | 'dislike'
  ): Promise<AuthResponseT> => {
    try {
      const response = await apiConfig.post(
        `/matches/${commentId}/comments/reactions`,
        { user_id: userId, reaction_type: reactionType }
      );
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to add comment reaction',
        error: error.response?.data?.message || error.message
      };
    }
  };