import React from 'react';
import { Button } from './Button';

// Pure CSS animated gradient background (shader fallback)
const AnimatedGradientBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
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
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.1); }
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
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-neutral-900">
      {/* Animated CSS Gradient Background */}
      <AnimatedGradientBackground />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Text Content - Wrapped in Card for Readability */}
          <div className="animate-fadeIn order-2 md:order-1 bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl">
            {/* Main Title */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-none tracking-tight drop-shadow-lg">
                {title || 'Fresh Farm Spices.'}
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#E67E22] leading-none tracking-tight drop-shadow-md">
                {' '}
                {/* Brand Orange */}
                Real Stories.
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-100 leading-none tracking-tight">
                No Middleman.
              </h2>
            </div>

            {subtitle && (
              <p className="text-lg md:text-xl text-gray-300 mb-10 font-medium max-w-lg leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Badges - Short Labels */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10 text-gray-200">
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
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-lg hover:shadow-brand-primary/50 transition-all border-none"
                onClick={() =>
                  ctaPrimary?.href ? (window.location.href = ctaPrimary.href) : undefined
                }
              >
                {ctaPrimary?.text || 'Shop Masalas'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:border-white"
                onClick={() =>
                  ctaSecondary?.href ? (window.location.href = ctaSecondary.href) : undefined
                }
              >
                {ctaSecondary?.text || 'Explore Recipes'}
              </Button>
            </div>

            {/* Subtext */}
            {subtext && (
              <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                {subtext}
              </p>
            )}
          </div>

          {/* Hero Image - Full size display */}
          <div
            className="relative animate-fadeIn order-1 md:order-2 flex items-start justify-center"
            style={{
              animationDelay: '0.2s',
              minHeight: '300px',
            }}
          >
            <div className="absolute inset-0 bg-brand-primary/20 rounded-[2rem] transform rotate-3 scale-95 z-0 blur-xl"></div>
            <img
              src={
                heroImage ||
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop'
              }
              alt="Rathi Naturals Spices Collection"
              className="relative z-10 object-contain w-full h-auto max-h-[550px] rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
