"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authApi } from "../api/auth.api";
import { AuthUser, LoginPayload, RegisterPayload } from "../../types/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_COOKIE = "token";
const USER_COOKIE = "user";
const COOKIE_EXPIRY_DAYS = 7;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Read session cookies on mount deferred in microtask to avoid cascading render warning in React 19
    queueMicrotask(() => {
      const storedUser = Cookies.get(USER_COOKIE);
      const token = Cookies.get(TOKEN_COOKIE);

      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          Cookies.remove(USER_COOKIE);
          Cookies.remove(TOKEN_COOKIE);
          setUser(null);
        }
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await authApi.login(payload);

    Cookies.set(TOKEN_COOKIE, data.token, { expires: COOKIE_EXPIRY_DAYS });
    Cookies.set(USER_COOKIE, JSON.stringify(data.user), {
      expires: COOKIE_EXPIRY_DAYS,
    });
    setUser(data.user);

    return data.user;
  };

  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
  };

  const logout = () => {
    Cookies.remove(TOKEN_COOKIE);
    Cookies.remove(USER_COOKIE);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}