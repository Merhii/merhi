"use client";

import { BrainCircuit, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LeetcodeStats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

const fallbackStats: LeetcodeStats = {
  totalSolved: 183,
  easySolved: 82,
  mediumSolved: 86,
  hardSolved: 15
};

type LeetcodeStatsApiResponse = Partial<LeetcodeStats>;

const leetcodeColors = {
  easy: "#00B8A3",
  medium: "#FFC01E",
  hard: "#FF375F",
  easyTrack: "#184C49",
  mediumTrack: "#59471A",
  hardTrack: "#5C242D",
  tile: "#2D2D2D"
};

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
}

function arcPath(
  startAngle: number,
  endAngle: number,
  radius = 72,
  cx = 120,
  cy = 96
) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function LeetcodeDonut() {
  const [stats, setStats] = useState<LeetcodeStats>(fallbackStats);

  useEffect(() => {
    let ignore = false;
    const username = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;

    async function loadData() {
      if (!username) {
        setStats(fallbackStats);
        return;
      }

      try {
        const response = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${username}`
        );

        if (!response.ok) {
          throw new Error("LeetCode stats request failed");
        }

        const payload = (await response.json()) as LeetcodeStatsApiResponse;

        if (!ignore) {
          setStats({
            totalSolved: payload.totalSolved ?? fallbackStats.totalSolved,
            easySolved: payload.easySolved ?? fallbackStats.easySolved,
            mediumSolved: payload.mediumSolved ?? fallbackStats.mediumSolved,
            hardSolved: payload.hardSolved ?? fallbackStats.hardSolved
          });
        }
      } catch {
        if (!ignore) setStats(fallbackStats);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const segments = useMemo(() => {
    const parts = [
      {
        label: "Easy",
        value: stats.easySolved,
        color: leetcodeColors.easy,
        trackColor: leetcodeColors.easyTrack
      },
      {
        label: "Med.",
        value: stats.mediumSolved,
        color: leetcodeColors.medium,
        trackColor: leetcodeColors.mediumTrack
      },
      {
        label: "Hard",
        value: stats.hardSolved,
        color: leetcodeColors.hard,
        trackColor: leetcodeColors.hardTrack
      }
    ];
    const total = Math.max(
      stats.easySolved + stats.mediumSolved + stats.hardSolved,
      1
    );
    const span = 260;
    const gap = 7;
    let cursor = 140;

    return parts.map((part) => {
      const degrees = (part.value / total) * span;
      const start = cursor;
      const end = cursor + degrees;
      cursor = end;

      return {
        ...part,
        path: arcPath(start + gap / 2, Math.max(start + gap, end - gap / 2)),
        trackPath: arcPath(start + gap / 2, Math.max(start + gap, end - gap / 2))
      };
    });
  }, [stats]);

  return (
    <article className="min-w-0 rounded-md border border-portfolio-green bg-portfolio-card p-5 shadow-green">
      <div className="flex items-center gap-2 text-portfolio-accent">
        <BrainCircuit aria-hidden="true" className="h-4 w-4" />
        <p className="text-xs font-bold uppercase">LeetCode Suffering Meter</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1fr_8.5rem] md:items-center">
        <div className="relative mx-auto w-full max-w-sm">
          <svg
            aria-label={`${stats.totalSolved} total LeetCode problems solved`}
            className="h-auto w-full overflow-visible"
            viewBox="0 0 240 178"
          >
            {segments.map((segment) => (
              <g key={segment.label}>
                <path
                  d={segment.trackPath}
                  fill="none"
                  stroke={segment.trackColor}
                  strokeLinecap="round"
                  strokeWidth="7"
                />
                <path
                  d={segment.path}
                  fill="none"
                  stroke={segment.color}
                  strokeLinecap="round"
                  strokeWidth="7"
                />
              </g>
            ))}
          </svg>
          <div className="absolute inset-x-0 top-[38%] flex -translate-y-1/2 flex-col items-center">
            <span className="text-5xl font-black leading-none text-portfolio-text">
              {stats.totalSolved}
            </span>
            <span className="mt-2 flex items-center gap-1 text-xl font-semibold text-portfolio-text">
              <Check aria-hidden="true" className="h-5 w-5 text-portfolio-green" />
              Solved
            </span>
          
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {segments.map((segment) => (
            <div
              className="rounded-md px-3 py-3 text-center"
              key={segment.label}
              style={{ background: leetcodeColors.tile }}
            >
              <span
                className="block text-lg font-black"
                style={{ color: segment.color }}
              >
                {segment.label}
              </span>
              <span className="mt-1 block text-2xl font-black text-portfolio-text">
                {segment.value}
              </span>
            </div>
          ))}
        </div>
      </div>

    </article>
  );
}
