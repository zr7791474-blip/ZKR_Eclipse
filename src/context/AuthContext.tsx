import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext, DEMO_ACCOUNTS } from "./auth-context";
import type { AuthUser } from "../types/auth";

const STORAGE_KEY = "zkr-auth-user";

function readStoredUser(): AuthUser | null {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string, rememberMe = true) => {
      setIsLoading(true);
      try {
        // Simulate a network round-trip so the loading state feels real.
        await new Promise((resolve) => setTimeout(resolve, 700));

        const match = DEMO_ACCOUNTS.find(
          (account) =>
            account.email.toLowerCase() === email.trim().toLowerCase() &&
            account.password === password,
        );

        if (!match) {
          throw new Error(
            "Invalid email or password. Try one of the demo accounts below.",
          );
        }

        const serialized = JSON.stringify(match.user);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        (rememberMe ? localStorage : sessionStorage).setItem(
          STORAGE_KEY,
          serialized,
        );

        setUser(match.user);
        return match.user;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
