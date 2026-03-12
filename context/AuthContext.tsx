"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { signOut, useSession } from "next-auth/react";

import { UserT, UserEnumT } from "@/types/user.type";
import { AuthResponseT } from "@/types/auth.type";
import { loginUser, registerUser } from "@/api/auth.api";
import { AUTH_STORAGE_KEYS } from "@/lib/utils";

interface AuthContextType {
  user: UserT | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserT | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<AuthResponseT>;
  register: (data: RegisterPayload) => Promise<AuthResponseT>;
  logout: () => void;
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};


const saveAuthToStorage = (user: UserT, token: string) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(
    AUTH_STORAGE_KEYS.USER_ID,
    user.id?.toString() || ""
  );
};

const clearStorage = () => {
  Object.values(AUTH_STORAGE_KEYS).forEach((key) =>
    localStorage.removeItem(key)
  );
};

const loadAuthFromStorage = () => {
  try {
    const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

    if (!user || !token) return null;

    return {
      user: JSON.parse(user) as UserT,
      token,
    };
  } catch {
    clearStorage();
    return null;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<UserT | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  useEffect(() => {
    setIsLoadingLocal(true);

    const stored = loadAuthFromStorage();

    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }

    setIsLoadingLocal(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    setIsLoadingLocal(true);

    if (session?.user) {
      const sUser = session.user as any;

      setUser(sUser);

      if (sUser.apiToken) {
        setToken(sUser.apiToken);
        saveAuthToStorage(sUser, sUser.apiToken);
      }
    } else {
      setUser(null);
      setToken(null);
      clearStorage();
    }

    setIsLoadingLocal(false);
  }, [session, status]);

  const handleAuthSuccess = (res: AuthResponseT) => {
    if (res.success && res.user && res.token) {
      const mappedUser = res.user as UserT;

      setUser(mappedUser);
      setToken(res.token);

      saveAuthToStorage(mappedUser, res.token);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponseT> => {
    const res = await loginUser(email, password);
    handleAuthSuccess(res);
    return res;
  };

  const register = async (data: RegisterPayload): Promise<AuthResponseT> => {
    const res = await registerUser(data);
    handleAuthSuccess(res);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearStorage();
    signOut({ callbackUrl: "/" });
  };

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
        login,
        register,
        logout,
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
