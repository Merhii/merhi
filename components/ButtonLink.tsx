import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: "primary" | "secondary" | "ghost";
  download?: boolean;
};

const variants = {
  primary:
    "border-portfolio-accent bg-portfolio-accent text-portfolio-bg shadow-glow hover:bg-portfolio-secondary",
  secondary:
    "border-portfolio-accent bg-portfolio-card text-portfolio-text hover:border-portfolio-green",
  ghost:
    "border-portfolio-bg bg-portfolio-bg text-portfolio-muted hover:text-portfolio-text"
};

export function ButtonLink({
  href,
  children,
  icon: Icon,
  variant = "secondary",
  download
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http");
  const className = `focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${variants[variant]}`;
  const content = (
    <>
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
      <span>{children}</span>
    </>
  );

  if (isExternal || download) {
    return (
      <a
        className={className}
        href={href}
        download={download}
        rel={isExternal ? "noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}
