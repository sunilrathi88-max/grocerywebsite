import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '../hooks/useGSAP';
import MagneticButton from './ui/MagneticButton';
import SpiceWorld from './ui/SpiceWorld';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Entrance Animation Timeline - triggers after Preloader completes (delay 2.1s)
    const tl = gsap.timeline({ delay: 2.1 });

    tl.from('.hero-text-line', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
    })
      .from(
        '.hero-cta',
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.8'
      )
      .from(
        '.hero-badge',
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.5)',
        },
        '-=0.6'
      );

    // Slight 3D tilt tracking for cursor across the whole hero section
    const moveArea = containerRef.current;
    if (moveArea) {
      moveArea.addEventListener('mousemove', (e) => {
        const { width, height, left, top } = moveArea.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        gsap.to('.hero-parallax-bg', {
          x: x * -30,
          y: y * -30,
          duration: 1.5,
          ease: 'power2.out',
        });

        gsap.to('.hero-parallax-foreground', {
          x: x * 20,
          y: y * 20,
          duration: 1.5,
          ease: 'power2.out',
        });
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center bg-ink overflow-hidden border-b border-char"
      aria-label="Welcome to The Rathi Spice Co."
    >
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(122,96,64,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(122,96,64,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] hero-parallax-bg" />

      <div className="container mx-auto px-4 md:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 hero-parallax-foreground pb-20 pt-32 lg:py-0">
        {/* Left Column (55%): Typography */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center order-2 lg:order-1 pt-8 lg:pt-0">
          <div className="overflow-hidden mb-6 flex flex-col gap-2">
            <span className="hero-badge inline-flex items-center gap-2 text-saffron tracking-[0.2em] text-xs font-bold uppercase w-fit">
              <span className="w-8 h-[1px] bg-saffron inline-block"></span>
              Established 1965
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-cream mb-6 tracking-tight">
            <div className="overflow-hidden p-1 -m-1">
              <span className="hero-text-line block">What hot-grinding</span>
            </div>
            <div className="overflow-hidden p-1 -m-1">
              <span className="hero-text-line block font-serif italic text-saffron font-medium pr-4">
                destroys, we preserve.
              </span>
            </div>
          </h1>

          <div className="overflow-hidden mb-12 max-w-xl">
            <p className="hero-text-line text-lg lg:text-xl text-dust font-light leading-relaxed">
              Cold-ground below 10°C. Direct from Ramganj Mandi. Since 1965. Zero shortcuts.
            </p>
          </div>

          <div className="hero-cta flex flex-wrap items-center gap-6">
            <MagneticButton
              href="/shop"
              className="bg-saffron hover:bg-gold text-ink px-8 py-4 rounded-none uppercase tracking-wider text-sm font-bold transition-colors"
            >
              Explore the Harvest
            </MagneticButton>
            <Link
              to="/about"
              data-cursor="link"
              className="text-cream hover:text-saffron transition-colors uppercase tracking-wider text-xs font-bold border-b border-mist pb-1"
            >
              Our Heritage &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column (45%): SpiceWorld Orb */}
        <div className="col-span-1 lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
          <SpiceWorld />
        </div>
      </div>
    </section>
  );
}
