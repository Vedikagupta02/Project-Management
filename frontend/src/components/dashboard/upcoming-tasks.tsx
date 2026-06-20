import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TASK_STATUS_LABELS, type Task } from "@/types/task";

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  if (tasks.length === 0) {
    return (
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium">Upcoming tasks</CardTitle>
          <Link href="/tasks">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No pending tasks
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">Upcoming tasks</CardTitle>
        <Link href="/tasks">
        <Button variant="ghost" size="sm">
          View all
          <ArrowRight className="size-3.5" />
        </Button>
      </Link>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {task.projectName}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {TASK_STATUS_LABELS[task.status]}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs capitalize">
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
