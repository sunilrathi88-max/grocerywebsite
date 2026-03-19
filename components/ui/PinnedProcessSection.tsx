import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '../../hooks/useGSAP';

gsap.registerPlugin(ScrollTrigger);

const PROCESS_STEPS = [
  {
    id: "01",
    title: "The Procurement",
    subtitle: "Farm-Direct Origins",
    desc: "Every dawn during harvest season, our agents trace the lineage of the crop directly to heritage farms in Salem, Mathania, and Ramganj Mandi. Only the highest grade yields—untampered and pristine—are selected for our facilities.",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "02",
    title: "Sun Drying",
    subtitle: "Patience Above Efficiency",
    desc: "We refuse artificial hydrators. Each whole spice is naturally sun-dried to lock the dense, deep coloration and concentrate the molecular flavor compounds native to the soil. It takes exactly as long as nature requires.",
    imageUrl: "https://images.unsplash.com/photo-1615486171448-4fdcbef5dbbd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "03",
    title: "Cold Grinding",
    subtitle: "The Rathi Advantage",
    desc: "Commercial hot-grinding vaporizes up to 40% of essential aromatic oils. Our ancestral cold-grinding infrastructure utilizes slow, low-friction milling at low temperatures. The powder retains its full volatile profile—delivering a violently aromatic sensory experience.",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" // using placeholder, user will replace with actual spice powder macro
  }
];

export default function PinnedProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return;
    
    // Desktop only pinned scroll interaction
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 1024px)", () => {
      // The right side is pinned natively via CSS sticky top-0 h-screen
      
      // Animate the opacity of the images correlating to the text block currently in viewport
      const textBlocks = gsap.utils.toArray('.process-text-block') as HTMLElement[];
      const images = gsap.utils.toArray('.process-image') as HTMLElement[];

      textBlocks.forEach((block, i) => {
        ScrollTrigger.create({
          trigger: block,
          start: "top center",
          end: "bottom center",
          onToggle: self => {
            if (self.isActive) {
              gsap.to(images, { opacity: 0, scale: 1.05, duration: 0.5 });
              gsap.to(images[i], { opacity: 1, scale: 1, duration: 0.5 });
            }
          }
        });
      });
    });
    
    // Mobile fallback animations
    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray('.process-step-mobile').forEach((step: any) => {
        gsap.from(step, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
          }
        });
      });
    });

  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-char relative pb-24 lg:pb-0">
      
      {/* Desktop Layout - Pinned Scroll */}
      <div className="hidden lg:flex w-full items-start">
        
        {/* Left Col: Scrolling Text Blocks */}
        <div ref={leftRef} className="w-1/2 flex flex-col pt-[30vh] pb-[40vh] px-12 xl:px-24 border-r border-mist/10">
          
          <div className="mb-32">
             <span className="text-saffron tracking-[0.2em] font-bold text-xs uppercase mb-4 block">The Methodology</span>
             <h2 className="text-5xl font-serif text-cream leading-tight">Zero Compromises. <br/><span className="italic text-dust">From Soil to Seal.</span></h2>
          </div>

          {PROCESS_STEPS.map((step, idx) => (
            <div key={step.id} className="process-text-block min-h-[60vh] flex flex-col justify-center max-w-lg relative group">
              <div className="text-8xl font-serif text-mist/20 absolute -left-12 top-10 font-bold -z-10 group-hover:text-saffron/10 transition-colors duration-500">
                {step.id}
              </div>
              <h4 className="text-saffron font-label font-bold tracking-widest text-xs uppercase mb-3">
                Phase {step.id} · {step.subtitle}
              </h4>
              <h3 className="text-4xl text-cream font-serif mb-6">{step.title}</h3>
              <p className="text-dust text-lg font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right Col: Pinned Imagery */}
        <div ref={rightRef} className="w-1/2 h-screen sticky top-0 overflow-hidden bg-ink">
          {PROCESS_STEPS.map((step, idx) => (
            <img 
              key={`img-${step.id}`}
              className="process-image absolute inset-0 w-full h-full object-cover opacity-0 opacity-100-first"
              src={step.imageUrl}
              alt={step.title}
              style={{ opacity: idx === 0 ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
        </div>

      </div>

      {/* Mobile Layout - Stacked Flow */}
      <div className="lg:hidden container mx-auto px-4 pt-24">
         <div className="mb-16 text-center">
             <span className="text-saffron tracking-[0.2em] font-bold text-xs uppercase mb-4 block">The Methodology</span>
             <h2 className="text-4xl font-serif text-cream leading-tight">Zero Compromises. <br/><span className="italic text-dust">From Soil to Seal.</span></h2>
          </div>

          <div className="flex flex-col gap-16">
            {PROCESS_STEPS.map((step) => (
               <div key={`mob-${step.id}`} className="process-step-mobile flex flex-col w-full bg-ink rounded-lg overflow-hidden border border-mist/20">
                 <div className="h-64 w-full relative">
                    <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-ink/30 mix-blend-multiply"></div>
                    <div className="absolute top-4 left-4 text-4xl font-serif text-saffron/80 font-bold">{step.id}</div>
                 </div>
                 <div className="p-8">
                    <h4 className="text-saffron font-label font-bold tracking-widest text-xs uppercase mb-2">
                      {step.subtitle}
                    </h4>
                    <h3 className="text-2xl text-cream font-serif mb-4">{step.title}</h3>
                    <p className="text-dust text-sm font-light leading-relaxed">
                      {step.desc}
                    </p>
                 </div>
               </div>
            ))}
          </div>
      </div>

    </section>
  );
}
