"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

import { UserT } from "@/types/user.type";

interface AuthContextType {
  user: UserT | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserT | null) => void;
  setToken: (token: string | null) => void;
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<UserT | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    setIsLoadingLocal(true);

    if (session?.user) {
      setUser(session?.user as UserT);
      setToken(session?.user?.token as string);
    }

    setIsLoadingLocal(false);
  }, [session]);

  const isAuthenticated = status === "authenticated" || (!!user && !!token);

  const isLoading = status === "loading" || isLoadingLocal;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
