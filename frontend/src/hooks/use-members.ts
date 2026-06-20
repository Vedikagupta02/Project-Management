"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";
import {
  memberService,
  type AddMemberPayload,
} from "@/services/member.service";
import { useProjects } from "./use-projects";

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["members", projectId],
    queryFn: () => memberService.getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
}

export function useAllMembers() {
  const { data: projects = [] } = useProjects();

  return useQuery({
    queryKey: ["members", "all", projects.map((p) => p._id).join(",")],
    queryFn: () =>
      memberService.getAllMembers(
        projects.map((p) => ({ id: p._id, name: p.name }))
      ),
    enabled: projects.length > 0,
  });
}

export function useAddMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddMemberPayload) =>
      memberService.addProjectMember(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member invited");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useUpdateMemberRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      memberService.updateMemberRole(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Role updated");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useRemoveMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      memberService.removeProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member removed");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
