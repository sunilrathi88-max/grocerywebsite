import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../../hooks/useGSAP';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    // Parallax effect on the legacy image
    if (imageRef.current && containerRef.current) {
      gsap.to(imageRef.current, {
        y: 100, // Move image down slightly as we scroll down
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Text fade in stagger
    gsap.from('.philo-text', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      },
    });
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-ink py-24 lg:py-40 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 xl:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Col: Parallax Image */}
        <div className="relative h-[60vh] lg:h-[80vh] w-full overflow-hidden rounded-sm group">
          <div className="absolute inset-0 bg-char z-0"></div>
          {/* We use a high-contrast B&W or sepia historical placeholder mapping */}
          <img
            ref={imageRef}
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Traditional Indian spice market heritage"
            className="absolute inset-0 w-full h-[120%] object-cover object-center -top-[10%] opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80 z-10"></div>

          <div className="absolute bottom-8 left-8 z-20">
            <span className="text-saffron font-label font-bold tracking-widest text-xs uppercase bg-ink/80 px-4 py-2 backdrop-blur-md">
              Heritage Archive · Ramganj Mandi
            </span>
          </div>
        </div>

        {/* Right Col: Typography */}
        <div className="flex flex-col justify-center lg:pl-12">
          <div className="flex items-center gap-4 mb-8 philo-text">
            <span className="w-12 h-[1px] bg-saffron" />
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-dust uppercase">
              Our Philosophy
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl xl:text-6xl text-cream font-serif leading-[1.1] mb-8 philo-text">
            For 60 years, we refused to modernize our{' '}
            <span className="italic text-saffron">cold-grinding</span> traditions.
          </h2>

          <div className="space-y-6 text-mist font-light text-lg leading-relaxed philo-text">
            <p>
              When massive machines entered the spice trade, heating coriander and turmeric to
              degrees that vaporize their essential oils, we stayed in Ramganj Mandi.
            </p>
            <p>
              We established The Rathi Spice Co. in 1968 with a singular promise: absolute sensory
              fidelity. Our spices are procured directly from heritage farmers across India—Salem
              for turmeric, Mathania for chillies—and processed using slow, low-temperature
              friction.
            </p>
            <p className="text-dust font-medium">
              The result isn't just color. It's the unadulterated volatile oils and profound aroma
              of the earth itself, captured in every pinch.
            </p>
          </div>

          <div className="mt-12 philo-text">
            {/* Signature or founder mark */}
            <div className="font-serif italic text-3xl text-saffron opacity-80">
              The Rathi Family
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
