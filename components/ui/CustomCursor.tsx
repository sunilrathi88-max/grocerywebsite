import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '../../hooks/useGSAP';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hidden initially to prevent popping
    gsap.set([dotRef.current, ringRef.current], { opacity: 0 });

    const mouse = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };
    let initialized = false;

    const xSetDot = gsap.quickSetter(dotRef.current, 'x', 'px');
    const ySetDot = gsap.quickSetter(dotRef.current, 'y', 'px');
    const xSetRing = gsap.quickSetter(ringRef.current, 'x', 'px');
    const ySetRing = gsap.quickSetter(ringRef.current, 'y', 'px');

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!initialized) {
        // Snap ring immediately on first move
        ring.x = mouse.x;
        ring.y = mouse.y;
        gsap.set([dotRef.current, ringRef.current], { opacity: 1 });
        initialized = true;
      }

      xSetDot(mouse.x);
      ySetDot(mouse.y);

      // Handle hover states based on dataset
      const target = e.target as HTMLElement;
      const hoverTarget = target.closest('[data-cursor]');
      const cursorState = hoverTarget ? hoverTarget.getAttribute('data-cursor') : null;

      if (cursorState === 'cta') {
        gsap.to(ringRef.current, {
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          borderColor: 'var(--saffron)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else if (cursorState === 'link') {
        gsap.to(ringRef.current, {
          width: 50,
          height: 50,
          marginLeft: -25,
          marginTop: -25,
          borderColor: 'var(--dust)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        gsap.to(ringRef.current, {
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderColor: 'var(--mist)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const tickerHandler = () => {
      if (!initialized) return;
      // Framerate independent lerp (0.13 smooth factor)
      const dt = 1.0 - Math.pow(1.0 - 0.13, gsap.ticker.deltaRatio());
      ring.x += (mouse.x - ring.x) * dt;
      ring.y += (mouse.y - ring.y) * dt;
      xSetRing(ring.x);
      ySetRing(ring.y);
    };

    gsap.ticker.add(tickerHandler);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tickerHandler);
    };
  }, []);

  // Hide native cursor via global CSS, render custom DOM cursors
  return (
    <div className="hidden lg:block">
      {/* Ring element (Follows with lag) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[36px] h-[36px] -ml-[18px] -mt-[18px] rounded-full border border-mist pointer-events-none z-[9998]"
      />
      {/* Dot element (Follows exactly) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-saffron rounded-full pointer-events-none z-[9999]"
      />
    </div>
  );
}
