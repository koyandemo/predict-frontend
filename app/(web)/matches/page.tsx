import { MatchesList } from "./_components/MatchList";

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 md:py-8">
        <MatchesList />
      </main>
    </div>
  );
}
