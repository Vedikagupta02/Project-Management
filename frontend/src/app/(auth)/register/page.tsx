import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Get started with your team workspace in minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
