import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: `${project.title} | Karim Merhi`,
    description: project.shortDescription
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="dashboard-grid min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <Link
          className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-semibold text-portfolio-bg transition hover:text-portfolio-accent"
          href="/#projects"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-portfolio-accent">
              {project.status}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-portfolio-bg sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-portfolio-bg">
              {project.shortDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-portfolio-accent bg-portfolio-accent px-3 py-2 text-sm font-bold text-portfolio-bg transition hover:bg-portfolio-secondary"
                href={project.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                <Github aria-hidden="true" className="h-4 w-4" />
                GitHub
              </a>
              {project.demoUrl ? (
                <a
                  className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-portfolio-accent bg-portfolio-card px-3 py-2 text-sm font-bold text-portfolio-text transition hover:border-portfolio-green"
                  href={project.demoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  Demo
                </a>
              ) : null}
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-portfolio-accent bg-portfolio-card shadow-glow">
            <Image
              alt={project.screenshots[0]?.alt ?? `${project.title} screenshot`}
              className="aspect-[16/10] h-full w-full object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              src={project.screenshots[0]?.src}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-10 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="h-fit rounded-md border border-portfolio-green bg-portfolio-card p-5 shadow-green lg:sticky lg:top-6">
          <h2 className="text-lg font-black text-portfolio-text">Tech stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                className="rounded-md border border-portfolio-accent bg-portfolio-bg px-2.5 py-1 text-xs font-semibold text-portfolio-muted"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </aside>

        <div className="space-y-5">
          <article className="rounded-md border border-portfolio-accent bg-portfolio-card p-6 shadow-glow">
            <h2 className="text-2xl font-black text-portfolio-text">Problem</h2>
            <p className="mt-3 leading-8 text-portfolio-muted">{project.problem}</p>
          </article>

          <article className="rounded-md border border-portfolio-accent bg-portfolio-card p-6 shadow-glow">
            <h2 className="text-2xl font-black text-portfolio-text">
              What I built
            </h2>
            <p className="mt-3 leading-8 text-portfolio-muted">
              {project.whatIBuilt}
            </p>
          </article>

          <article className="rounded-md border border-portfolio-accent bg-portfolio-card p-6 shadow-glow">
            <h2 className="text-2xl font-black text-portfolio-text">
              Main features
            </h2>
            <ul className="mt-4 grid gap-3">
              {project.features.map((feature) => (
                <li className="flex gap-3 text-portfolio-muted" key={feature}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-portfolio-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-md border border-portfolio-accent bg-portfolio-card p-6 shadow-glow">
            <h2 className="text-2xl font-black text-portfolio-text">
              Screenshots
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {project.screenshots.map((screenshot) => (
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-portfolio-accent"
                  key={screenshot.src}
                >
                  <Image
                    alt={screenshot.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 768px) 35vw, 100vw"
                    src={screenshot.src}
                  />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-portfolio-green bg-portfolio-card p-6 shadow-green">
            <h2 className="text-2xl font-black text-portfolio-text">
              What I learned
            </h2>
            <ul className="mt-4 grid gap-3">
              {project.learnings.map((learning) => (
                <li className="flex gap-3 text-portfolio-muted" key={learning}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-portfolio-green" />
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
