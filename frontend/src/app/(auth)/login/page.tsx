import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to access your workspace."
    >
      <LoginForm />
    </AuthLayout>
  );
}
