import React from 'react';

const SustainabilitySection: React.FC = () => {
  return (
    <section className="py-20 bg-[#2D8B4F] text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)',
          backgroundSize: '30px 30px',
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            Our Commitment
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mt-6 mb-4">
            Spice that Heals the Planet
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg font-light">
            Every jar you buy supports regenerative farming and reduces plastic waste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-4xl font-bold mb-2">1,250 kg</h3>
            <p className="text-white/70 font-medium uppercase tracking-wide text-sm">
              Plastic Saved
            </p>
            <p className="text-white/60 text-sm mt-4 leading-relaxed">
              We use glass jars and biodegradable refills, eliminating single-use plastics from your
              kitchen.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4">👨‍🌾</div>
            <h3 className="text-4xl font-bold mb-2">42</h3>
            <p className="text-white/70 font-medium uppercase tracking-wide text-sm">
              Farmer Partners
            </p>
            <p className="text-white/60 text-sm mt-4 leading-relaxed">
              Direct trade relationships ensure farmers earn fair wages and invest in their
              communities.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-4xl font-bold mb-2">180</h3>
            <p className="text-white/70 font-medium uppercase tracking-wide text-sm">
              Acres Organic
            </p>
            <p className="text-white/60 text-sm mt-4 leading-relaxed">
              Land converted to chemical-free, regenerative agriculture that restores soil health.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="border-2 border-white text-white hover:bg-white hover:text-[#2D8B4F] font-bold py-3 px-8 rounded-full transition-colors uppercase tracking-widest text-sm">
            Read Our Impact Report
          </button>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
