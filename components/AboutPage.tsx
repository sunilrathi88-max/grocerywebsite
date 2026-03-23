import React from 'react';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { SEO } from './SEO';
import { pageSEO } from '../utils/seo';
import { OptimizedImage } from './OptimizedImage';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FAF6F2] py-20 min-h-screen">
      <SEO {...pageSEO.about()} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-[#B38B59]/10 border border-[#B38B59]/20 rounded-full text-[10px] font-bold text-[#B38B59] uppercase tracking-widest">
              Our Heritage Since 1965
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-[#42210B] leading-tight">
              A Legacy of <span className="text-[#B38B59] italic">Pure Essence</span>.
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium">
              Rooted in a <strong className="text-[#42210B]">60-year Rajasthani heritage</strong>,
              Rathi Naturals was born from a generational commitment to authentic Indian flavours.
              Long before the era of mass-produced, hot-ground spices, our family traded the finest
              yields directly from India&apos;s most renowned agricultural hubs.
            </p>
            <p className="text-stone-500 leading-relaxed font-normal">
              Today, we bypass the middlemen to work directly with farmers in the heartland. From
              the bustling coriander markets of{' '}
              <strong className="text-[#42210B]">Ramganj Mandi</strong> to the turmeric fields of{' '}
              <strong className="text-[#42210B]">Salem</strong> and the red chilli farms of{' '}
              <strong className="text-[#42210B]">Mathania</strong>, every product we offer is a
              testament to unwavering quality, precision cold-ground processing, and transparent,
              ethical sourcing.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/10 rounded-lg transform translate-x-4 translate-y-4"></div>
            <OptimizedImage
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="A vibrant Indian spice market"
              className="relative rounded-lg shadow-xl"
              type="hero"
              onError={imageErrorHandlers.hero}
            />
          </div>
        </div>

        {/* The Rathi Naturals Difference - Lab & Process */}
        <div className="bg-[#42210B] rounded-[3rem] p-12 md:p-24 mb-32 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B38B59]/10 rounded-full blur-3xl -mr-48 -mt-48" />

          <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
            <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Uncompromising Standards
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              The Rathi Naturals Difference
            </h2>
            <p className="text-stone-300 text-lg font-medium leading-relaxed">
              We believe in transparency and purity. Here&apos;s how we ensure you get nothing but
              the best, from farm to your kitchen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-[#B38B59]/20 rounded-2xl flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">
                ❄️
              </div>
              <h3 className="font-display font-bold text-2xl mb-4 text-white">
                Cold-Grinding Moat
              </h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Unlike mass-market brands reliant on high-speed hot-grinding, we uphold our heritage
                by slowly grinding spices at low temperatures. This scientifically defensible
                process prevents the loss of volatile essential oils.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-[#B38B59]/20 rounded-2xl flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">
                🧪
              </div>
              <h3 className="font-display font-bold text-2xl mb-4 text-white">Lab Tested</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Every batch undergoes rigorous testing for pesticides, heavy metals, and
                adulteration in ISO-certified laboratories. Only the purest spices make it to your
                kitchen.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
              <div className="w-16 h-16 bg-[#B38B59]/20 rounded-2xl flex items-center justify-center mb-8 text-3xl group-hover:scale-110 transition-transform">
                📍
              </div>
              <h3 className="font-display font-bold text-2xl mb-4 text-white">Authentic Origins</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                We source exclusively from historically significant regions:{' '}
                <strong>Ramganj Mandi</strong> for Coriander, <strong>Mathania</strong> for Red
                Chilli, and <strong>Salem</strong> for Turmeric.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
