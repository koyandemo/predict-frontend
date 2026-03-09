import { Skeleton } from "@/components/ui/skeleton"

export function MatchesListSkeleton() {
  return (
    <div className="space-y-8">
      {/* League Filter Skeleton */}
      <div className="bg-card/50 rounded-2xl p-4 border border-border">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Status Filter Skeleton */}
      <div className="bg-card/50 rounded-2xl p-4 border border-border">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Matches Grid Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between p-3 bg-linear-to-r from-primary/10 to-secondary/10 border-b border-border">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Match Cards */}
        <div className="grid mt-5 gap-3 md:gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-8 w-12 rounded-lg" />
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-2 w-full rounded-full mb-2" />
              <div className="flex items-center justify-center gap-1">
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
