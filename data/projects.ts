export type Project = {
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  problem: string;
  whatIBuilt: string;
  features: string[];
  stack: string[];
  screenshots: {
    src: string;
    alt: string;
  }[];
  githubUrl: string;
  demoUrl?: string;
  status: string;
  learnings: string[];
};

export const projects: Project[] = [
  {
    title: "Moniz — Personal Wealth Tracker",
    slug: "moniz",
    shortDescription:
      "A personal finance app for tracking cash, bank balances, gold/silver holdings, currencies, and portfolio analytics.",
    longDescription:
      "Moniz is a personal wealth tracker built around the messy reality of everyday finances: mixed currencies, bank balances, precious metals, and changing asset values in one place.",
    problem:
      "Personal wealth often lives across cash, bank accounts, exchange rates, precious metals, and spreadsheets. Moniz brings those scattered pieces into a single mobile-first view that is easier to update and reason about.",
    whatIBuilt:
      "I designed Moniz as a focused finance dashboard with asset tracking, portfolio analytics, metals tracking, currency conversion, and charted breakdowns that keep the experience practical instead of overwhelming.",
    features: [
      "Asset tracking across cash, bank balances, currencies, gold, and silver",
      "Currency conversion for mixed holdings",
      "Portfolio analytics with performance and category breakdowns",
      "Mobile-first interface for quick balance updates",
      "Charts that surface allocation and movement at a glance"
    ],
    stack: ["Java", "Spring Boot", "SQL", "React", "Charts"],
    screenshots: [
      {
        src: "/projects/moniz/overview.png",
        alt: "Moniz dashboard overview placeholder"
      },
      {
        src: "/projects/moniz/analytics.png",
        alt: "Moniz analytics placeholder"
      },
      {
        src: "/projects/moniz/mobile.png",
        alt: "Moniz mobile balances placeholder"
      }
    ],
    githubUrl: "https://github.com/",
    status: "In progress",
    learnings: [
      "How to model financial assets without hiding real-world edge cases",
      "How to keep analytics readable on small screens",
      "How currency and metal pricing changes affect portfolio totals"
    ]
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
