import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  const image = project.screenshots[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-portfolio-accent bg-portfolio-card shadow-glow transition duration-300 hover:-translate-y-1 hover:border-portfolio-green">
      <Link
        className="focus-ring relative block aspect-[16/10] overflow-hidden bg-portfolio-bg"
        href={`/projects/${project.slug}`}
      >
        <Image
          alt={image?.alt ?? `${project.title} screenshot`}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={image?.src ?? "/projects/moniz/overview.png"}
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-portfolio-green">
              {project.status}
            </p>
            <h3 className="mt-2 text-xl font-black text-portfolio-text">
              {project.title}
            </h3>
          </div>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-portfolio-muted">
          {project.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              className="rounded-md border border-portfolio-accent bg-portfolio-bg px-2.5 py-1 text-xs font-semibold text-portfolio-muted"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-portfolio-accent bg-portfolio-accent px-3 py-2 text-sm font-bold text-portfolio-bg transition hover:bg-portfolio-secondary"
            href={`/projects/${project.slug}`}
          >
            Details
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <a
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-portfolio-accent bg-portfolio-card px-3 py-2 text-sm font-bold text-portfolio-text transition hover:border-portfolio-green"
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
    </article>
  );
}
