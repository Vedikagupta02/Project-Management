"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { getApiErrorMessage } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  hasToken: boolean;
  isInitializing: boolean;
  isSessionLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setHasToken(authStorage.hasAccessToken());
    setIsInitializing(false);
  }, []);

  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    error: userError,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    enabled: !isInitializing && hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userError && hasToken) {
      authStorage.clearAccessToken();
      setHasToken(false);
      queryClient.setQueryData(["currentUser"], null);
    }
  }, [userError, hasToken, queryClient]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      setHasToken(true);
      queryClient.setQueryData(["currentUser"], response.user);
    },
    [queryClient]
  );

  const register = useCallback(async (credentials: RegisterCredentials) => {
    await authService.register(credentials);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setHasToken(false);
    queryClient.setQueryData(["currentUser"], null);
    queryClient.clear();
  }, [queryClient]);

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const isSessionLoading = hasToken && (isUserLoading || isUserFetching);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      hasToken,
      isInitializing,
      isSessionLoading,
      isAuthenticated: Boolean(user),
      error: userError ? getApiErrorMessage(userError) : null,
      login,
      register,
      logout,
      refetchUser,
    }),
    [
      user,
      hasToken,
      isInitializing,
      isSessionLoading,
      userError,
      login,
      register,
      logout,
      refetchUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
