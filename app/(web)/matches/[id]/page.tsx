"use client";

import React, { useCallback, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { MatchDetailSkeleton } from "@/components/skeletons";
import type { MatchT } from "@/types/match.type";
import { getMatchById } from "@/api/match.api";
import CommentsSection from "../_components/CommentsSection";
import { MatchHeader } from "../_components/MatchHeader";
import VotingPanel from "../_components/VotingPanle";
import { MatchResult } from "../_components/MatchResult";
import { ScorePredictionCard } from "../_components/ScorePredictionCard";

interface MatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MatchPage({ params }: MatchPageProps) {
  const { id } = React.use(params);

  const [match, setMatch] = useState<MatchT | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMatch = useCallback(async () => {
    try {
      const res = await getMatchById(id);

      if (!res.success || !res.data) {
        notFound();
      }

      setMatch(res.data);
    } catch (error) {
      console.error(error);
      notFound();
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  if (loading || !match) {
    return <MatchDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MatchHeader match={match} />

      <main className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
          <VotingPanel match={match} onVoteUpdate={fetchMatch} />

          <MatchResult match={match} />

          <ScorePredictionCard match={match} />

          <div className="relative">
            <CommentsSection matchId={match.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
