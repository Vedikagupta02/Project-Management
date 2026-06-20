"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/auth-provider";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboard() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardData(),
    enabled: isAuthenticated,
  });
}
