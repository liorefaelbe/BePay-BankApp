import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { clearToken, getToken, setToken } from "../lib/storage";

<<<<<<< HEAD
// Define the shape of the authenticated user object
=======
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
export type AuthUser = {
  email: string;
  balance?: number;
};

<<<<<<< HEAD
// Define the shape of the authentication context, including user info and auth methods
=======
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // helps UI show loading after refresh until /me resolves
  isHydrating: boolean;

  loginWithToken: (token: string, user?: AuthUser | null) => void;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(false);

  const isAuthenticated = !!token;

<<<<<<< HEAD
  // Login by setting token (and optionally user), storing token in localStorage
=======
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
  function loginWithToken(nextToken: string, nextUser?: AuthUser | null) {
    setToken(nextToken);
    setTokenState(nextToken);
    if (nextUser !== undefined) {
      setUser(nextUser);
    }
  }

  function logout() {
    clearToken();
    setTokenState(null);
    setUser(null);
  }

  async function refreshMe() {
    const res = await api.get("/user/me");
    setUser(res.data);
  }

  // On app start / refresh: if we have a token but no user, fetch /user/me once
  useEffect(() => {
    let isActive = true;

    async function hydrate() {
      if (!token) return;
      if (user) return;

      setIsHydrating(true);
      try {
        await refreshMe();
      } catch (e) {
        // Token invalid/expired -> force logout
        if (isActive) logout();
      } finally {
        if (isActive) setIsHydrating(false);
      }
    }

    hydrate();

    return () => {
      isActive = false;
    };
    // intentionally depends on token only; user is checked inside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated,
      isHydrating,
      loginWithToken,
      logout,
      refreshMe,
    }),
    [token, user, isAuthenticated, isHydrating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

<<<<<<< HEAD
// Custom hook to access the AuthContext
=======
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
