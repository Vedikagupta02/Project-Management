import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";
import type { DashboardData } from "@/types/dashboard";
import type { Task } from "@/types/task";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const projects = await projectService.getProjects();

    const totalMembers = projects.reduce(
      (sum, project) => sum + project.memberCount,
      0
    );

    let allTasks: Task[] = [];
    if (projects.length > 0) {
      allTasks = await taskService.getAllTasks(
        projects.map((p) => ({ id: p._id, name: p.name }))
      );
    }

    const completedTasks = allTasks.filter((t) => t.status === "done").length;
    const totalTasks = allTasks.length;

    const upcomingTasks = allTasks
      .filter((t) => t.status !== "done")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);

    return {
      stats: {
        totalProjects: projects.length,
        activeProjects: projects.length,
        totalTasks,
        completedTasks,
        overdueTasks: 0,
        teamMembers: totalMembers,
      },
      activeProjects: projects.slice(0, 4).map((p) => ({
        ...p,
        taskCount: allTasks.filter((t) => t.projectId === p._id).length,
        completedTaskCount: allTasks.filter(
          (t) => t.projectId === p._id && t.status === "done"
        ).length,
      })),
      recentActivity: [],
      upcomingTasks,
      teamActivity: [],
      productivityMetrics: [
        {
          label: "Tasks completed",
          value: completedTasks,
          change: totalTasks
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0,
          period: "this week",
        },
        {
          label: "Avg. completion time",
          value: 0,
          change: 0,
          period: "days",
        },
        {
          label: "On-time delivery",
          value: totalTasks
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0,
          change: 0,
          period: "%",
        },
        {
          label: "Active contributors",
          value: totalMembers,
          change: 0,
          period: "members",
        },
      ],
    };
  },
};
