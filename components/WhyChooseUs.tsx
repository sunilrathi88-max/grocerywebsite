import React from 'react';

const features = [
  {
    title: 'COLD GROUND',
    benefit: 'Retains volatile oils & aroma vs. heat grinding.',
    detail:
      'Cold-grinding preserves the essential oils that make spices aromatic, while commercial high-heat grinding destroys these compounds and leaves spices flat.',
    icon: (
      <svg
        className="w-8 h-8 text-brand-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: 'LAB TESTED',
    benefit: 'Zero aflatoxin, zero salmonella. Every batch.',
    detail:
      'Each batch goes through multi-point testing for microbes, contaminants, pesticide residues, and aflatoxins so the spice quality is verified, not claimed.',
    icon: (
      <svg
        className="w-8 h-8 text-brand-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'FARM DIRECT',
    benefit: 'No middleman. Better prices for you, fairer pay for farmers.',
    detail:
      'Sourcing directly from small, long-term partner farms cuts out intermediaries and keeps quality and pricing under tighter control.',
    icon: (
      <svg
        className="w-8 h-8 text-brand-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
  },
  {
    title: 'SMALL BATCH',
    benefit: 'Weekly grinding. Fresh stock, not warehoused for months.',
    detail:
      'Instead of mass production and long storage, spices are ground in small batches so aroma and color stay vivid when they reach your kitchen.',
    icon: (
      <svg
        className="w-8 h-8 text-brand-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: 'FSSAI CERTIFIED',
    benefit: 'Licensed, inspected, compliant food business.',
    detail:
      'Operations follow Indian food safety standards, with proper licensing and documented processes for handling, packing, and storage.',
    icon: (
      <svg
        className="w-8 h-8 text-brand-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-accent-brown mb-4">
            Why Choose Tattvaco Co?
          </h2>
          <p className="text-xl text-neutral-700 font-medium">Pure Spices. Zero Compromise.</p>
        </div>

        {/* 5-Column Grid for Desktop, Flexible for Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center group h-full"
            >
              <div className="p-3 bg-brand-light rounded-full mb-4 border border-brand-primary/20 group-hover:bg-brand-primary/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm font-semibold text-brand-dark mb-2">{feature.benefit}</p>
              <p className="text-xs text-neutral-600 leading-relaxed">{feature.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-white border-2 border-neutral-900 text-neutral-900 rounded-lg font-bold hover:bg-neutral-900 hover:text-white transition-all shadow-button">
            View Lab Reports
          </button>
          <button className="px-8 py-3 bg-brand-primary text-white border-2 border-brand-primary rounded-lg font-bold hover:bg-brand-dark hover:border-brand-dark transition-all shadow-button">
            Meet Our Farmers
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
