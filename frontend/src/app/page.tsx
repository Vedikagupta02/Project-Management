import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <section id="workflow" className="border-b border-border py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create projects",
                  description:
                    "Define scope, assign owners, and invite the right people.",
                },
                {
                  step: "02",
                  title: "Plan and assign work",
                  description:
                    "Break projects into tasks, set priorities, and track progress.",
                },
                {
                  step: "03",
                  title: "Deliver with visibility",
                  description:
                    "Monitor activity, notes, and team output from one dashboard.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-lg border border-border p-6"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-sm font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <LandingCta />
      </main>
    </div>
  );
}
