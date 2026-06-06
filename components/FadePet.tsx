const fadePetScript = `
(() => {
  const storageKey = "karim-portfolio-fade-pet-count";
  const root = document.querySelector("[data-fade-pet-root]");

  if (!root || window.__fadePetReady === true) return;

  window.__fadePetReady = true;

  const button = root.querySelector("[data-fade-pet-button]");
  const bubble = root.querySelector("[data-fade-pet-bubble]");
  const countNodes = root.querySelectorAll("[data-fade-pet-count]");
  const audio = new Audio("/audio/faaaa.mp3");
  audio.preload = "auto";
  let fadeCount = 0;
  let hideTimeout;

  const writeCount = () => {
    try {
      window.localStorage.setItem(storageKey, String(fadeCount));
    } catch {}
  };

  const renderCount = () => {
    countNodes.forEach((node) => {
      node.textContent = String(fadeCount);
    });

    button?.setAttribute(
      "aria-label",
      "Fade the portfolio pet. Faded " + fadeCount + " times."
    );
  };

  const playFadeSound = () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  button?.addEventListener("click", () => {
    fadeCount += 1;
    writeCount();
    renderCount();
    playFadeSound();

    bubble?.classList.add("is-visible");
    button.classList.remove("fade-pet-button-hit");
    void button.offsetWidth;
    button.classList.add("fade-pet-button-hit");

    window.clearTimeout(hideTimeout);
    hideTimeout = window.setTimeout(() => {
      bubble?.classList.remove("is-visible");
      button.classList.remove("fade-pet-button-hit");
    }, 1800);
  });
})();
`;

export function FadePet() {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      data-fade-pet-root
    >
      <div
        aria-live="polite"
        className="fade-pet-bubble rounded-md border border-portfolio-accent bg-portfolio-card px-3 py-2 text-right shadow-glow"
        data-fade-pet-bubble
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-portfolio-accent">
          FAAAAD
        </p>
        <p className="mt-1 font-mono text-xs font-bold text-portfolio-muted">
          faded <span data-fade-pet-count>0</span>x
        </p>
      </div>

      <button
        aria-label="Fade the portfolio pet. Faded 0 times."
        className="focus-ring fade-pet-button relative h-16 w-16 overflow-hidden rounded-md border border-portfolio-accent bg-portfolio-card shadow-glow"
        data-fade-pet-button
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
        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] font-black text-portfolio-bg"
          data-fade-pet-count
        >
          0
        </span>
      </button>

      <script dangerouslySetInnerHTML={{ __html: fadePetScript }} />
    </div>
  );
}
