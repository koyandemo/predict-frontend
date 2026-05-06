"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getMatchById } from "@/apiConfig/match.api";
import { MatchDetailSkeleton } from "@/components/skeletons";

import CommentsSection from "../_components/CommentsSection";
import { MatchHeader } from "../_components/MatchHeader";
import VotingPanel from "../_components/VotingPanle";
import { MatchResult } from "../_components/MatchResult";
import { ScorePredictionCard } from "../_components/ScorePredictionCard";

export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: match,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const res = await getMatchById(id);

      if (!res.success || !res.data) {
        throw new Error("Match not found");
      }

      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <MatchDetailSkeleton />;
  }

  if (isError || !match) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <MatchHeader match={match} />

      <main className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
          <VotingPanel match={match} onVoteUpdate={refetch} />

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

// "use client";

// import React from "react";
// import { notFound } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { MatchDetailSkeleton } from "@/components/skeletons";
// import { getMatchById } from "@/apiConfig/match.api";
// import CommentsSection from "../_components/CommentsSection";
// import { MatchHeader } from "../_components/MatchHeader";
// import VotingPanel from "../_components/VotingPanle";
// import { MatchResult } from "../_components/MatchResult";
// import { ScorePredictionCard } from "../_components/ScorePredictionCard";

// interface MatchPageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default function MatchPage({ params }: MatchPageProps) {
//   const { id } = React.use(params);

//   const {
//     data: match,
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["match", id],
//     queryFn: async () => {
//       const res = await getMatchById(id);
//       if (!res.success || !res.data) notFound();
//       return res.data;
//     },
//   });

//   if (isLoading || !match) {
//     return <MatchDetailSkeleton />;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <MatchHeader match={match} />

//       <main className="container mx-auto px-3 md:px-4 py-6 md:py-8">
//         <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
//           <VotingPanel match={match} onVoteUpdate={refetch} />

//           <MatchResult match={match} />

//           <ScorePredictionCard match={match} />

//           <div className="relative">
//             <CommentsSection matchId={match.id} />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }