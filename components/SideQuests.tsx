import { Flame, Lightbulb, Trophy } from "lucide-react";

const quests = [
  {
    title: "System Design Notes",
    copy: "Turning messy architecture questions into calm diagrams and practical tradeoffs.",
    icon: Lightbulb
  },
  {
    title: "LeetCode Streaks",
    copy: "Practicing patterns, keeping the brain sharp, occasionally negotiating with recursion.",
    icon: Flame
  },
  {
    title: "Coffee Lab",
    copy: "Tiny experiments, dashboards, and finance ideas that deserve a weekend build.",
    icon: Trophy
  }
];

export function SideQuests() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {quests.map((quest) => {
        const Icon = quest.icon;

        return (
          <article
            className="rounded-md border border-portfolio-green bg-portfolio-card p-5 shadow-green"
            key={quest.title}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-portfolio-bg text-portfolio-green">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-black text-portfolio-text">
              {quest.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-portfolio-muted">
              {quest.copy}
            </p>
          </article>
        );
      })}
    </div>
  );
}
