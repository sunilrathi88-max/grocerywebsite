import React, { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  threshold?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  href,
  onClick,
  threshold = 100,
}) => {
  const btnRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));

      if (dist < threshold) {
        const px = (e.clientX - cx) * 0.35;
        const py = (e.clientY - cy) * 0.35;
        gsap.to(btn, { x: px, y: py, duration: 0.25, ease: 'power2.out' });
      }
    },
    [threshold]
  );

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current;
    if (btn) {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    }
  }, []);

  if (href) {
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor="cta"
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="cta"
    >
      {children}
    </button>
  );
};

export default MagneticButton;
