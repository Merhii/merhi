import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type LeetcodeStats = {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
};

type LeetcodeGraphqlResponse = {
  data?: {
    matchedUser?: {
      submitStats?: {
        acSubmissionNum?: {
          difficulty: "All" | "Easy" | "Medium" | "Hard";
          count: number;
        }[];
      };
    };
  };
  errors?: unknown[];
};

const fallbackStats: LeetcodeStats = {
  totalSolved: 183,
  easySolved: 82,
  mediumSolved: 86,
  hardSolved: 15
};

const query = `
  query UserSolvedProblems($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

export async function GET() {
  const username = process.env.LEETCODE_USERNAME;

  if (!username) {
    return NextResponse.json(fallbackStats);
  }

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com"
      },
      body: JSON.stringify({
        query,
        variables: {
          username
        }
      }),
      next: {
        revalidate: 3600
      }
    });

    if (!response.ok) {
      return NextResponse.json(fallbackStats);
    }

    const payload = (await response.json()) as LeetcodeGraphqlResponse;
    const solved =
      payload.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];

    if (!solved.length || payload.errors?.length) {
      return NextResponse.json(fallbackStats);
    }

    const byDifficulty = new Map(
      solved.map((item) => [item.difficulty, item.count])
    );

    return NextResponse.json({
      totalSolved: byDifficulty.get("All") ?? fallbackStats.totalSolved,
      easySolved: byDifficulty.get("Easy") ?? fallbackStats.easySolved,
      mediumSolved: byDifficulty.get("Medium") ?? fallbackStats.mediumSolved,
      hardSolved: byDifficulty.get("Hard") ?? fallbackStats.hardSolved
    });
  } catch {
    return NextResponse.json(fallbackStats);
  }
}
