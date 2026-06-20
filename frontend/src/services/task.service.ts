import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type { Task, TaskStatus } from "@/types/task";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignedTo?: string;
  status?: TaskStatus;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assignedTo?: string | null;
  status?: TaskStatus;
}

export const taskService = {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<Task[]>>(
      `/projects/${projectId}/tasks`
    );

    const tasks = unwrapApiData<Task[]>(data);
    return Array.isArray(tasks) ? tasks : [];
  },

  async getTaskById(projectId: string, taskId: string): Promise<Task> {
    const { data } = await apiClient.get<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`
    );

    return unwrapApiData<Task>(data);
  },

  async createTask(
    projectId: string,
    payload: CreateTaskPayload
  ): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<Task>>(
      `/projects/${projectId}/tasks`,
      payload
    );

    return unwrapApiData<Task>(data);
  },

  async updateTask(
    projectId: string,
    taskId: string,
    payload: UpdateTaskPayload
  ): Promise<Task> {
    const { data } = await apiClient.put<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`,
      payload
    );

    return unwrapApiData<Task>(data);
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },

  async getAllTasks(
    projectIds: Array<{ id: string; name: string }>
  ): Promise<Task[]> {
    const results = await Promise.all(
      projectIds.map(async (project) => {
        const tasks = await this.getProjectTasks(project.id);
        return tasks.map((task) => ({
          ...task,
          projectId: project.id,
          projectName: project.name,
        }));
      })
    );

    return results.flat();
  },
};
