"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type AuthUser,
  authUserSchema,
  User,
} from "@/contexts/auth/domain/auth-user.entity";

interface AuthSessionResponse {
  authenticated: boolean;
  user: AuthUser | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession?: AuthSessionResponse;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const router = useRouter();
  const initialUser = useMemo(() => {
    if (!initialSession?.user) {
      return null;
    }

    const parsedInitialUser = authUserSchema.safeParse(initialSession.user);
    return parsedInitialUser.success ? new User(parsedInitialUser.data) : null;
  }, [initialSession?.user]);
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(initialSession?.authenticated && initialUser),
  );
  const [isLoading, setIsLoading] = useState(initialSession === undefined);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch auth session");
      }

      const data = (await response.json()) as AuthSessionResponse;
      setIsAuthenticated(Boolean(data.authenticated));

      if (!data.user) {
        setUser(null);
        return;
      }

      const parsedUser = authUserSchema.safeParse(data.user);
      setUser(parsedUser.success ? new User(parsedUser.data) : null);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) {
        return;
      }
      await refreshSession();
    };

    void load();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    };

    const handleFocus = () => {
      void refreshSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isLoggingOut,
      refreshSession,
      logout,
    }),
    [user, isAuthenticated, isLoading, isLoggingOut, refreshSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
