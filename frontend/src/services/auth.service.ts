import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api-response";
import { authStorage } from "@/lib/auth-storage";
import type { ApiResponse } from "@/types/api";
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
} from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );

    const payload = unwrapApiData<AuthResponse>(data);
    authStorage.setAccessToken(payload.accessToken);
    return payload;
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<{ user: User }>>(
      "/auth/register",
      credentials
    );

    const payload = unwrapApiData<{ user: User }>(data);
    return payload.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      authStorage.clearAccessToken();
    }
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<{ user: User }>>(
      "/auth/current-user"
    );

    const payload = unwrapApiData<{ user: User }>(data);
    return payload.user;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await apiClient.post("/auth/forgot-password", payload);
  },

  async resetPassword(
    token: string,
    payload: ResetPasswordPayload
  ): Promise<void> {
    await apiClient.post(`/auth/reset-password/${token}`, {
      newPassword: payload.password,
    });
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/change-password", { oldPassword, newPassword });
  },
};
