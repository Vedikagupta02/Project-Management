"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/use-projects";
import { formatDate } from "@/lib/format";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError, refetch } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  const updateProject = useUpdateProject(selected?._id ?? "");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [projects, search]);

  const openCreate = () => {
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setSelected(project);
    setFormOpen(true);
  };

  const openDelete = (project: Project) => {
    setSelected(project);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage and organize your team projects."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            New project
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setView("table")}
            aria-label="Table view"
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState title="Failed to load projects" onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start organizing work."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Create project
            </Button>
          }
        />
      )}

      {!isLoading && !isError && filtered.length > 0 && view === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project._id} className="shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/projects/${project._id}`}
                    className="min-w-0 flex-1 space-y-1 hover:underline"
                  >
                    <h3 className="truncate font-medium">{project.name}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {project.description || "No description"}
                    </p>
                  </Link>
                  <ProjectActions
                    project={project}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.memberCount} members</span>
                  <Badge variant="secondary" className="capitalize">
                    {project.role?.replace("_", " ") ?? "member"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && view === "table" && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="hidden px-4 py-3 text-left font-medium md:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-medium">Members</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((project) => (
                <tr key={project._id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${project._id}`}
                      className="font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground md:table-cell">
                    {project.description || "—"}
                  </td>
                  <td className="px-4 py-3">{project.memberCount}</td>
                  <td className="px-4 py-3 capitalize">
                    {project.role?.replace("_", " ") ?? "member"}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ProjectActions
                      project={project}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        project={selected}
        isPending={createProject.isPending || updateProject.isPending}
        onSubmit={async (values) => {
          if (selected) {
            await updateProject.mutateAsync(values);
          } else {
            await createProject.mutateAsync(values);
          }
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project"
        description={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        isPending={deleteProject.isPending}
        onConfirm={() => {
          if (selected) {
            deleteProject.mutate(selected._id, {
              onSuccess: () => setDeleteOpen(false),
            });
          }
        }}
      />
    </div>
  );
}

function ProjectActions({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const isAdmin = project.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex size-7 items-center justify-center rounded-md hover:bg-muted"
        )}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(project)} disabled={!isAdmin}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(project)}
          disabled={!isAdmin}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
