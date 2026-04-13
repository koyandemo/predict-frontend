"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { CommentT } from "@/types/comment.type";
import { CommentListSkeleton } from "@/components/skeletons";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { createComment, getMatchComments } from "@/apiConfig/comment.api";

interface CommentPageT {
  comments: CommentT[];
  nextPage: number | null;
  total: number;
}

interface Props {
  matchId: number;
}

const CommentsSection = ({ matchId }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: commentsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<CommentPageT>({
    queryKey: ["matchComments", matchId],
    initialPageParam: 1,

    queryFn: async ({ pageParam }: any) => {
      const response = await getMatchComments(matchId, pageParam, 10);
      if (!response.success || !response?.data?.data) {
        throw new Error(response.error || "Failed to fetch comments");
      }
      const current = response?.data?.pagination?.page ?? 1;
      const totalPages = response?.data?.pagination?.total_pages ?? 1;
      return {
        comments: response?.data?.data,
        nextPage: current < totalPages ? current + 1 : null,
        total: response?.data?.pagination?.total ?? 0,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,

    // staleTime: 5 * 60 * 1000,
  });

  const comments = useMemo(() => {
    return commentsData?.pages.flatMap((p) => p.comments) ?? [];
  }, [commentsData]);

  const loadMoreComments = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!isAuthenticated || !user || !token) {
        throw new Error("Please log in to comment");
      }

      return await createComment(Number(matchId), text);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["matchComments", matchId],
      });
    },

    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleAddComment = (content: string) => {
    addCommentMutation.mutate(content);
  };

  const totalComments = commentsData?.pages?.[0]?.total ?? comments.length;

  const memoizedCommentItems = useMemo(
    () =>
      comments.map((comment) => (
        <div
          key={comment.id}
          className="transition-all duration-300 hover:scale-[1.01]"
        >
          <CommentItem
            comment={comment}
            matchId={matchId}
            onReplySuccess={() => {}}
          />
        </div>
      )),
    [comments, matchId]
  );

  return (
    <Card className="bg-card border-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion
          <span className="text-sm font-normal text-muted-foreground">
            ({totalComments} comments)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isAuthenticated ? (
          <CommentForm
            onSubmit={handleAddComment}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>{" "}
            to post a comment
          </div>
        )}

        <div className="space-y-4 mt-3">
          {isLoading ? (
            <CommentListSkeleton />
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">No comments yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <>
              {memoizedCommentItems}

              {hasNextPage && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreComments}
                    disabled={isFetchingNextPage}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isFetchingNextPage && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}

                    {isFetchingNextPage
                      ? "Loading more..."
                      : "Load More Comments"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
