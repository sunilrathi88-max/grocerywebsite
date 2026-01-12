import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';

const features = [
  {
    title: 'DIRECT',
    benefit: 'No middlemen = Better prices',
    detail:
      'We source directly from farmer co-operatives, ensuring fair pay and lower costs for you.',
    icon: <UsersIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'QUALITY',
    benefit: 'Tested for pesticides',
    detail: 'Every batch undergoes rigorous lab testing for purity, potency, and safety.',
    icon: <BeakerIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'FAST',
    benefit: '24-48 hour shipping',
    detail:
      'Our streamlined logistics ensure your spices are dispatched same-day for quick delivery.',
    icon: <ClockIcon className="w-8 h-8 text-brand-primary" />,
  },
  {
    title: 'FRESH',
    benefit: 'Packed same week',
    detail: 'Small batch grinding and immediate packing locks in the aroma and essential oils.',
    icon: <SparklesIcon className="w-8 h-8 text-brand-primary" />,
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

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
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
      </div>
    </section>
  );
};

export default WhyChooseUs;
