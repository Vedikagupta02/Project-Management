export type UserRole = "admin" | "project_admin" | "member";

export interface UserAvatar {
  url: string;
  localPath?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  role?: UserRole | string;
  avatar?: UserAvatar;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
