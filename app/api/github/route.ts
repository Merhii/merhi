import { NextResponse } from "next/server";
import {
  createMockGithubContributions,
  type GithubContributionResponse
} from "@/lib/github";

export const dynamic = "force-dynamic";

type GithubGraphqlResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: GithubContributionResponse;
      };
    };
  };
  errors?: unknown[];
};

const query = `
  query Contributions($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) {
    return NextResponse.json(createMockGithubContributions());
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username
        }
      }),
      next: {
        revalidate: 3600
      }
    });

    if (!response.ok) {
      return NextResponse.json(createMockGithubContributions());
    }

    const payload = (await response.json()) as GithubGraphqlResponse;
    const calendar =
      payload.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar || payload.errors?.length) {
      return NextResponse.json(createMockGithubContributions());
    }

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks
    });
  } catch {
    return NextResponse.json(createMockGithubContributions());
  }
}
