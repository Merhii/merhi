"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const storageKey = "karim-portfolio-fade-pet-count";
const fadeSoundPath = "/audio/faaaa.mp3";
const duckPetPath = "/pets/duck.svg";

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
  const hideTimeoutRef = useRef<number | null>(
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
        className="focus-ring fade-pet-button relative grid h-20 w-20 place-items-center overflow-visible border-0 bg-transparent p-0"
        data-fade-pet-button
        onClick={handleFade}
        ref={buttonRef}
        type="button"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="fade-pet-duck h-20 w-20"
          draggable={false}
          height={80}
          src={duckPetPath}
          width={80}
        />
      </button>

      <audio data-fade-pet-audio preload="auto" src={fadeSoundPath} />
    </div>
  );
}
