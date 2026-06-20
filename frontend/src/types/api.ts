export interface ApiResponse<T = unknown> {
  statusCode: number | boolean;
  data: T;
  message: string | T;
  success: boolean;
}

export interface ApiProjectRecord {
  _id: string;
  name: string;
  description?: string;
  members?: number;
  createdAt: string;
  createdBy: string;
}

export interface ApiProjectMemberItem {
  project: ApiProjectRecord;
  role: string;
}
