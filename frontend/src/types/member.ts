import type { UserAvatar } from "./user";

export interface ProjectMemberUser {
  _id: string;
  username: string;
  fullname?: string;
  fullName?: string;
  avatar?: UserAvatar;
}

export interface ProjectMember {
  project: string;
  user: ProjectMemberUser;
  role: string;
  createdAt: string;
}
