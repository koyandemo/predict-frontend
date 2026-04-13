import { Skeleton } from "@/components/ui/skeleton"

export function MatchDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container w-full md:w-[50%] mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Match Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-6 md:h-8 w-3/4 mb-4" />
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 md:h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-2 md:gap-4 mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-full" />
              <div>
                <Skeleton className="h-4 md:h-5 w-20 md:w-24 mb-2" />
                <Skeleton className="h-3 md:h-4 w-12 md:w-16" />
              </div>
            </div>
            <div className="text-center">
              <Skeleton className="h-7 w-7 md:h-8 md:w-8 rounded-full mx-auto mb-1" />
              <Skeleton className="h-3 md:h-4 w-10 md:w-12" />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right">
                <Skeleton className="h-4 md:h-5 w-20 md:w-24 mb-2" />
                <Skeleton className="h-3 md:h-4 w-12 md:w-16" />
              </div>
              <Skeleton className="h-12 w-12 md:h-16 md:w-16 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center gap-3 md:gap-4">
            <Skeleton className="h-5 md:h-6 w-20 md:w-24 rounded-full" />
            <Skeleton className="h-5 md:h-6 w-20 md:w-24 rounded-full" />
          </div>
        </div>

        {/* Voting Panel Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 md:h-6 w-1/3 mb-4" />
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <Skeleton className="h-20 md:h-24 rounded-lg" />
            <Skeleton className="h-20 md:h-24 rounded-lg" />
            <Skeleton className="h-20 md:h-24 rounded-lg" />
          </div>
        </div>

        {/* Match Result Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 md:h-6 w-1/3 mb-4" />
          <Skeleton className="h-28 md:h-32 rounded-lg" />
        </div>

        {/* Score Prediction Card Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-5 md:h-6 w-1/3 mb-4" />
          <Skeleton className="h-40 md:h-48 rounded-lg" />
        </div>

        {/* Comments Section Skeleton */}
        <div>
          <Skeleton className="h-5 md:h-6 w-1/3 mb-4" />
          <Skeleton className="h-52 md:h-64 rounded-lg" />
        </div>
      </div>
    </div>
  )
}