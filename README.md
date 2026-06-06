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
GITHUB_USERNAME=
GITHUB_TOKEN=
LEETCODE_USERNAME=
```

When GitHub variables are present, `/api/github` fetches contribution data server-side with GitHub GraphQL. Without them, both dashboard API routes return mock data so the site remains usable.
