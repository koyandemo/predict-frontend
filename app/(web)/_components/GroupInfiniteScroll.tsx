"use client";

import { useEffect, useRef, useState } from "react";
import { MatchCarousel } from "./MatchCarousel";
import { getAllMatches, isUpcoming } from "@/apiConfig/match.api";
import { FIFA_CLUB_WORLD_CUP_LEAGUE_ID, buildKnockoutSections } from "@/lib/fifaWorldCupUtils";

const GROUP_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;
type GroupName = typeof GROUP_NAMES[number];

type GroupSection = {
  group: GroupName;
  matches: any[];
};

export default function GroupInfiniteScroll() {
  const [sections, setSections] = useState<GroupSection[]>([]);
  const [knockoutSections, setKnockoutSections] = useState<{ title: string; matches: any[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const nextIndexRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  async function loadNextGroup() {
    if (loadingRef.current) return;
    if (nextIndexRef.current >= GROUP_NAMES.length) {
      hasMoreRef.current = false;
      setHasMore(false);
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    const group = GROUP_NAMES[nextIndexRef.current];
    nextIndexRef.current += 1;

    const res = await getAllMatches({
      league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
      page: 1,
      type: "GROUP_STAGE",
      group_name: group,
      limit: 200,
    });

    const matches = res.success ? (res.data ?? []).filter(isUpcoming) : [];

    if (matches.length > 0) {
      setSections((prev) => [...prev, { group, matches }]);
    }

    if (nextIndexRef.current >= GROUP_NAMES.length) {
      hasMoreRef.current = false;
      setHasMore(false);
    }

    loadingRef.current = false;
    setLoading(false);
  }

  // Check if user is near bottom of page
  function isNearBottom() {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    return scrollTop + windowHeight >= docHeight - 400; // 400px before bottom
  }

  // Load knockout matches once on mount
  useEffect(() => {
    getAllMatches({
      league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
      page: 1,
      limit: 200,
    }).then((res) => {
      const matches = res.success ? (res.data ?? []).filter(isUpcoming) : [];
      setKnockoutSections(buildKnockoutSections(matches));
    });
  }, []);

  // Load first group on mount
  useEffect(() => {
    loadNextGroup();
  }, []);

  // Window scroll listener
  useEffect(() => {
    function handleScroll() {
      if (!hasMoreRef.current) return;
      if (isNearBottom()) loadNextGroup();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // After each render, if page is not scrollable yet — auto-load next group
  useEffect(() => {
    if (!hasMoreRef.current) return;
    const isScrollable =
      document.documentElement.scrollHeight > window.innerHeight;
    if (!isScrollable) {
      loadNextGroup();
    }
  }, [sections]);

  return (
    <>
      {sections.map(({ group, matches }) => (
        <MatchCarousel
          key={group}
          title={`Group ${group}`}
          route={`/matches/?status=scheduled&group=${group}`}
          matches={matches}
          showViewAll={false}
        />
      ))}

      {loading && (
        <div className="flex justify-center py-6">
          <span className="text-muted-foreground text-sm animate-pulse">
            {/* Loading Group {GROUP_NAMES[nextIndexRef.current-1] ?? ""}... */}
            Loading Group...
          </span>
        </div>
      )}

      {!hasMore && knockoutSections.map(({ title, matches }) => (
        <MatchCarousel
          key={title}
          title={title}
          route={`/matches/?status=scheduled&type=${title.toUpperCase().replace(" ", "_")}`}
          matches={matches}
          showViewAll={false}
        />
      ))}
    </>
  );
}