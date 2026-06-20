"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Plus } from "lucide-react";
import { ProjectSelect } from "@/components/shared/project-select";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { TaskBoard } from "@/components/tasks/task-board";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";

export default function TasksPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage tasks across your projects with a kanban board."
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No projects yet"
          description="Create a project first, then add tasks to it."
          action={
            <Button render={<Link href="/projects" />}>
              <Plus className="size-4" />
              Go to projects
            </Button>
          }
        />
      ) : (
        <>
          <ProjectSelect value={projectId} onChange={setProjectId} />
          {projectId && <TaskBoard projectId={projectId} canEdit />}
        </>
      )}
    </div>
  );
}
