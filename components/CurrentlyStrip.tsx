import { Coffee, Cpu, GraduationCap, Hammer } from "lucide-react";

const statuses = [
  {
    label: "Currently",
    value: "Software Engineer @ Whish Money",
    icon: Coffee
  },
  {
    label: "Building",
    value: "Moniz",
    icon: Hammer
  },
  {
    label: "Main Stack",
    value: "Java / Spring Boot / SQL",
    icon: Cpu
  },
  {
    label: "Learning",
    value: "System Design + LeetCode",
    icon: GraduationCap
  }
];

export function CurrentlyStrip() {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4">
      {statuses.map((status) => {
        const Icon = status.icon;

        return (
          <div
            className="rounded-md border border-portfolio-accent bg-portfolio-card p-4 shadow-glow"
            key={status.label}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-portfolio-bg text-portfolio-accent">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-portfolio-muted">
                  {status.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-portfolio-text">
                  {status.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
