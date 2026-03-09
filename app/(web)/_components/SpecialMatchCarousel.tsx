"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { MatchT } from "@/types/match.type";
import { MatchCard } from "../matches/_components/MatchCard";

interface SpecialMatchCarouselProps {
  title: string;
  matches: MatchT[];
}

export function SpecialMatchCarousel({
  title,
  matches,
}: SpecialMatchCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(matches.length > 0);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo =
        direction === "right"
          ? scrollLeft + clientWidth - 100
          : scrollLeft - clientWidth + 100;

      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  // Limit to 10 matches for the carousel
  const limitedMatches = matches.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center shadow-md hover:bg-card transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide py-2"
        >
          {limitedMatches.length > 0 ? (
            limitedMatches.map((match) => (
              <div key={match.id} className="shrink-0 w-64 md:w-72">
                <MatchCard match={match} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-muted-foreground">
              No matches found
            </div>
          )}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center shadow-md hover:bg-card transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
