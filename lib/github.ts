export type GithubContributionDay = {
  date: string;
  contributionCount: number;
};

export type GithubContributionWeek = {
  contributionDays: GithubContributionDay[];
};

export type GithubContributionResponse = {
  totalContributions: number;
  weeks: GithubContributionWeek[];
};

export function createMockGithubContributions(): GithubContributionResponse {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const daysSinceStart =
    Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1;
  const firstSunday = new Date(start);
  firstSunday.setDate(start.getDate() - start.getDay());

  const weeks: GithubContributionWeek[] = [];
  let totalContributions = 0;

  for (let weekIndex = 0; weekIndex < 53; weekIndex += 1) {
    const contributionDays: GithubContributionDay[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + weekIndex * 7 + dayIndex);

      const isCurrentYear = date.getFullYear() === today.getFullYear();
      const dayOfYear =
        Math.floor((date.getTime() - start.getTime()) / 86_400_000) + 1;
      const isFuture = dayOfYear > daysSinceStart;
      const weekdayWeight = dayIndex > 0 && dayIndex < 6 ? 1 : 0.42;
      const wave = Math.sin((dayOfYear / 365) * Math.PI * 7) + 1;
      const pulse = (weekIndex * 3 + dayIndex * 5) % 11;
      const count =
        isCurrentYear && !isFuture
          ? Math.max(0, Math.round((wave * 2 + pulse / 3) * weekdayWeight))
          : 0;

      totalContributions += count;
      contributionDays.push({
        date: date.toISOString().slice(0, 10),
        contributionCount: count
      });
    }

    weeks.push({ contributionDays });
  }

  return {
    totalContributions,
    weeks
  };
}
