import { Suspense } from "react";
import { MatchesList } from "./_components/MatchList";

export default function MatchesPage() {
  return (
    <div className="container min-h-screen mx-auto px-4 py-6 md:py-8">
      <Suspense fallback={<div>Loading...</div>}>
      <MatchesList />
      </Suspense>
    </div>
  );
}
