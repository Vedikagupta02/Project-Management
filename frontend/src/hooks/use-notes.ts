"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";
import {
  noteService,
  type CreateNotePayload,
} from "@/services/note.service";
import { useProjects } from "./use-projects";

export function useProjectNotes(projectId: string) {
  return useQuery({
    queryKey: ["notes", projectId],
    queryFn: () => noteService.getProjectNotes(projectId),
    enabled: Boolean(projectId),
  });
}

export function useAllNotes() {
  const { data: projects = [] } = useProjects();

  return useQuery({
    queryKey: ["notes", "all", projects.map((p) => p._id).join(",")],
    queryFn: () =>
      noteService.getAllNotes(
        projects.map((p) => ({ id: p._id, name: p.name }))
      ),
    enabled: projects.length > 0,
  });
}

export function useCreateNote(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotePayload) =>
      noteService.createNote(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateNote(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: CreateNotePayload;
    }) => noteService.updateNote(projectId, noteId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note updated");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteNote(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) =>
      noteService.deleteNote(projectId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
