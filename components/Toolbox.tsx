import { Code2, Database, Server, Wrench } from "lucide-react";

const groups = [
  {
    title: "Backend",
    icon: Server,
    tools: ["Java", "Spring Boot", "REST APIs", "Auth flows"]
  },
  {
    title: "Data",
    icon: Database,
    tools: ["SQL", "PostgreSQL", "Analytics", "Reporting"]
  },
  {
    title: "Frontend",
    icon: Code2,
    tools: ["TypeScript", "React", "Next.js", "Tailwind CSS"]
  },
  {
    title: "Workflow",
    icon: Wrench,
    tools: ["Git", "Debugging", "System Design", "LeetCode"]
  }
];

export function Toolbox() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => {
        const Icon = group.icon;

        return (
          <article
            className="rounded-md border border-portfolio-accent bg-portfolio-card p-5 shadow-glow"
            key={group.title}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-portfolio-bg text-portfolio-accent">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-black text-portfolio-text">
                {group.title}
              </h3>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.tools.map((tool) => (
                <span
                  className="rounded-md border border-portfolio-accent bg-portfolio-bg px-2.5 py-1 text-xs font-semibold text-portfolio-muted"
                  key={tool}
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
