export type TaskStatus = "todo" | "in_progress" | "done";

export interface TaskAssignee {
  _id: string;
  fullName?: string;
  username: string;
  avatar?: { url: string };
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project?: string;
  projectId?: string;
  projectName?: string;
  assignedTo?: TaskAssignee | string;
  assignee?: TaskAssignee;
  assignedBy?: string;
  attachments?: Array<{ url: string; mimetype: string; size: number }>;
  createdAt: string;
  updatedAt: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const TASK_COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];
