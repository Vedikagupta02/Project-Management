"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MembersPanel } from "@/components/members/members-panel";
import { NotesPanel } from "@/components/notes/notes-panel";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { TaskBoard } from "@/components/tasks/task-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteProject, useProject, useProjects, useUpdateProject } from "@/hooks/use-projects";
import { formatDate } from "@/lib/format";

interface ProjectDetailPageProps {
  projectId: string;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const router = useRouter();
  const { data: projects = [] } = useProjects();
  const { data: projectData, isLoading, isError, refetch } = useProject(projectId);
  const updateProject = useUpdateProject(projectId);
  const deleteProject = useDeleteProject();

  const membership = projects.find((p) => p._id === projectId);
  const project = projectData
    ? { ...projectData, role: membership?.role ?? projectData.role, memberCount: membership?.memberCount ?? projectData.memberCount }
    : undefined;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isAdmin = project?.role === "admin";

  if (isLoading) {
    return <LoadingState message="Loading project..." />;
  }

  if (isError || !project) {
    return (
      <ErrorState
        title="Project not found"
        description="This project may have been deleted or you don't have access."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" render={<Link href="/projects" />}>
            <ArrowLeft className="size-4" />
            Back to projects
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                {project.name}
              </h1>
              <Badge variant="secondary" className="capitalize">
                {project.role?.replace("_", " ") ?? "member"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.description || "No description"}
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-none">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="mt-1 text-2xl font-semibold">{project.memberCount}</p>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Your role</p>
                <p className="mt-1 text-2xl font-semibold capitalize">
                  {project.role?.replace("_", " ") ?? "member"}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-none">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatDate(project.createdAt)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <MembersPanel projectId={projectId} canManage={isAdmin} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <TaskBoard projectId={projectId} canEdit />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NotesPanel projectId={projectId} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="shadow-none">
            <CardContent className="space-y-4 p-6">
              <div>
                <h3 className="text-sm font-medium">Project settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage project details and permissions.
                </p>
              </div>
              {isAdmin ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditOpen(true)}>
                    Edit project
                  </Button>
                  <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                    Delete project
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Only project admins can change settings.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProjectFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
        isPending={updateProject.isPending}
        onSubmit={async (values) => {
          await updateProject.mutateAsync(values);
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project"
        description={`Delete "${project.name}" permanently?`}
        isPending={deleteProject.isPending}
        onConfirm={() => {
          deleteProject.mutate(projectId, {
            onSuccess: () => router.push("/projects"),
          });
        }}
      />
    </div>
  );
}
