import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api-response";
import type {
  ApiProjectMemberItem,
  ApiProjectRecord,
  ApiResponse,
} from "@/types/api";
import type { Project } from "@/types/project";

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name: string;
  description?: string;
}

function mapProjectItem(item: ApiProjectMemberItem): Project {
  return {
    _id: item.project._id,
    name: item.project.name,
    description: item.project.description,
    status: "active",
    owner: item.project.createdBy,
    memberCount:
      typeof item.project.members === "number" ? item.project.members : 1,
    taskCount: 0,
    completedTaskCount: 0,
    createdAt: item.project.createdAt,
    updatedAt: item.project.createdAt,
    role: item.role,
  };
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const { data } = await apiClient.get<ApiResponse<ApiProjectMemberItem[]>>(
      "/projects"
    );

    const items = unwrapApiData<ApiProjectMemberItem[]>(data);
    return Array.isArray(items) ? items.map(mapProjectItem) : [];
  },

  async getProjectById(projectId: string): Promise<Project> {
    const { data } = await apiClient.get<ApiResponse<ApiProjectRecord>>(
      `/projects/${projectId}`
    );

    const project = unwrapApiData<ApiProjectRecord>(data);
    return mapProjectItem({ project, role: "member" });
  },

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const { data } = await apiClient.post<ApiResponse<ApiProjectRecord>>(
      "/projects",
      payload
    );

    const project = unwrapApiData<ApiProjectRecord>(data);
    return mapProjectItem({ project, role: "admin" });
  },

  async updateProject(
    projectId: string,
    payload: UpdateProjectPayload
  ): Promise<Project> {
    const { data } = await apiClient.put<ApiResponse<ApiProjectRecord>>(
      `/projects/${projectId}`,
      payload
    );

    const project = unwrapApiData<ApiProjectRecord>(data);
    return mapProjectItem({ project, role: "admin" });
  },

  async deleteProject(projectId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}`);
  },
};
