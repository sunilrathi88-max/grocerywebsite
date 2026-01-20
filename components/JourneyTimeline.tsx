import React from 'react';

const JourneyTimeline: React.FC = () => {
  return (
    <section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-12 bg-background-light">
      <div className="text-center mb-20">
        <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-4 block">
          Transparency
        </span>
        <h3 className="text-4xl md:text-5xl font-serif font-medium text-accent-charcoal">
          The Journey of Purity
        </h3>
      </div>
      <div className="relative">
        {/* Line for desktop */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-primary/20 z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {/* Step 01 */}
          <div className="group relative flex flex-col items-center text-center timeline-item cursor-default">
            <div className="bg-background-light p-2 relative">
              <div className="size-20 rounded-full border border-primary/20 bg-background-light flex items-center justify-center timeline-icon transition-all duration-500 group-hover:scale-110 group-hover:shadow-soft">
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-white">
                  agriculture
                </span>
              </div>
            </div>
            <div className="mt-6 px-4">
              <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2 block">
                Step 01
              </span>
              <h4 className="font-serif text-2xl text-accent-charcoal mb-3">Harvest</h4>
              <p className="text-sm text-accent-charcoal/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                Hand-picked at peak potency from our partner farms in Kerala and Guntur.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div className="group relative flex flex-col items-center text-center timeline-item cursor-default">
            <div className="bg-background-light p-2 relative">
              <div className="size-20 rounded-full border border-primary/20 bg-background-light flex items-center justify-center timeline-icon transition-all duration-500 group-hover:scale-110 group-hover:shadow-soft">
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-white">
                  wb_sunny
                </span>
              </div>
            </div>
            <div className="mt-6 px-4">
              <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2 block">
                Step 02
              </span>
              <h4 className="font-serif text-2xl text-accent-charcoal mb-3">Sun Drying</h4>
              <p className="text-sm text-accent-charcoal/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                Naturally dried under the sun to preserve essential oils and natural color.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div className="group relative flex flex-col items-center text-center timeline-item cursor-default">
            <div className="bg-background-light p-2 relative">
              <div className="size-20 rounded-full border border-primary/20 bg-background-light flex items-center justify-center timeline-icon transition-all duration-500 group-hover:scale-110 group-hover:shadow-soft">
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-white">
                  science
                </span>
              </div>
            </div>
            <div className="mt-6 px-4">
              <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2 block">
                Step 03
              </span>
              <h4 className="font-serif text-2xl text-accent-charcoal mb-3">Lab Testing</h4>
              <p className="text-sm text-accent-charcoal/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                Rigorously tested for purity, potency, and safety standards in ISO labs.
              </p>
            </div>
          </div>

          {/* Step 04 */}
          <div className="group relative flex flex-col items-center text-center timeline-item cursor-default">
            <div className="bg-background-light p-2 relative">
              <div className="size-20 rounded-full border border-primary/20 bg-background-light flex items-center justify-center timeline-icon transition-all duration-500 group-hover:scale-110 group-hover:shadow-soft">
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-white">
                  inventory_2
                </span>
              </div>
            </div>
            <div className="mt-6 px-4">
              <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2 block">
                Step 04
              </span>
              <h4 className="font-serif text-2xl text-accent-charcoal mb-3">To Your Kitchen</h4>
              <p className="text-sm text-accent-charcoal/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                Sealed in eco-friendly packaging to deliver farm freshness to your home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
