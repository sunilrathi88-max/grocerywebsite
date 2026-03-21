import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../hooks/useGSAP';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    id: '01',
    title: 'Direct Sourcing',
    desc: "Hand-selected from Ramganj Mandi — Asia's largest spice market. Third-generation farmer relationships, no middlemen, no compromises.",
    tag: 'Rajasthan, India',
  },
  {
    id: '02',
    title: 'Hand Sorting',
    desc: 'Every batch manually sorted to remove foreign matter and substandard units. The step that mass brands eliminated when they scaled.',
    tag: '100% manual inspection',
  },
  {
    id: '03',
    title: 'Cold Grinding',
    desc: 'Cryogenic mills kept below 10°C throughout. Volatile aromatic oils — the soul of any spice — are fully preserved, never destroyed by heat.',
    tag: 'Below 10°C always',
  },
  {
    id: '04',
    title: 'FSSAI Testing',
    desc: 'Every batch tested and certified under FSSAI Lic. 12225025000253. Proof of purity that arrives in your kitchen before the spice does.',
    tag: 'Lab certified',
  },
];

const JourneyTimeline: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from('.journey-step', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      },
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 w-full bg-ink relative overflow-hidden border-t border-b border-char"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24">
          <span className="text-saffron font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
            The Methodology
          </span>
          <h3 className="text-4xl md:text-5xl font-serif font-medium text-cream">
            Zero Shortcuts. <br className="md:hidden" />
            <span className="italic text-dust">Maximum Purity.</span>
          </h3>
        </div>

        <div className="relative">
          {/* Horizontal Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[50%] left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent -translate-y-1/2 z-0"></div>

          {/* Vertical Connecting Line (Mobile) */}
          <div className="lg:hidden absolute top-[5%] bottom-[5%] left-8 w-px bg-gradient-to-b from-transparent via-saffron/30 to-transparent z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="journey-step group relative flex flex-col items-start lg:items-center text-left lg:text-center pl-20 lg:pl-0"
              >
                {/* Ghost Number Behind */}
                <div className="absolute -top-6 -left-4 lg:left-1/2 lg:-translate-x-1/2 text-[8rem] font-serif font-bold text-char/40 transition-colors duration-500 group-hover:text-char select-none z-0 pointer-events-none">
                  {step.id}
                </div>

                {/* Content Card */}
                <div className="relative z-10 bg-char/40 backdrop-blur-sm border border-mist/10 rounded-xl p-8 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:border-saffron/50 group-hover:shadow-[0_10px_40px_-15px_rgba(234,179,8,0.15)] w-full w-full h-full flex flex-col justify-between">
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-saffron/10 text-saffron font-bold tracking-widest text-[10px] uppercase rounded-full mb-6 border border-saffron/20">
                      {step.tag}
                    </span>
                    <h4 className="font-serif text-2xl text-cream mb-4 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-sm text-dust leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
