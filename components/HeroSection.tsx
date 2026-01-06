import React from 'react';
import { Button } from './Button';
import { OptimizedImage } from './OptimizedImage';

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
    <section className="bg-gradient-hero py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Text Content */}
          <div className="animate-fadeIn order-2 md:order-1">
            {/* Main Title */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-accent-brown leading-none tracking-tight">
                {title || 'Fresh Farm Spices.'}
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-brand-primary leading-none tracking-tight">
                Real Stories.
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-accent-brown leading-none tracking-tight">
                No Middleman.
              </h2>
            </div>

            {subtitle && (
              <p className="text-lg md:text-xl text-neutral-700 mb-10 font-medium max-w-lg leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Badges - Short Labels */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10 text-neutral-700">
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
                className="w-full sm:w-auto shadow-button hover:shadow-card-hover transition-all"
                onClick={() =>
                  ctaPrimary?.href ? (window.location.href = ctaPrimary.href) : undefined
                }
              >
                {ctaPrimary?.text || 'Shop Masalas'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-neutral-300 hover:border-brand-primary"
                onClick={() =>
                  ctaSecondary?.href ? (window.location.href = ctaSecondary.href) : undefined
                }
              >
                {ctaSecondary?.text || 'Explore Recipes'}
              </Button>
            </div>

            {/* Subtext */}
            {subtext && (
              <p className="text-sm text-neutral-600 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
                {subtext}
              </p>
            )}
          </div>

          {/* Hero Image - Fixed aspect ratio to prevent CLS */}
          <div
            className="relative animate-fadeIn order-1 md:order-2"
            style={{
              animationDelay: '0.2s',
              aspectRatio: '4/5',
              minHeight: '400px',
              maxHeight: '650px',
            }}
          >
            <div className="absolute inset-0 bg-brand-primary/10 rounded-[2rem] transform rotate-3 scale-95 z-0"></div>
            <OptimizedImage
              src={
                heroImage ||
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop'
              }
              alt="Fresh Spices"
              type="hero"
              priority="high"
              width={800}
              height={1000}
              className="relative z-10 object-cover rounded-[2rem] w-full h-full shadow-2xl border-4 border-white"
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
