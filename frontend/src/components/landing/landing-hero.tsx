import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const highlights = [
  "Project & task management",
  "Role-based team access",
  "Notes and file attachments",
  "Real-time collaboration",
];

export function LandingHero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Project management for modern teams
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Ship projects with clarity and control
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Plan work, assign tasks, manage members, and keep context in one
              professional workspace built for teams that need reliability over
              noise.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={ROUTES.register}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Start for free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={ROUTES.login}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Sign in
            </Link>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-6">
          <div className="space-y-4 rounded-lg border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Platform Redesign</p>
                <p className="text-xs text-muted-foreground">6 members · 42 tasks</p>
              </div>
              <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                Active
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-foreground/70" />
            </div>
            <div className="grid gap-3">
              {["Review API contracts", "Update member permissions", "Publish release notes"].map(
                (task) => (
                  <div
                    key={task}
                    className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                  >
                    <span className="text-sm">{task}</span>
                    <span className="text-xs text-muted-foreground">Due soon</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
