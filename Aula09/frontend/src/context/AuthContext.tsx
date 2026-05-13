"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "@/src/services/authService";
import type { AuthResponse, LoginPayload, Permission, RegisterPayload, User } from "@/src/types/auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  authLoading: boolean;
  authError: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  hasPermission: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "platform_token";

function persistSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      try {
        const currentUser = await authService.me(savedToken);
        setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setAuthError(null);
    setAuthLoading(true);

    try {
      const data = await authService.login(payload);
      persistSession(data);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao autenticar.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setAuthError(null);
    setAuthLoading(true);

    try {
      const data = await authService.register(payload);
      persistSession(data);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao cadastrar.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => Boolean(user?.permissions.includes(permission)),
    [user],
  );

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      authLoading,
      authError,
      login,
      register,
      logout,
      clearAuthError,
      hasPermission,
    }),
    [user, token, loading, authLoading, authError, login, register, logout, clearAuthError, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
