"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/forms/form-field";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddMember,
  useProjectMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks/use-members";
import { getInitials } from "@/lib/format";
import type { ProjectMember } from "@/types/member";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "project_admin", label: "Project Admin" },
  { value: "member", label: "Member" },
];

const inviteSchema = z.object({
  email: z.string().email("Valid email required"),
  role: z.enum(["admin", "project_admin", "member"]),
});

type InviteValues = z.infer<typeof inviteSchema>;

interface MembersPanelProps {
  projectId: string;
  canManage?: boolean;
}

export function MembersPanel({ projectId, canManage = false }: MembersPanelProps) {
  const { data: members = [], isLoading } = useProjectMembers(projectId);
  const addMember = useAddMember(projectId);
  const updateRole = useUpdateMemberRole(projectId);
  const removeMember = useRemoveMember(projectId);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selected, setSelected] = useState<ProjectMember | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "member" },
  });

  const role = watch("role");

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading members...</p>;
  }

  return (
    <div className="space-y-4">
      {canManage && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              reset({ email: "", role: "member" });
              setInviteOpen(true);
            }}
          >
            <Plus className="size-4" />
            Invite member
          </Button>
        </div>
      )}

      {members.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No members yet"
          description="Invite team members to collaborate on this project."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Member</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
                {canManage && (
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => {
                const name =
                  member.user.fullName ||
                  member.user.fullname ||
                  member.user.username;

                return (
                  <tr key={member.user._id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={member.user.avatar?.url} />
                          <AvatarFallback className="text-xs">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            @{member.user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {canManage ? (
                        <Select
                          value={member.role}
                          onValueChange={(value) => {
                            if (!value) return;
                            updateRole.mutate({
                              userId: member.user._id,
                              role: value,
                            });
                          }}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r.value} value={r.value}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary" className="capitalize">
                          {member.role.replace("_", " ")}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive"
                          onClick={() => {
                            setSelected(member);
                            setRemoveOpen(true);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(async (values) => {
              await addMember.mutateAsync(values);
              setInviteOpen(false);
            })}
            className="space-y-4"
          >
            <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
              <Input id="email" type="email" {...register("email")} placeholder="colleague@company.com" />
            </FormField>
            <FormField label="Role" htmlFor="role">
              <Select value={role} onValueChange={(v) => v && setValue("role", v as InviteValues["role"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMember.isPending}>
                {addMember.isPending ? "Inviting..." : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title="Remove member"
        description={`Remove ${selected?.user.username} from this project?`}
        confirmLabel="Remove"
        isPending={removeMember.isPending}
        onConfirm={() => {
          if (selected) {
            removeMember.mutate(selected.user._id, {
              onSuccess: () => setRemoveOpen(false),
            });
          }
        }}
      />
    </div>
  );
}
