// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { MatchCarousel } from "./MatchCarousel";
// import { getAllMatches, isUpcoming } from "@/apiConfig/match.api";
// import {
//   FIFA_CLUB_WORLD_CUP_LEAGUE_ID,
//   buildKnockoutSections,
// } from "@/lib/fifaWorldCupUtils";
// import { MatchListSkeleton } from "@/components/skeletons";

// const GROUP_NAMES = [
//   "A",
//   "B",
//   "C",
//   "D",
//   "E",
//   "F",
//   "G",
//   "H",
//   "I",
//   "J",
//   "K",
//   "L",
// ] as const;
// type GroupName = (typeof GROUP_NAMES)[number];

// type GroupSection = {
//   group: GroupName;
//   matches: any[];
// };

// // Query key factories
// const matchQueryKeys = {
//   knockout: () =>
//     ["matches", "knockout", FIFA_CLUB_WORLD_CUP_LEAGUE_ID] as const,
//   group: (group: GroupName) =>
//     ["matches", "group", FIFA_CLUB_WORLD_CUP_LEAGUE_ID, group] as const,
// };

// // Fetcher functions
// async function fetchKnockoutMatches() {
//   const res = await getAllMatches({
//     league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
//     page: 1,
//     limit: 200,
//   });
//   const matches = res.success ? (res.data ?? []).filter(isUpcoming) : [];
//   return buildKnockoutSections(matches);
// }

// async function fetchGroupMatches(group: GroupName) {
//   const res = await getAllMatches({
//     league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
//     page: 1,
//     type: "GROUP_STAGE",
//     group_name: group,
//     limit: 200,
//   });
//   return res.success ? (res.data ?? []).filter(isUpcoming) : [];
// }

// export default function GroupInfiniteScroll() {
//   const queryClient = useQueryClient();

//   const [visibleGroups, setVisibleGroups] = useState<GroupName[]>([]);
//   const [sections, setSections] = useState<GroupSection[]>([]);
//   const [loadingGroup, setLoadingGroup] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const nextIndexRef = useRef(0);
//   const loadingRef = useRef(false);
//   const hasMoreRef = useRef(true);

//   // Knockout matches — refetch on every page refresh (staleTime: 0)
//   const { data: knockoutSections = [] } = useQuery({
//     queryKey: matchQueryKeys.knockout(),
//     queryFn: fetchKnockoutMatches,
//     staleTime: 0, // always considered stale → refetch on mount/refresh
//     gcTime: 5 * 60 * 1000, // keep in cache for 5 min between navigations
//   });

//   async function loadNextGroup() {
//     if (loadingRef.current) return;
//     if (nextIndexRef.current >= GROUP_NAMES.length) {
//       hasMoreRef.current = false;
//       setHasMore(false);
//       return;
//     }

//     loadingRef.current = true;
//     setLoadingGroup(true);

//     const group = GROUP_NAMES[nextIndexRef.current];
//     nextIndexRef.current += 1;

//     const matches = await queryClient.ensureQueryData({
//       queryKey: matchQueryKeys.group(group),
//       queryFn: () => fetchGroupMatches(group),
//       staleTime: 5 * 60 * 1000,
//       gcTime: 10 * 60 * 1000,
//     });

//     if (matches.length > 0) {
//       setSections((prev) => [...prev, { group, matches }]);
//       setVisibleGroups((prev) => [...prev, group]);
//     }

//     if (nextIndexRef.current >= GROUP_NAMES.length) {
//       hasMoreRef.current = false;
//       setHasMore(false);
//     }

//     loadingRef.current = false;
//     setLoadingGroup(false);
//   }

//   function isNearBottom() {
//     const scrollTop = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const docHeight = document.documentElement.scrollHeight;
//     return scrollTop + windowHeight >= docHeight - 400;
//   }

//   // Load first group on mount
//   useEffect(() => {
//     loadNextGroup();
//   }, []);

//   // Window scroll listener
//   useEffect(() => {
//     function handleScroll() {
//       if (!hasMoreRef.current) return;
//       if (isNearBottom()) loadNextGroup();
//     }

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Auto-load next group if page isn't scrollable yet
//   useEffect(() => {
//     if (!hasMoreRef.current) return;
//     const isScrollable =
//       document.documentElement.scrollHeight > window.innerHeight;
//     if (!isScrollable) {
//       loadNextGroup();
//     }
//   }, [sections]);

//   return (
//     <>
//       {sections.map(({ group, matches }) => (
//         <MatchCarousel
//           key={group}
//           title={`Group ${group}`}
//           route={`/matches/?status=scheduled&group=${group}`}
//           matches={matches}
//           showViewAll={false}
//         />
//       ))}

//       {loadingGroup && <MatchListSkeleton size={4} isCarousel={true} />}

//       {!hasMore &&
//         knockoutSections.map(({ title, matches }) => (
//           <MatchCarousel
//             key={title}
//             title={title}
//             route={`/matches/?status=scheduled&type=${title
//               .toUpperCase()
//               .replace(" ", "_")}`}
//             matches={matches}
//             showViewAll={false}
//           />
//         ))}
//     </>
//   );
// }

/**
 * @old_version
 */

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { MatchCarousel } from "./MatchCarousel";
// import { getAllMatches, isUpcoming } from "@/apiConfig/match.api";
// import { FIFA_CLUB_WORLD_CUP_LEAGUE_ID, buildKnockoutSections } from "@/lib/fifaWorldCupUtils";
// import { MatchListSkeleton } from "@/components/skeletons";

// const GROUP_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;
// type GroupName = typeof GROUP_NAMES[number];

// type GroupSection = {
//   group: GroupName;
//   matches: any[];
// };

// export default function GroupInfiniteScroll() {
//   const [sections, setSections] = useState<GroupSection[]>([]);
//   const [knockoutSections, setKnockoutSections] = useState<{ title: string; matches: any[] }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const nextIndexRef = useRef(0);
//   const loadingRef = useRef(false);
//   const hasMoreRef = useRef(true);

//   async function loadNextGroup() {
//     if (loadingRef.current) return;
//     if (nextIndexRef.current >= GROUP_NAMES.length) {
//       hasMoreRef.current = false;
//       setHasMore(false);
//       return;
//     }

//     loadingRef.current = true;
//     setLoading(true);

//     const group = GROUP_NAMES[nextIndexRef.current];
//     nextIndexRef.current += 1;

//     const res = await getAllMatches({
//       league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
//       page: 1,
//       type: "GROUP_STAGE",
//       group_name: group,
//       limit: 200,
//     });

//     const matches = res.success ? (res.data ?? []).filter(isUpcoming) : [];

//     if (matches.length > 0) {
//       setSections((prev) => [...prev, { group, matches }]);
//     }

//     if (nextIndexRef.current >= GROUP_NAMES.length) {
//       hasMoreRef.current = false;
//       setHasMore(false);
//     }

//     loadingRef.current = false;
//     setLoading(false);
//   }

//   // Check if user is near bottom of page
//   function isNearBottom() {
//     const scrollTop = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const docHeight = document.documentElement.scrollHeight;
//     return scrollTop + windowHeight >= docHeight - 400; // 400px before bottom
//   }

//   // Load knockout matches once on mount
//   useEffect(() => {
//     getAllMatches({
//       league_id: String(FIFA_CLUB_WORLD_CUP_LEAGUE_ID),
//       page: 1,
//       limit: 200,
//     }).then((res) => {
//       const matches = res.success ? (res.data ?? []).filter(isUpcoming) : [];
//       setKnockoutSections(buildKnockoutSections(matches));
//     });
//   }, []);

//   // Load first group on mount
//   useEffect(() => {
//     loadNextGroup();
//   }, []);

//   // Window scroll listener
//   useEffect(() => {
//     function handleScroll() {
//       if (!hasMoreRef.current) return;
//       if (isNearBottom()) loadNextGroup();
//     }

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // After each render, if page is not scrollable yet — auto-load next group
//   useEffect(() => {
//     if (!hasMoreRef.current) return;
//     const isScrollable =
//       document.documentElement.scrollHeight > window.innerHeight;
//     if (!isScrollable) {
//       loadNextGroup();
//     }
//   }, [sections]);

//   return (
//     <>
//       {sections.map(({ group, matches }) => (
//         <MatchCarousel
//           key={group}
//           title={`Group ${group}`}
//           route={`/matches/?status=scheduled&group=${group}`}
//           matches={matches}
//           showViewAll={false}
//         />
//       ))}

//       {loading && (
//         <MatchListSkeleton size={4} />
//       )}

//       {!hasMore && knockoutSections.map(({ title, matches }) => (
//         <MatchCarousel
//           key={title}
//           title={title}
//           route={`/matches/?status=scheduled&type=${title.toUpperCase().replace(" ", "_")}`}
//           matches={matches}
//           showViewAll={false}
//         />
//       ))}
//     </>
//   );
// }
