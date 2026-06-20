import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between border-r border-border bg-muted/30 p-10 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-sm font-bold">
            PF
          </div>
          <span className="font-semibold">{APP_NAME}</span>
        </Link>

        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Manage projects with clarity
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A professional workspace for teams to plan projects, track tasks,
            collaborate on notes, and deliver on time.
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md border border-border bg-background text-xs font-bold">
                PF
              </div>
              <span className="text-sm font-semibold">{APP_NAME}</span>
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
