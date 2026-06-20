"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, isSessionLoading, hasToken } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    if (!hasToken) {
      router.replace(ROUTES.login);
      return;
    }

    if (!isSessionLoading && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [
    isInitializing,
    hasToken,
    isSessionLoading,
    isAuthenticated,
    router,
  ]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Loading workspace..." />
      </div>
    );
  }

  if (!hasToken) {
    return null;
  }

  if (isSessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Loading workspace..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
