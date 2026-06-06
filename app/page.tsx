import { Download, Github, Linkedin, Mail } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { CurrentlyStrip } from "@/components/CurrentlyStrip";
import { GithubContributionChart } from "@/components/GithubContributionChart";
import { LeetcodeDonut } from "@/components/LeetcodeDonut";
import { Mascot } from "@/components/Mascot";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

function Section({
  id,
  label,
  title,
  children
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16" id={id}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-portfolio-accent">
        {label}
      </p>
      <h2 className="mt-3 text-3xl font-black text-portfolio-bg sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="dashboard-grid min-h-screen overflow-hidden">
      <section className="mx-auto grid min-h-[88vh] w-full max-w-6xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="text-5xl font-black leading-[0.95] text-portfolio-bg sm:text-7xl">
            Karim Merhi
          </h1>
          <p className="mt-5 text-xl font-semibold text-portfolio-accent">
            Software Engineer @ Whish Money
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-portfolio-bg">
            Java, SQL, side projects, and suspicious amounts of coffee.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#projects" variant="primary">
              View Projects
            </ButtonLink>
            <ButtonLink href="https://github.com/" icon={Github}>
              GitHub
            </ButtonLink>
            <ButtonLink href="https://www.linkedin.com/" icon={Linkedin}>
              LinkedIn
            </ButtonLink>
            <ButtonLink download href="/Karim-Merhi-CV.pdf" icon={Download}>
              Download CV
            </ButtonLink>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Mascot />
        </div>
      </section>

      <CurrentlyStrip />

      <Section id="dashboard" label="Dev Dashboard" title="Stats, brewed fresh">
        <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <GithubContributionChart />
          <LeetcodeDonut />
        </div>
      </Section>

      <Section id="projects" label="Projects" title="Selected work">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>

      <footer className="border-t border-portfolio-accent px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-portfolio-bg sm:flex-row sm:items-center sm:justify-between">
          <p>Karim Merhi — built with coffee, TypeScript, and Bean supervision.</p>
          <div className="flex flex-wrap gap-3">
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:text-portfolio-accent"
              href="mailto:karim@example.com"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              Contact
            </a>
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:text-portfolio-accent"
              href="https://github.com/"
              rel="noreferrer"
              target="_blank"
            >
              <Github aria-hidden="true" className="h-4 w-4" />
              GitHub
            </a>
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:text-portfolio-accent"
              href="https://www.linkedin.com/"
              rel="noreferrer"
              target="_blank"
            >
              <Linkedin aria-hidden="true" className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
