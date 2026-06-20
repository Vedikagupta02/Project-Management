"use client";

import { useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateNote,
  useDeleteNote,
  useProjectNotes,
  useUpdateNote,
} from "@/hooks/use-notes";
import { formatRelativeTime, getInitials } from "@/lib/format";
import type { Note, NoteAuthor } from "@/types/note";

interface NotesPanelProps {
  projectId: string;
}

function getAuthorName(createdBy: Note["createdBy"]) {
  if (typeof createdBy === "string") return "Unknown";
  const author = createdBy as NoteAuthor;
  return author.fullName || author.username || "Unknown";
}

function getAuthorAvatar(createdBy: Note["createdBy"]) {
  if (typeof createdBy === "string") return undefined;
  return (createdBy as NoteAuthor).avatar?.url;
}

export function NotesPanel({ projectId }: NotesPanelProps) {
  const { data: notes = [], isLoading } = useProjectNotes(projectId);
  const createNote = useCreateNote(projectId);
  const updateNote = useUpdateNote(projectId);
  const deleteNote = useDeleteNote(projectId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<Note | null>(null);

  const openCreate = () => {
    setSelected(null);
    setContent("");
    setDialogOpen(true);
  };

  const openEdit = (note: Note) => {
    setSelected(note);
    setContent(note.content);
    setDialogOpen(true);
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading notes...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add note
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Capture meeting notes, decisions, and project context."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add note
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const authorName = getAuthorName(note.createdBy);

            return (
              <div
                key={note._id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarImage src={getAuthorAvatar(note.createdBy)} />
                      <AvatarFallback className="text-xs">
                        {getInitials(authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(note.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => openEdit(note)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-destructive"
                      onClick={() => {
                        setSelected(note);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                  {note.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Edit note" : "Add note"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!content.trim()) return;
              if (selected) {
                await updateNote.mutateAsync({
                  noteId: selected._id,
                  payload: { content },
                });
              } else {
                await createNote.mutateAsync({ content });
              }
              setDialogOpen(false);
            }}
            className="space-y-4"
          >
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={6}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createNote.isPending || updateNote.isPending}
              >
                {selected ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete note"
        description="This note will be permanently deleted."
        isPending={deleteNote.isPending}
        onConfirm={() => {
          if (selected) {
            deleteNote.mutate(selected._id, {
              onSuccess: () => setDeleteOpen(false),
            });
          }
        }}
      />
    </div>
  );
}
