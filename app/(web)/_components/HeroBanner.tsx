"use client";

import { useState, useEffect, useMemo } from "react";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { FootballApiStatisticsT } from "@/types/football.type";
import { footballApiService } from "@/apiConfig/football.api";
import { generateHeroBanners } from "@/lib/utils";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: stats } = useQuery<FootballApiStatisticsT>({
    queryKey: ["football-live-stats"],
    queryFn: footballApiService.getLiveStats,
    refetchInterval: 5 * 60 * 1000,
  });

  const slides = useMemo(() => generateHeroBanners(stats), [stats]);

  // Auto slide
  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const currentSlideData = slides[currentSlide];

  if (!currentSlideData) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-border mb-10">
      {/* background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/football-pitch-pattern.jpg')] bg-cover bg-center" />
      </div>

      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center gap-8">
          
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              <span>2024/25 Season</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {currentSlideData.title}
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-6">
              {currentSlideData.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {currentSlideData.stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover rounded-xl shadow-2xl shadow-primary/20"
                  />
                </div>
              ))}

              {/* Live matches */}
              <div className="absolute -bottom-3 -right-3 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs text-muted-foreground">Live Matches</p>
                <p className="text-lg font-bold text-primary">
                  {stats?.liveMatches ?? 12} Today
                </p>
              </div>

              {/* dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide
                        ? "bg-primary"
                        : "bg-primary/30"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}