import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type { ProjectMember } from "@/types/member";

export interface AddMemberPayload {
  email: string;
  role: string;
}

export const memberService = {
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const { data } = await apiClient.get<ApiResponse<ProjectMember[]>>(
      `/projects/${projectId}/members`
    );

    const members = unwrapApiData<ProjectMember[]>(data);
    return Array.isArray(members) ? members : [];
  },

  async getAllMembers(
    projectIds: Array<{ id: string; name: string }>
  ): Promise<Array<ProjectMember & { projectName: string; projectId: string }>> {
    const results = await Promise.all(
      projectIds.map(async (project) => {
        const members = await this.getProjectMembers(project.id);
        return members.map((member) => ({
          ...member,
          projectId: project.id,
          projectName: project.name,
        }));
      })
    );

    return results.flat();
  },

  async addProjectMember(
    projectId: string,
    payload: AddMemberPayload
  ): Promise<void> {
    await apiClient.post(`/projects/${projectId}/members`, payload);
  },

  async updateMemberRole(
    projectId: string,
    userId: string,
    role: string
  ): Promise<void> {
    await apiClient.put(`/projects/${projectId}/members/${userId}`, { role });
  },

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  },
};
