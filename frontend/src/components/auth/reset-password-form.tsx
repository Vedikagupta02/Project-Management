"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/forms/form-field";
import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validators/auth";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPassword = useResetPassword(token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => resetPassword.mutate(data))}
      className="space-y-4"
      noValidate
    >
      <FormField
        label="New password"
        htmlFor="password"
        error={errors.password?.message}
        required
      >
        <PasswordInput
          id="password"
          placeholder="Enter new password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
        required
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        disabled={resetPassword.isPending}
      >
        {resetPassword.isPending ? "Updating..." : "Reset password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={ROUTES.login}
          className="font-medium text-foreground hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
