"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "./ThemeProvider";

// Create a client-side query client
const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   staleTime: 5 * 60 * 1000, 
    // },
  },
});

export function AuthProviderClient({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}