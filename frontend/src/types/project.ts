export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  owner: string;
  memberCount: number;
  taskCount: number;
  completedTaskCount: number;
  dueDate?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}
