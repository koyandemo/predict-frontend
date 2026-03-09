import { Skeleton } from "@/components/ui/skeleton"

export function MatchCardVoteBarSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between mb-1">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex items-center justify-center gap-1 mt-2">
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
