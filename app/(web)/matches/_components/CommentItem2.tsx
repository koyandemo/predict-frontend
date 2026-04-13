"use client";
import { useState, useEffect, useMemo } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCommentTime } from "@/lib/utils";
import { CommentT } from "@/types/comment.type";
import { Skeleton } from "../../../../components/ui/skeleton";
import { UserT } from "@/types/user.type";
import { useAuth } from "@/context/AuthContext";
import {
  addCommentReaction,
  createReply,
  getCommentReplies,
} from "@/apiConfig/comment.api";
import { EmojiPicker } from "../../../../components/EmojiPicker";
import UserAvatar from "../../../../components/UserAvatar";

interface CommentItemProps {
  comment: CommentT;
  matchId: number;
  onReplySuccess?: () => void;
  depth?: number;
}

const CommentItemComponent = ({
  comment,
  matchId,
  onReplySuccess,
  depth = 0,
}: CommentItemProps) => {
  const [likes, setLikes] = useState(comment.likes || 0);
  const [dislikes, setDislikes] = useState(comment.dis_likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [replyCount, setReplyCount] = useState(comment.reply_count || 0);
  const [replies, setReplies] = useState<CommentT[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const { user, token, isAuthenticated } = useAuth();

  const handleReaction = async (reactionType: "like" | "dislike") => {
    if (!isAuthenticated || !user || !token) {
      // In a real app, you might want to show a login modal
      return;
    }

    if (reactionType === "like") {
      if (hasLiked) {
        setLikes((prev) => Math.max(0, prev - 1));
      } else {
        setLikes((prev) => prev + 1);
        if (hasDisliked) {
          setDislikes((prev) => Math.max(0, prev - 1));
        }
      }
      setHasLiked(!hasLiked);
      setHasDisliked(false);
    } else {
      if (hasDisliked) {
        setDislikes((prev) => Math.max(0, prev - 1));
      } else {
        setDislikes((prev) => prev + 1);
        if (hasLiked) {
          setLikes((prev) => Math.max(0, prev - 1));
        }
      }
      setHasDisliked(!hasDisliked);
      setHasLiked(false);
    }

    try {
      const response = await addCommentReaction(
        comment.id,
        user.id,
        reactionType
      );

      if (response.success && response.data) {
        // Update with server response
        if (reactionType === "like") {
          setLikes(response.data.reaction_count);
        } else {
          setDislikes(response.data.reaction_count);
        }
      }
    } catch (error) {
      if (reactionType === "like") {
        if (hasLiked) {
          setLikes((prev) => prev + 1);
        } else {
          setLikes((prev) => Math.max(0, prev - 1));
          if (hasDisliked) {
            setDislikes((prev) => prev + 1);
          }
        }
        setHasLiked(!hasLiked);
        setHasDisliked(false);
      } else {
        if (hasDisliked) {
          setDislikes((prev) => prev + 1);
        } else {
          setDislikes((prev) => Math.max(0, prev - 1));
          if (hasLiked) {
            setLikes((prev) => prev + 1);
          }
        }
        setHasDisliked(!hasDisliked);
        setHasLiked(false);
      }
    }
  };

  const loadReplies = async () => {
    if (loadingReplies) return;

    setLoadingReplies(true);
    try {
      const response = await getCommentReplies(comment.id, 1, 50);

      if (response.success && response.data) {
        let repliesData: any[] = [];
        if (Array.isArray(response.data)) {
          repliesData = response.data;
        } else if (response.data.data) {
          repliesData = Array.isArray(response.data.data)
            ? response.data.data
            : [];
        }

        const transformedReplies: CommentT[] = repliesData.map(
          (reply: any) => ({
            id: reply.id,
            match_id: reply.match_id,
            user_id: reply.user_id,
            user: reply.user,
            text: reply.text,
            timestamp: reply.timestamp,
            likes: reply.likes || 0,
            dis_likes: reply.dis_likes || 0,
            reply_count: reply.reply_count || 0,
            is_replay: true,
            parent_id: comment.id,
            has_user_liked: true,
          })
        );

        setReplies(transformedReplies);
      }
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleToggleReplies = async () => {
    if (!showReplies && replyCount > 0) {
      await loadReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user || !token) {
      return;
    }

    if (!replyContent.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const parentCommentId = comment.id;
      const response = await createReply(
        Number(matchId),
        replyContent,
        user.id,
        parentCommentId
      );

      if (response.success && response.data) {
        const newReply: CommentT = {
          id: response.data.id,
          match_id: response.data.match_id.toString(),
          user_id: response.data.user_id.toString(),
          user: response?.data?.user,
          text: response.data.text,
          timestamp: response.data.timestamp,
          likes: 0,
          dis_likes: 0,
          reply_count: 0,
          is_replay: true,
          parent_id: comment.id,
          has_user_liked: false,
        };

        setReplies((prev) => [newReply, ...prev]);
        setReplyCount((prev) => Math.max(0, prev + 1));
        setReplyContent("");

        if (!showReplies) {
          setShowReplies(true);
        }
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const memoizedReplyItems = useMemo(() => {
    return replies.map((reply) => (
      <CommentItem
        key={reply.id}
        comment={reply}
        matchId={matchId}
        onReplySuccess={onReplySuccess}
        depth={depth + 1}
      />
    ));
  }, [replies, matchId, onReplySuccess, depth]);

  return (
    <div
      className={cn(
        "flex gap-4 py-4 transition-all duration-200",
        depth === 0 ? "" : "rounded-lg"
      )}
    >
      <UserAvatar user={user as UserT} size={depth === 0 ? "md" : "sm"} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
          <span className="font-semibold text-foreground">
            {comment.user?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatCommentTime(comment.timestamp)}
          </span>
        </div>

        <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
          {comment.text}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleReaction("like")}
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-all duration-200",
                hasLiked
                  ? "text-green-600 scale-105"
                  : "text-muted-foreground hover:text-green-600"
              )}
              aria-label="Like comment"
            >
              <ThumbsUp
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  hasLiked && "fill-current scale-110"
                )}
              />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => handleReaction("dislike")}
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-all duration-200",
                hasDisliked
                  ? "text-red-600 scale-105"
                  : "text-muted-foreground hover:text-red-600"
              )}
              aria-label="Dislike comment"
            >
              <ThumbsDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  hasDisliked && "fill-current scale-110"
                )}
              />
              <span>{dislikes}</span>
            </button>
          </div>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Reply to comment"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Reply</span>
          </button>

          {replyCount > 0 && (
            <button
              onClick={handleToggleReplies}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showReplies ? "Hide replies" : "Show replies"}
            >
              {showReplies ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Hide ({replyCount})</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Show ({replyCount})</span>
                </>
              )}
            </button>
          )}
        </div>

        {showReplyForm && (
          <form
            onSubmit={handleReplySubmit}
            className="mt-4 pt-4 border-t border-muted/50 transition-all duration-300 ease-in-out"
          >
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="mb-3 transition-all duration-200 min-h-[80px]"
              maxLength={1000}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <EmojiPicker
                  onEmojiSelect={(emoji) =>
                    setReplyContent((prev) => prev + emoji)
                  }
                />
                <span
                  className={`text-xs transition-colors duration-200 ${
                    replyContent.length > 900
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {replyContent.length}/1000
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="transition-all duration-200 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                  className="transition-all duration-200 border-muted-foreground text-muted-foreground hover:bg-muted/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {showReplies && (
          <div className="mt-4 space-y-4 transition-all duration-300 ease-in-out pl-2 border-l-2 border-muted/30">
            {loadingReplies ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-3" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              memoizedReplyItems
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentItem = CommentItemComponent;