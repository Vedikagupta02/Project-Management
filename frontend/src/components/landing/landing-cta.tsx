import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-muted/20 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to manage projects with confidence?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Create your workspace and connect your team to a system designed for
            clarity, accountability, and consistent delivery.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.register}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Create free account
            </Link>
            <Link
              href={ROUTES.login}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Sign in to workspace
            </Link>
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href={ROUTES.login} className="hover:text-foreground">
              Sign in
            </Link>
            <Link href={ROUTES.register} className="hover:text-foreground">
              Register
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
