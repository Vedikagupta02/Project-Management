"use client";

import { ActiveProjects } from "@/components/dashboard/active-projects";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ProductivityMetrics } from "@/components/dashboard/productivity-metrics";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TeamActivity } from "@/components/dashboard/team-activity";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { useCurrentUser } from "@/hooks/use-auth";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data, isLoading, isError, refetch } = useDashboard();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, ${user?.fullName || user?.username || "there"}`}
        description="Here's what's happening across your projects today."
      />

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <ErrorState
          title="Failed to load dashboard"
          onRetry={() => refetch()}
        />
      )}

      {data && (
        <>
          <OverviewCards stats={data.stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ActiveProjects projects={data.activeProjects} />
            <UpcomingTasks tasks={data.upcomingTasks} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity activities={data.recentActivity} />
            </div>
            <TeamActivity activities={data.teamActivity} />
          </div>

          <ProductivityMetrics metrics={data.productivityMetrics} />
        </>
      )}

      {isLoading && !data && (
        <div className="sr-only">
          <LoadingState />
        </div>
      )}
    </div>
  );
}
