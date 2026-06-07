# Karim Merhi Portfolio

A software engineering portfolio for projects, activity, and technical profile highlights.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

Optional environment variables:

```bash
NEXT_PUBLIC_LEETCODE_USERNAME=
NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_URL=
```

The portfolio is configured for `output: "export"` so it can deploy to GitHub Pages. That means there are no Next.js API routes at runtime. LeetCode stats are fetched directly from the browser when `NEXT_PUBLIC_LEETCODE_USERNAME` is set; GitHub contributions can be loaded from a public static JSON endpoint with `NEXT_PUBLIC_GITHUB_CONTRIBUTIONS_URL`. Without those values, the dashboard falls back to local demo data.
