"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { AuthLoadingSkeleton } from "@/components/skeletons";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AuthLoadingSkeleton />}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      const callbackUrl = searchParams.get("callbackUrl") || "/profile";
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, isLoading, searchParams, router]);

  if (isLoading || isAuthenticated) {
    return <AuthLoadingSkeleton />;
  }

  return <main>{children}</main>;
}
