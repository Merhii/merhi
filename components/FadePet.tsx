"use client";

import { useEffect, useRef, useState } from "react";

const storageKey = "karim-portfolio-fade-pet-count";
const fadeSoundPath = "/audio/faaaa.mp3";

function readFadeCount() {
  try {
    const storedCount = window.localStorage.getItem(storageKey);
    const parsedCount = Number.parseInt(storedCount ?? "0", 10);

    return Number.isFinite(parsedCount) ? parsedCount : 0;
  } catch {
    return 0;
  }
}

function writeFadeCount(fadeCount: number) {
  try {
    window.localStorage.setItem(storageKey, String(fadeCount));
  } catch {}
}

export function FadePet() {
  const [fadeCount, setFadeCount] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(
    null
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setFadeCount(readFadeCount());
    });

    return () => {
      window.cancelAnimationFrame(frame);

      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const playFadeSound = () => {
    try {
      const audio = document.querySelector<HTMLAudioElement>(
        "[data-fade-pet-audio]"
      );

      if (!audio) return;

      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {}
  };

  const restartHitAnimation = () => {
    const button = buttonRef.current;

    if (!button) return;

    button.classList.remove("fade-pet-button-hit");
    void button.offsetWidth;
    button.classList.add("fade-pet-button-hit");
  };

  const handleFade = () => {
    setFadeCount((currentCount) => {
      const nextCount = currentCount + 1;
      writeFadeCount(nextCount);
      return nextCount;
    });

    setIsBubbleVisible(true);
    restartHitAnimation();

    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = window.setTimeout(() => {
      setIsBubbleVisible(false);
      buttonRef.current?.classList.remove("fade-pet-button-hit");
    }, 1800);

    playFadeSound();
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      data-fade-pet-root
    >
      <div
        aria-live="polite"
        className={`fade-pet-bubble rounded-md border border-portfolio-accent bg-portfolio-card px-3 py-2 text-right shadow-glow ${
          isBubbleVisible ? "is-visible" : ""
        }`}
        data-fade-pet-bubble
        style={{
          opacity: isBubbleVisible ? 1 : 0,
          transform: isBubbleVisible
            ? "translateY(0) scale(1)"
            : "translateY(0.5rem) scale(0.95)"
        }}
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-portfolio-accent">
          FAAAAD
        </p>
        <p className="mt-1 font-mono text-xs font-bold text-portfolio-muted">
          faded <span data-fade-pet-count>{fadeCount}</span>x
        </p>
      </div>

      <button
        aria-label={`Fade the portfolio pet. Faded ${fadeCount} times.`}
        className="focus-ring fade-pet-button relative h-16 w-16 overflow-hidden rounded-md border border-portfolio-accent bg-portfolio-card shadow-glow"
        data-fade-pet-button
        onClick={handleFade}
        ref={buttonRef}
        type="button"
      >
        <span className="absolute inset-x-3 top-3 flex justify-between">
          <span className="h-2 w-2 rounded-full bg-portfolio-text" />
          <span className="h-2 w-2 rounded-full bg-portfolio-text" />
        </span>
        <span className="absolute left-2 top-1 h-5 w-4 -rotate-12 rounded-md border border-portfolio-accent bg-portfolio-bg" />
        <span className="absolute right-2 top-1 h-5 w-4 rotate-12 rounded-md border border-portfolio-accent bg-portfolio-bg" />
        <span className="absolute bottom-3 left-1/2 h-2 w-7 -translate-x-1/2 rounded-full bg-portfolio-green" />
        <span className="absolute bottom-0 left-0 h-5 w-full bg-portfolio-accent" />
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] font-black text-portfolio-bg">
          {fadeCount}
        </span>
      </button>

      <audio data-fade-pet-audio preload="auto" src={fadeSoundPath} />
    </div>
  );
}
