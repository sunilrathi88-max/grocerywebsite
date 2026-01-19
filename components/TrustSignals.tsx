import React from 'react';

const TrustSignals: React.FC = () => {
  return (
    <section className="bg-accent-footer text-accent-cream py-16 px-6 relative z-20 -mt-2">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="size-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
            <span className="material-symbols-outlined text-[32px] text-white">
              verified_user
            </span>
          </div>
          <div>
            <h4 className="font-serif text-lg text-white mb-1">
              FSSAI Certified
            </h4>
            <p className="text-xs text-white/50 uppercase tracking-wider">
              100% Compliant
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="size-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
            <span className="material-symbols-outlined text-[32px] text-white">
              eco
            </span>
          </div>
          <div>
            <h4 className="font-serif text-lg text-white mb-1">
              Organic Origin
            </h4>
            <p className="text-xs text-white/50 uppercase tracking-wider">
              Pesticide Free
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="size-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
            <span className="material-symbols-outlined text-[32px] text-white">
              factory
            </span>
          </div>
          <div>
            <h4 className="font-serif text-lg text-white mb-1">
              ISO 9001:2015
            </h4>
            <p className="text-xs text-white/50 uppercase tracking-wider">
              Quality Assured
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="size-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/60 transition-colors">
            <span className="material-symbols-outlined text-[32px] text-white">
              location_on
            </span>
          </div>
          <div>
            <h4 className="font-serif text-lg text-white mb-1">
              Single Source
            </h4>
            <p className="text-xs text-white/50 uppercase tracking-wider">
              Farm Traceable
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
