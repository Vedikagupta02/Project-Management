import {
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { DashboardStats } from "@/types/dashboard";

interface OverviewCardsProps {
  stats: DashboardStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Active projects"
        value={stats.activeProjects}
        icon={FolderKanban}
        trend={{ value: 8, label: "from last month" }}
      />
      <StatCard
        label="Tasks completed"
        value={`${stats.completedTasks}/${stats.totalTasks}`}
        icon={CheckCircle2}
        trend={{ value: completionRate, label: "completion rate" }}
      />
      <StatCard
        label="Overdue tasks"
        value={stats.overdueTasks}
        icon={AlertCircle}
      />
      <StatCard
        label="Team members"
        value={stats.teamMembers}
        icon={Users}
        trend={{ value: 4, label: "new this month" }}
      />
    </div>
  );
}
