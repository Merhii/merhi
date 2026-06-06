"use client";

import { GitBranch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  GithubContributionDay,
  GithubContributionResponse
} from "@/lib/github";

const intensityClasses = [
  "bg-portfolio-bg",
  "bg-portfolio-muted",
  "bg-portfolio-secondary",
  "bg-portfolio-accent",
  "bg-portfolio-green"
];

const firstPrintLine = `System.out.println("Call Mom and tell her I love her ");`;
const finalPrintLine = `System.out.println("May have been defeated by a semicolon.");`;

const weekdayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

type ChartWeek = {
  contributionDays: Array<GithubContributionDay | null>;
};

function getIntensity(count: number) {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

function getDateFromDay(date: string) {
  return new Date(`${date}T00:00:00`);
}

function formatContributionDate(date: string) {
  return getDateFromDay(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getContributionLabel(day: GithubContributionDay | null) {
  if (!day) return "Loading contribution day";

  const contributionText =
    day.contributionCount === 1 ? "contribution" : "contributions";

  return `${day.contributionCount} ${contributionText} on ${formatContributionDate(day.date)}`;
}

function getDateKey(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

function createPlaceholderWeeks(): ChartWeek[] {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const firstSunday = new Date(start);
  firstSunday.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 53 }, (_, weekIndex) => ({
    contributionDays: Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + weekIndex * 7 + dayIndex);

      return {
        date: getDateKey(date),
        contributionCount: 0
      };
    })
  }));
}

export function GithubContributionChart() {
  const [data, setData] = useState<GithubContributionResponse | null>(null);
  const chartWeeks = useMemo<ChartWeek[]>(
    () => data?.weeks ?? createPlaceholderWeeks(),
    [data]
  );
  const monthLabels = useMemo(() => {
    const seenMonths = new Set<string>();

    return chartWeeks.flatMap((week, weekIndex) => {
      const monthStart = week.contributionDays.find((day) => {
        if (!day) return false;

        const date = getDateFromDay(day.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        return date.getDate() <= 7 && !seenMonths.has(monthKey);
      });

      if (!monthStart) return [];

      const date = getDateFromDay(monthStart.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      seenMonths.add(monthKey);

      return [
        {
          label: date.toLocaleDateString("en-US", { month: "short" }),
          weekIndex
        }
      ];
    });
  }, [chartWeeks]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const response = await fetch("/api/github");
        const payload = (await response.json()) as GithubContributionResponse;
        if (!ignore) setData(payload);
      } catch {
        if (!ignore) setData(null);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <article className="min-w-0 rounded-md border border-portfolio-accent bg-portfolio-card p-5 shadow-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-portfolio-accent">
            <GitBranch aria-hidden="true" className="h-4 w-4" />
            <p className="text-xs font-bold uppercase">Public GitHub Activity</p>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-portfolio-text">
            {data ? data.totalContributions.toLocaleString() : "..."} commits brewed this year
          </h3>
        </div>
        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-md border border-portfolio-accent bg-portfolio-bg px-3 py-2 font-mono text-[9px] leading-4 text-portfolio-muted sm:max-w-md sm:text-xs sm:leading-5">
          <code>
            {`if (github.isInactive()) {
    Bean.checkOn("Karim");
    `}
            <span aria-label={finalPrintLine} className="type-line-stack">
              <span aria-hidden="true" className="type-line type-line-call">
                {firstPrintLine}
              </span>
              <span aria-hidden="true" className="type-line type-line-final">
                {finalPrintLine}
              </span>
            </span>
            {`
}`}
          </code>
        </pre>
      </div>

      <div className="mt-6 max-w-full overflow-x-auto pb-2">
        <div className="w-max">
          <div
            aria-hidden="true"
            className="mb-1 ml-9 grid h-4 gap-1 text-[10px] font-semibold leading-4 text-portfolio-muted"
            style={{ gridTemplateColumns: `repeat(${chartWeeks.length}, 0.75rem)` }}
          >
            {monthLabels.map((month) => (
              <span
                className="github-month-label whitespace-nowrap"
                key={`${month.label}-${month.weekIndex}`}
                style={{ gridColumn: `${month.weekIndex + 1} / span 4` }}
              >
                {month.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[2rem_auto] gap-1">
            <div
              aria-hidden="true"
              className="grid grid-rows-7 gap-1 pr-1 text-right text-[10px] font-semibold leading-3 text-portfolio-muted"
            >
              {weekdayLabels.map((label, index) => (
                <span className="h-3" key={`${label}-${index}`}>
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {chartWeeks.map((week, weekIndex) =>
                Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week.contributionDays[dayIndex] ?? null;
                  const count = day?.contributionCount ?? 0;
                  const label = getContributionLabel(day);

                  return (
                    <span
                      aria-label={label}
                      className={`h-3 w-3 rounded-[3px] ${intensityClasses[getIntensity(count)]}`}
                      key={`${weekIndex}-${dayIndex}`}
                      title={label}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-portfolio-muted">
        <span>Less</span>
        {intensityClasses.map((className, index) => (
          <span
            aria-hidden="true"
            className={`h-3 w-3 rounded-[3px] ${className}`}
            key={className}
            title={`Contribution intensity ${index}`}
          />
        ))}
        <span>More</span>
      </div>
    </article>
  );
}
