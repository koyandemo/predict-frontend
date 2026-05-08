import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // Assuming you use shadcn's utility for merging classes

type Props = {
  size?: number;
  isCarousel?: boolean;
};

export function MatchListSkeleton({ size = 4, isCarousel = false }: Props) {
  return (
    <div className="w-full">
      {/* <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-20" />
      </div> */}
      <div className="flex items-center justify-between p-3 bg-linear-to-r from-primary/10 to-secondary/10 border-b border-border">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Match Cards Grid / Carousel */}
      <div
        className={cn(
          "mt-5 gap-3 md:gap-4",
          isCarousel
            ? "flex overflow-x-auto pb-4 scrollbar-hide" // Carousel styles
            : "grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" // Grid styles
        )}
      >
        {[...Array(size)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-card rounded-xl border border-border p-4",
              isCarousel && "min-w-[300px] md:min-w-[350px] shrink-0" // Prevent shrinking in carousel
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              {/* Home Team */}
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              
              {/* Score Placeholder */}
              <Skeleton className="h-8 w-12 rounded-lg mx-2" />
              
              {/* Away Team */}
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
  );
}