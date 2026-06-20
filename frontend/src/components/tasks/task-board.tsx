"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCreateTask,
  useDeleteTask,
  useProjectTasks,
  useUpdateTask,
} from "@/hooks/use-tasks";
import {
  TASK_COLUMNS,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/types/task";

interface TaskBoardProps {
  projectId: string;
  canEdit?: boolean;
}

export function TaskBoard({ projectId, canEdit = true }: TaskBoardProps) {
  const { data: tasks = [], isLoading } = useProjectTasks(projectId);
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const openCreate = (status: TaskStatus) => {
    setSelected(null);
    setDefaultStatus(status);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setSelected(task);
    setFormOpen(true);
  };

  const openDelete = (task: Task) => {
    setSelected(task);
    setDeleteOpen(true);
  };

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    updateTask.mutate({ taskId: task._id, payload: { status } });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tasks...</p>;
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {TASK_COLUMNS.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <Card key={status} className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium">
                  {TASK_STATUS_LABELS[status]}
                  <Badge variant="secondary" className="ml-2">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => openCreate(status)}
                    aria-label={`Add task to ${TASK_STATUS_LABELS[status]}`}
                  >
                    <Plus className="size-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {columnTasks.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No tasks
                  </p>
                )}
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                  >
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    {canEdit && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {TASK_COLUMNS.filter((s) => s !== task.status).map(
                          (s) => (
                            <Button
                              key={s}
                              variant="outline"
                              size="xs"
                              onClick={() => handleStatusChange(task, s)}
                            >
                              {TASK_STATUS_LABELS[s]}
                            </Button>
                          )
                        )}
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openEdit(task)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-destructive"
                          onClick={() => openDelete(task)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={selected}
        defaultStatus={defaultStatus}
        isPending={createTask.isPending || updateTask.isPending}
        onSubmit={async (values) => {
          if (selected) {
            await updateTask.mutateAsync({
              taskId: selected._id,
              payload: values,
            });
          } else {
            await createTask.mutateAsync(values);
          }
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete task"
        description={`Delete "${selected?.title}"?`}
        isPending={deleteTask.isPending}
        onConfirm={() => {
          if (selected) {
            deleteTask.mutate(selected._id, {
              onSuccess: () => setDeleteOpen(false),
            });
          }
        }}
      />
    </>
  );
}
