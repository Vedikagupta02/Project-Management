"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-response";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/providers/auth-provider";
import { authService } from "@/services/auth.service";
import type {
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
} from "@/types/auth";

export function useCurrentUser() {
  const { user, isSessionLoading, isInitializing, error, refetchUser } =
    useAuth();
  return {
    data: user ?? undefined,
    isLoading: isInitializing || isSessionLoading,
    isError: Boolean(error),
    refetch: refetchUser,
  };
}

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      toast.success("Welcome back");
      router.push(ROUTES.dashboard);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || "Invalid email or password");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { register } = useAuth();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: () => {
      toast.success("Account created. Please sign in.");
      router.push(ROUTES.login);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || "Registration failed");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      router.push(ROUTES.login);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
    onSuccess: () => {
      toast.success("Reset link sent to your email");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || "Unable to send reset link");
    },
  });
}

export function useResetPassword(token: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(token, payload),
    onSuccess: () => {
      toast.success("Password updated successfully");
      router.push(ROUTES.login);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || "Unable to reset password");
    },
  });
}
