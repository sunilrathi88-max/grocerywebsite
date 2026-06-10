import React, { useState, useEffect } from 'react';

const SESSION_KEY = 'rn-preloader-shown';

function shouldSkipPreloader(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return true;
  } catch {
    // sessionStorage unavailable (private mode) — fall through to motion check
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Preloader() {
  // Play the intro only once per session, and never for reduced-motion users
  const [skipped] = useState(shouldSkipPreloader);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!skipped) return;
    // Keep the contract for components that wait on this event
    window.dispatchEvent(new Event('preloader-complete'));
  }, [skipped]);

  useEffect(() => {
    if (skipped) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    // gsap is loaded on demand so it stays out of the critical bundle.
    // The static overlay below renders immediately; the animation starts
    // as soon as the (cached, code-split) gsap chunk arrives.
    import('gsap').then(({ gsap }) => {
      if (cancelled) return;
      dispose = runIntro(gsap);
    });

    return () => {
      cancelled = true;
      dispose?.();
    };

    // 1. Dark screen with SVG brand wordmark
    // 2. Wordmark draws itself via stroke-dashoffset animation (1.0s)
    // 3. Fill colour fades in (0.4s)
    // 4. Counter ticks 000 → 100 (1.1s, starts at 0.4s)
    // 5. Thin gold progress line sweeps across (0.6s at 1.5s)
    // 6. Preloader fades out (0.5s at 2.1s)
    function runIntro(gsap: typeof import('gsap').gsap): () => void {
      const tl = gsap.timeline({
        onComplete: () => {
          setComplete(true);
          try {
            window.sessionStorage.setItem(SESSION_KEY, '1');
          } catch {
            // Ignore storage failures (private mode)
          }
          // Trigger generic event so Hero component knows it can animate in
          window.dispatchEvent(new Event('preloader-complete'));
        },
      });

      // The Stroke path math assumes the SVG path has pathLength="100" injected
      tl.to(
        '#pre-text path',
        { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.1 },
        0.2
      )
        .to('#pre-text path', { fill: '#f2e8d0', fillOpacity: 1, duration: 0.4 }, 1.4)
        .to(
          '#pre-counter',
          {
            textContent: 100,
            duration: 1.1,
            snap: { textContent: 1 },
            onUpdate: function () {
              const el = document.getElementById('pre-counter');
              if (el) {
                el.innerHTML = String(Math.round(Number(this.targets()[0].textContent))).padStart(
                  3,
                  '0'
                );
              }
            },
          },
          0.4
        )
        .to('#pre-line', { width: '360px', duration: 0.6, ease: 'power3.inOut' }, 1.5)
        .to('#preloader', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 2.1);

      return () => tl.kill();
    }
  }, [skipped]);

  if (skipped || complete) return null;

  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[10000] bg-ink flex flex-col items-center justify-center pointer-events-none"
    >
      {/* Brand SVG Wordmark */}
      <div className="w-64 md:w-96 mb-16">
        <svg id="pre-text" viewBox="0 0 400 60" className="w-full h-auto overflow-hidden">
          {/* Temporary placeholder shapes, will be replaced with real brand SVG */}
          <path
            className="stroke-saffron stroke-1 fill-transparent"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            d="M 50,30 L 70,10 L 90,30 L 70,50 Z M 150,30 C 150,10 200,10 200,30 C 200,50 150,50 150,30 M 250,50 L 250,10 L 300,10 M 250,30 L 290,30"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center">
        {/* Counting Number */}
        <div className="font-serif text-cream text-5xl md:text-7xl font-light tracking-[-0.02em] mb-4">
          <span id="pre-counter">000</span>
        </div>

        {/* Progress Line */}
        <div className="w-0 bg-saffron h-[1px] opacity-70" id="pre-line" />
      </div>
    </div>
  );
}
