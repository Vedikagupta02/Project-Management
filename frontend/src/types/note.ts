import type { UserAvatar } from "./user";

export interface NoteAuthor {
  _id: string;
  username: string;
  fullName?: string;
  avatar?: UserAvatar;
}

export interface Note {
  _id: string;
  project: string;
  content: string;
  createdBy: NoteAuthor | string;
  createdAt: string;
  updatedAt: string;
}
