import { Skeleton } from "@/components/ui/skeleton"

export function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-semibold">
              <div className="col-span-1"><Skeleton className="h-4 w-full" /></div>
              <div className="col-span-5"><Skeleton className="h-4 w-full" /></div>
              <div className="col-span-3 text-center"><Skeleton className="h-4 w-full" /></div>
              <div className="col-span-3 text-center"><Skeleton className="h-4 w-full" /></div>
            </div>
            
            {/* Table Rows */}
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border last:border-b-0">
                <div className="col-span-1">
                  <Skeleton className="h-6 w-6 mx-auto rounded-full" />
                </div>
                <div className="col-span-5 flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  <Skeleton className="h-4 w-16 mx-auto mb-1" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                </div>
                <div className="col-span-3 text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
