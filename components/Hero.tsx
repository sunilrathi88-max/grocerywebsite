import React from 'react';
import { motion } from 'framer-motion';
import { PEACE_SOUNDBITES } from '../data/soundbites';
import { trackEvent } from '../utils/analytics';
import { OptimizedImage } from './OptimizedImage';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-hero min-h-[500px] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-3xl opacity-60 mix-blend-overlay" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-brand-primary/40 rounded-full blur-3xl opacity-60 mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full h-full flex flex-col md:flex-row items-center py-12 gap-8 md:gap-16">
        {/* Left: Content */}
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 items-center md:items-start"
          >
            {/* Tagline Badge */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light/10 text-brand-light border border-brand-light/20 text-sm font-bold tracking-widest uppercase backdrop-blur-md shadow-sm">
              Harvest to Home
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] drop-shadow-md">
              Fresh, Lab-Tested Spices from Indian Farms
            </h1>

            {/* Subheading & Bullets */}
            <div className="flex flex-col gap-3 text-white/95 text-lg md:text-xl font-medium max-w-lg">
              <p>Experience the aroma of spices sourced within weeks of harvest.</p>
              <ul className="flex flex-col gap-2 text-base md:text-lg text-brand-light/90 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary"></span> Freshly Sourced
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary"></span> Lab Tested for Purity
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-secondary"></span> No Fillers or Additives
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
              <button
                onClick={() => {
                  trackEvent({ name: 'hero_cta_primary_click' });
                  // Use specific filter if possible, or shop now
                  onShopNow();
                }}
                className="w-full sm:w-auto bg-brand-secondary text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-brand-secondary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Spices
              </button>
              <button
                onClick={() => {
                  trackEvent({ name: 'hero_cta_secondary_click' });
                  onShopNow();
                }}
                className="w-full sm:w-auto bg-white/10 text-white border border-white/30 px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Browse All Products
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <div className="w-full md:w-1/2 relative h-[350px] md:h-[500px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 w-full max-w-sm md:max-w-md"
          >
            {/* Feature Card Layout */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-sm group">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"
                alt="Premium Cardamom"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                priority="high"
                width={500}
                height={400}
              />

              {/* Quick Product overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-lg">Royal Green Cardamom</h3>
                    <div className="flex text-yellow-400 text-sm">★★★★★ <span className="text-white/70 ml-1">(128)</span></div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">₹599</p>
                    <span className="text-xs bg-brand-secondary px-2 py-0.5 rounded text-white font-bold">BESTSELLER</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
