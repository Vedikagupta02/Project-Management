"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { MembersPanel } from "@/components/members/members-panel";
import { ProjectSelect } from "@/components/shared/project-select";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";

export default function MembersPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const selectedProject = projects.find((p) => p._id === projectId);
  const canManage = selectedProject?.role === "admin";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="View and manage team members across projects."
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No projects yet"
          description="Create a project to start inviting members."
          action={
            <Button render={<Link href="/projects" />}>Go to projects</Button>
          }
        />
      ) : (
        <>
          <ProjectSelect value={projectId} onChange={setProjectId} />
          {projectId && (
            <MembersPanel projectId={projectId} canManage={canManage} />
          )}
        </>
      )}
    </div>
  );
}
