import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Skeleton */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-8">
                <div className="text-center mb-6">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-5 w-32 mx-auto mb-1" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="border-b border-border p-6">
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Profile Picture Skeleton */}
                  <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div>
                        <Skeleton className="h-10 w-32 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Personal Information Skeleton */}
                  <div>
                    <Skeleton className="h-5 w-40 mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-10 w-full mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Preferences Skeleton */}
                  <div>
                    <Skeleton className="h-5 w-24 mb-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  
                  {/* Save Button Skeleton */}
                  <div className="flex justify-end pt-4">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
              
              {/* Statistics Section Skeleton */}
              <ProfileStatsSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfileStatsSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden mt-6">
      <div className="border-b border-border p-6">
        <Skeleton className="h-6 w-24 mb-1" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg p-4 text-center">
              <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
              <Skeleton className="h-6 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
