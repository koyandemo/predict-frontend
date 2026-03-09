"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Loader2 } from "lucide-react"
import { CommentT } from "@/types/comment.type"
import { CommentListSkeleton } from "@/components/skeletons"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { commentService } from "@/service/commentService"
import { CommentItem } from "./CommentItem"
import { CommentForm } from "./CommentForm"

interface CommentsSectionProps {
  matchId: number | string
}

interface CommentPage {
  comments: CommentT[]
  nextPage: number | null
  total: number
}

const CommentsSection = ({ matchId }: CommentsSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, token, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: commentsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<CommentPage>({
    queryKey: ["matchComments", matchId],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await commentService.fetchMatchComments(matchId as string, pageParam=1, 10)

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch comments")
      }

      const current = response.pagination?.current_page ?? 1
      const totalPages = response.pagination?.total_pages ?? 1

      return {
        comments: response.data,
        nextPage: current < totalPages ? current + 1 : null,
        total: response.pagination?.total || 0,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 5 * 60 * 1000,
  })

  const comments = useMemo(
    () => commentsData?.pages.flatMap((p) => p.comments) || [],
    [commentsData]
  )

  /* ---------------- LOAD MORE ---------------- */

  const loadMoreComments = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  /* ---------------- ADD COMMENT ---------------- */

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!isAuthenticated || !user || !token) {
        throw new Error("Please log in to comment")
      }

      return commentService.createNewComment({
        matchId: Number(matchId),
        content,
        userId: user.user_id.toString(),
      })
    },

    onMutate: async (content: string) => {
      setIsSubmitting(true)

      await queryClient.cancelQueries({ queryKey: ["matchComments", matchId] })

      const previousData = queryClient.getQueryData<any>(["matchComments", matchId])

      if (previousData && user) {
        const optimisticComment: CommentT = {
          id: `optimistic-${Date.now()}`,
          matchId: matchId as string,
          userId: user.user_id.toString(),
          userName: user.name || `User ${user.user_id}`,
          userAvatar: user.avatar_url || `/football-fan-avatar-${Math.floor(Math.random() * 3) + 1}.jpg`,
          userType: user.type || "user",
          userAvatarColor: user.avatar_bg_color || "",
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          replyCount: 0,
        }

        queryClient.setQueryData(["matchComments", matchId], (oldData: any) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: CommentPage, i: number) =>
              i === 0
                ? { ...page, comments: [optimisticComment, ...page.comments] }
                : page
            ),
          }
        })
      }

      return { previousData }
    },

    onError: (err: any, _content, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["matchComments", matchId], context.previousData)
      }
      alert(err.message || "Failed to add comment")
    },

    onSuccess: (response) => {
      if (!response.success || !response.data) return

      queryClient.setQueryData(["matchComments", matchId], (oldData: any) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page: CommentPage) => ({
            ...page,
            comments: page.comments.map((c) =>
              c.id.startsWith("optimistic-") ? response.data! : c
            ),
          })),
        }
      })
    },

    onSettled: () => setIsSubmitting(false),
  })

  const handleAddComment = (content: string) => addCommentMutation.mutate(content)

  const memoizedCommentItems = useMemo(
    () =>
      comments.map((comment) => (
        <div key={comment.id} className="transition-all duration-300 hover:scale-[1.01]">
          <CommentItem comment={comment} matchId={matchId as string} onReplySuccess={() => {}} />
        </div>
      )),
    [comments, matchId]
  )

  return (
    <Card className="bg-card border-border w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Discussion
          <span className="text-sm font-normal text-muted-foreground">
            ({comments.length} comments)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isAuthenticated ? (
          <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
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
              <p className="text-muted-foreground">Be the first to share your thoughts!</p>
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
                    {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isFetchingNextPage ? "Loading more..." : "Load More Comments"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentsSection
