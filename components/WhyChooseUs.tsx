import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

const features = [
  {
    title: 'COLD GROUND',
    benefit: 'Retains volatile oils & aroma.',
    detail:
      'Cold-grinding preserves the essential oils that make spices aromatic, unlike commercial high-heat grinding that destroys them.',
    icon: <SparklesIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'LAB TESTED',
    benefit: 'Zero aflatoxin, zero salmonella.',
    detail:
      'Every batch is tested for microbes, contaminants, and pesticide residues. Validated purity, not just a claim.',
    icon: <BeakerIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'FARM DIRECT',
    benefit: 'No middlemen. Fairer pay.',
    detail:
      'Sourcing directly from partner farms ensures our farmers get paid better and you get the freshest harvest.',
    icon: <UsersIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'SMALL BATCH',
    benefit: 'Freshly ground weekly.',
    detail:
      'We grind in small batches so the aroma and color stay vivid. No warehousing for months.',
    icon: <ClockIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'FSSAI CERTIFIED',
    benefit: '100% Licensed & Compliant.',
    detail:
      'Fully licensed food business following strict safety standards for handling, packing, and storage.',
    icon: <ShieldCheckIcon className="w-8 h-8 text-brand-primary" />,
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 bg-neutral-50 border-t border-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-2 block">
            The Tattvaco Difference
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 mb-4">
            Why Choose Tattva?
          </h2>
          <p className="text-xl text-neutral-600 font-medium max-w-2xl mx-auto">
            Pure Spices. Zero Compromise. Delivered Fresh.
          </p>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center group h-full"
            >
              <div className="p-4 bg-brand-light/30 rounded-full mb-5 group-hover:bg-brand-primary/10 transition-colors group-hover:scale-110 duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2 uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm font-semibold text-brand-dark mb-3">{feature.benefit}</p>
              <p className="text-xs text-neutral-500 leading-relaxed">{feature.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-lg font-bold hover:border-neutral-900 hover:bg-neutral-50 transition-all shadow-sm">
            View Lab Reports
          </button>
          <button className="px-8 py-3 bg-brand-primary text-white border border-brand-primary rounded-lg font-bold hover:bg-brand-dark hover:border-brand-dark transition-all shadow-button hover:shadow-lg">
            Meet Our Farmers
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
