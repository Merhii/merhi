"use client";

import { motion } from "framer-motion";

type MascotProps = {
  size?: "sm" | "lg";
};

export function Mascot({ size = "lg" }: MascotProps) {
  const frameSize = size === "lg" ? "h-56 w-56 sm:h-64 sm:w-64" : "h-28 w-28";
  const monogramSize =
    size === "lg" ? "h-28 w-28 text-5xl" : "h-16 w-16 text-2xl";
  const accentOrb =
    size === "lg" ? "left-5 top-5 h-16 w-16" : "left-2 top-2 h-8 w-8";
  const greenBlock =
    size === "lg" ? "bottom-5 right-5 h-16 w-16" : "bottom-2 right-2 h-8 w-8";
  const secondaryBar =
    size === "lg" ? "right-8 top-10 h-8 w-24" : "right-4 top-5 h-4 w-12";
  const mutedBar =
    size === "lg" ? "bottom-12 left-8 h-5 w-20" : "bottom-6 left-4 h-3 w-10";

  return (
    <div className="relative flex flex-col items-center gap-4">
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className={`relative grid place-items-center ${frameSize}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-md border border-portfolio-accent bg-portfolio-card shadow-glow" />
        <div className={`absolute rounded-full bg-portfolio-accent ${accentOrb}`} />
        <div className={`absolute rounded-md bg-portfolio-green ${greenBlock}`} />
        <div className={`absolute rounded-md bg-portfolio-secondary ${secondaryBar}`} />
        <div className={`absolute rounded-md bg-portfolio-muted ${mutedBar}`} />
        <div
          className={`relative flex items-center justify-center rounded-md border border-portfolio-secondary bg-portfolio-bg font-black text-portfolio-text ${monogramSize}`}
        >
          KM
        </div>
      </motion.div>

    </div>
  );
}
