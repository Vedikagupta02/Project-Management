"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { NotesPanel } from "@/components/notes/notes-panel";
import { ProjectSelect } from "@/components/shared/project-select";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";

export default function NotesPage() {
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
        title="Notes"
        description="Project notes, decisions, and documentation."
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No projects yet"
          description="Create a project to start adding notes."
          action={
            <Button render={<Link href="/projects" />}>Go to projects</Button>
          }
        />
      ) : (
        <>
          <ProjectSelect value={projectId} onChange={setProjectId} />
          {projectId && <NotesPanel projectId={projectId} />}
        </>
      )}
    </div>
  );
}
