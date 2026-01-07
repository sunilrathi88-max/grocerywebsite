import React from 'react';
import { m } from 'framer-motion';

const BrandStory: React.FC = () => {
  const features = [
    {
      title: 'Uncompromised Quality',
      desc: 'Sourced within weeks of harvest for maximum potency.',
      icon: '✨',
    },
    {
      title: 'Radical Transparency',
      desc: 'Every batch lab-tested. Scan QR to see the report.',
      icon: '🔬',
    },
    {
      title: 'Farmer First',
      desc: 'Direct partnerships. No middlemen. Fair prices.',
      icon: '🤝',
    },
  ];

  return (
    <section className="py-20 bg-neutral-50" id="why-us">
      <div className="max-w-7xl mx-auto px-4 md:px-16 text-center">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-3 block">
            Why Tattva Co?
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6 leading-tight max-w-2xl mx-auto">
            Fighting Mediocrity in Your Pantry
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-16 leading-relaxed">
            Most spices on shelves are dead—stored for months, losing their soul. We changed the
            rules to bring you flavor that actually tastes like something.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, idx) => (
            <m.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-neutral-100"
            >
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{feature.desc}</p>
            </m.div>
          ))}
        </div>

        <div className="mt-16">
          <a
            href="#/about"
            className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-dark transition-colors group"
          >
            Read Our Full Story
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
