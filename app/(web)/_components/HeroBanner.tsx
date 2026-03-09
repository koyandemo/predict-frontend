"use client";

import { useState, useEffect } from "react";
import { Trophy, Users, MessageSquare, TrendingUp } from "lucide-react";
import { FootballApiStatisticsT } from "@/types/football.type";
import { footballApiService } from "@/api/football.api";

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState<FootballApiStatisticsT | null>(null);
  const [loading, setLoading] = useState(true);

  const SLIDES = [
    {
      image: "/football-action.png",
      title: "Predict. Vote. Debate.",
      description:
        "Join thousands of football fans predicting match outcomes. Vote for your favorite teams and share your insights with the community.",
      stats: [
        {
          icon: Users,
          value: stats?.activeUsers
            ? `${Math.floor(stats.activeUsers / 1000)}K+`
            : "10K+",
          label: "Active Fans",
        },
        {
          icon: MessageSquare,
          value: stats?.totalPredictions
            ? `${Math.floor(stats.totalPredictions / 1000)}K+`
            : "50K+",
          label: "Predictions",
        },
        { icon: TrendingUp, value: "78%", label: "Accuracy" },
      ],
    },
    {
      image: "/premier-league-trophy.png",
      title: "Premier League Action",
      description:
        "Stay up to date with the latest Premier League matches, predictions, and fan debates.",
      stats: [
        {
          icon: Users,
          value: stats?.activeUsers
            ? `${Math.floor(stats.activeUsers / 2000)}K+`
            : "20K+",
          label: "PL Fans",
        },
        {
          icon: MessageSquare,
          value: stats?.totalPredictions
            ? `${Math.floor(stats.totalPredictions / 1000)}K+`
            : "100K+",
          label: "Votes",
        },
        { icon: TrendingUp, value: "82%", label: "Engagement" },
      ],
    },
    {
      image: "/champions-league-trophy.png",
      title: "Champions League Drama",
      description:
        "Experience the thrill of Europe's elite competition with real-time predictions and discussions.",
      stats: [
        {
          icon: Users,
          value: stats?.activeUsers
            ? `${Math.floor(stats.activeUsers / 1500)}K+`
            : "15K+",
          label: "UCL Fans",
        },
        {
          icon: MessageSquare,
          value: stats?.totalPredictions
            ? `${Math.floor(stats.totalPredictions / 1000)}K+`
            : "75K+",
          label: "Predictions",
        },
        { icon: TrendingUp, value: "85%", label: "Accuracy" },
      ],
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await footballApiService.getLiveStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching live stats:", error);
        setStats({
          totalMatches: 10000,
          totalGoals: 25000,
          totalPredictions: 50000,
          activeUsers: 10000,
          liveMatches: 12,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [SLIDES.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-border mb-10">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/football-pitch-pattern.jpg')] bg-cover bg-center" />
      </div>

      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              <span>2024/25 Season</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              {currentSlideData.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl text-pretty mb-6">
              {currentSlideData.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              {currentSlideData.stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              {SLIDES.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl shadow-2xl shadow-primary/20"
                  />
                </div>
              ))}

              <div className="absolute -bottom-3 -right-3 bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
                <p className="text-xs text-muted-foreground">Live Matches</p>
                <p className="text-lg font-bold text-primary">
                  {stats?.liveMatches || 12} Today
                </p>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-primary" : "bg-primary/30"
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
