import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { Project } from "@/types/project";

interface ActiveProjectsProps {
  projects: Project[];
}

const statusStyles: Record<Project["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  on_hold: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  completed: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  archived: "bg-muted text-muted-foreground",
};

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">Active projects</CardTitle>
        <Link href="/projects">
        <Button variant="ghost" size="sm">
          View all
          <ArrowRight className="size-3.5" />
        </Button>
      </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((project) => {
          const progress =
            project.taskCount > 0
              ? Math.round(
                  (project.completedTaskCount / project.taskCount) * 100
                )
              : 0;

          return (
            <Link
              key={project._id}
              href={`/projects/${project._id}`}
              className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium">{project.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={statusStyles[project.status]}
                >
                  {project.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {project.completedTaskCount}/{project.taskCount} tasks
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground/70 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {project.dueDate && (
                  <p className="text-xs text-muted-foreground">
                    Due {formatDate(project.dueDate)}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
