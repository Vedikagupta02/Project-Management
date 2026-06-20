import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api-response";
import type { ApiResponse } from "@/types/api";
import type { Note } from "@/types/note";

export interface CreateNotePayload {
  content: string;
}

export const noteService = {
  async getProjectNotes(projectId: string): Promise<Note[]> {
    const { data } = await apiClient.get<ApiResponse<Note[]>>(
      `/projects/${projectId}/notes`
    );

    const notes = unwrapApiData<Note[]>(data);
    return Array.isArray(notes) ? notes : [];
  },

  async getAllNotes(
    projectIds: Array<{ id: string; name: string }>
  ): Promise<Array<Note & { projectName: string }>> {
    const results = await Promise.all(
      projectIds.map(async (project) => {
        const notes = await this.getProjectNotes(project.id);
        return notes.map((note) => ({
          ...note,
          projectName: project.name,
        }));
      })
    );

    return results.flat().sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createNote(
    projectId: string,
    payload: CreateNotePayload
  ): Promise<Note> {
    const { data } = await apiClient.post<ApiResponse<Note>>(
      `/projects/${projectId}/notes`,
      payload
    );

    return unwrapApiData<Note>(data);
  },

  async updateNote(
    projectId: string,
    noteId: string,
    payload: CreateNotePayload
  ): Promise<Note> {
    const { data } = await apiClient.put<ApiResponse<Note>>(
      `/projects/${projectId}/notes/${noteId}`,
      payload
    );

    return unwrapApiData<Note>(data);
  },

  async deleteNote(projectId: string, noteId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/notes/${noteId}`);
  },
};
