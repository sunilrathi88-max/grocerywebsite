import React from 'react';
import { motion } from 'framer-motion';
import { PEACE_SOUNDBITES } from '../data/soundbites';
import { trackEvent } from '../utils/analytics';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  // Use Set 1 (Quality) for the Hero as per requirements
  const heroMessage = PEACE_SOUNDBITES[0];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-hero min-h-[600px] flex items-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-3xl opacity-60 mix-blend-overlay" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-brand-primary/40 rounded-full blur-3xl opacity-60 mix-blend-overlay" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full h-full flex flex-col md:flex-row items-center py-12 md:py-20 gap-12">
        {/* Left: Content */}
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 items-center md:items-start"
          >
            {/* Tagline Badge */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-bold tracking-widest uppercase backdrop-blur-md border border-white/20 shadow-sm">
              Fresh Spices. Real Stories.
            </span>

            {/* Headline: The CHANGE */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] drop-shadow-md">
              {heroMessage.change}
            </h1>

            {/* Subheading: The RESULT */}
            <p className="text-xl md:text-2xl text-white/95 max-w-xl leading-relaxed font-medium font-sans">
              {heroMessage.result}
            </p>

            {/* Problem/Solution Context (Subtle) */}
            <p className="text-brand-light/80 text-base max-w-lg italic border-l-2 border-white/30 pl-4 my-2">
              &quot;{heroMessage.problem}&quot; <br />
              <span className="text-sm not-italic opacity-90 mt-1 block">
                — The Problem We Solved.
              </span>
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
              <button
                onClick={() => {
                  trackEvent({ name: 'hero_cta_click' });
                  onShopNow();
                }}
                className="bg-brand-secondary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse Collections
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <div className="w-full md:w-1/2 relative h-[400px] md:h-[550px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            {/* Main Hero Image */}
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000"
              alt="Premium Spices"
              className="w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700 rounded-2xl"
            />

            {/* Float Cards/Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-white p-4 rounded-xl shadow-xl max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-500 uppercase">Outcome</span>
              </div>
              <p className="text-gray-800 font-bold text-sm leading-tight">
                Flavor that wakes up your palate.
              </p>
            </motion.div>
          </motion.div>

          {/* Glow Behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white/20 rounded-full blur-[80px]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
