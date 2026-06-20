import type { Project } from "./project";
import type { Task } from "./task";

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
}

export interface ActivityItem {
  id: string;
  type: "task" | "project" | "member" | "note" | "comment";
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

export interface TeamActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  action: string;
  target: string;
  timestamp: string;
}

export interface ProductivityMetric {
  label: string;
  value: number;
  change: number;
  period: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activeProjects: Project[];
  recentActivity: ActivityItem[];
  upcomingTasks: Task[];
  teamActivity: TeamActivityItem[];
  productivityMetrics: ProductivityMetric[];
}
