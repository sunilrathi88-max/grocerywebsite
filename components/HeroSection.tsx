import React, { useRef } from 'react';
import { Button } from './Button';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Pure CSS animated gradient background (shader fallback) - kept for background logic
const AnimatedGradientBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2D8B4F 40%, #E67E22 100%)', // Using brand colors: Green -> Orange
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite',
        opacity: 0.9,
      }}
    />
    {/* Dark overlay for text readability - Increased contrast */}
    <div className="absolute inset-0 bg-black/60" />
    <style>{`
      @keyframes gradientFlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
    `}</style>
  </div>
);

interface TrustBadge {
  icon: string;
  text: string;
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  badges: TrustBadge[];
  ctaPrimary: {
    text: string;
    href: string;
  };
  ctaSecondary: {
    text: string;
    href: string;
  };
  heroImage: string;
  subtext?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  badges,
  ctaPrimary,
  ctaSecondary,
  heroImage,
  subtext,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const yText = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    },
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-neutral-900 perspective-1000">
      {/* Animated CSS Gradient Background */}
      <AnimatedGradientBackground />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            style={{ y: yText, opacity }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 md:order-1 bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl"
          >
            {/* Main Title */}
            <div className="space-y-2 mb-8">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-none tracking-tight drop-shadow-lg">
                {title || 'Fresh Farm Spices.'}
              </motion.h1>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#E67E22] leading-none tracking-tight drop-shadow-md">
                {' '}
                {/* Brand Orange */}
                Real Stories.
              </motion.h2>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-100 leading-none tracking-tight">
                No Middleman.
              </motion.h2>
            </div>

            {subtitle && (
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 mb-10 font-medium max-w-lg leading-relaxed">
                {subtitle}
              </motion.p>
            )}

            {/* Badges - Short Labels */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-x-6 gap-y-3 mb-10 text-gray-200">
              {badges && badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-brand-primary text-xl">✓</span>
                    <span className="font-semibold">{badge.text}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary text-xl">✓</span>
                    <span className="font-semibold">Cold-ground daily</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary text-xl">✓</span>
                    <span className="font-semibold">Lab-tested quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary text-xl">✓</span>
                    <span className="font-semibold">Farm-direct sourcing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary text-xl">✓</span>
                    <span className="font-semibold">FSSAI certified</span>
                  </div>
                </>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg hover:shadow-brand-primary/50 transition-all border-none"
                  onClick={() =>
                    ctaPrimary?.href ? (window.location.href = ctaPrimary.href) : undefined
                  }
                >
                  {ctaPrimary?.text || 'Shop Masalas'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-white border-white/30 hover:bg-white/10 hover:border-white"
                  onClick={() =>
                    ctaSecondary?.href ? (window.location.href = ctaSecondary.href) : undefined
                  }
                >
                  {ctaSecondary?.text || 'Explore Recipes'}
                </Button>
              </motion.div>
            </motion.div>

            {/* Subtext */}
            {subtext && (
              <motion.p variants={itemVariants} className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                {subtext}
              </motion.p>
            )}
          </motion.div>

          {/* Hero Image - Full size display */}
          <motion.div
            style={{ y: yImage }}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative order-1 md:order-2 flex items-start justify-center"
          >
            <div className="absolute inset-0 bg-brand-primary/20 rounded-[2rem] transform rotate-3 scale-95 z-0 blur-xl animate-pulse"></div>
            <img
              src={
                heroImage ||
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop'
              }
              alt="Rathi Naturals Spices Collection"
              className="relative z-10 object-contain w-full h-auto max-h-[550px] rounded-[2rem] shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
