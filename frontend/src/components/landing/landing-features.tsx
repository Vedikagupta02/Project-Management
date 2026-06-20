import {
  CheckSquare,
  FolderKanban,
  Shield,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FolderKanban,
    title: "Project organization",
    description:
      "Structure work into projects with clear ownership, descriptions, and member roles.",
  },
  {
    icon: CheckSquare,
    title: "Task execution",
    description:
      "Track tasks and subtasks with statuses, assignees, priorities, and due dates.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Invite members, manage permissions, and keep everyone aligned on delivery.",
  },
  {
    icon: Shield,
    title: "Secure access",
    description:
      "JWT authentication and role-based authorization protect your workspace.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="border-b border-border py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Everything your team needs to deliver
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Built for product, engineering, and operations teams that need a
            dependable system without unnecessary complexity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-none">
              <CardContent className="space-y-3 p-6">
                <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted/40">
                  <feature.icon className="size-4 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-medium">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
