import React from 'react';
import { OptimizedImage } from '../OptimizedImage';

interface MobileHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaAction?: () => void;
  imageUrl: string;
  imageAlt?: string;
}

const MobileHero: React.FC<MobileHeroProps> = ({
  badge = 'New Harvest',
  title,
  subtitle,
  description,
  ctaText = 'Shop Now',
  ctaAction,
  imageUrl,
  imageAlt = 'Hero image',
}) => {
  return (
    <section className="relative px-4 py-6">
      <div className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="relative h-64 w-full">
          <OptimizedImage
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            width={400}
            height={256}
            priority="high"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            {badge && (
              <span className="inline-block px-2 py-1 bg-amber-600/90 text-white text-xs font-bold rounded mb-2 tracking-wide uppercase">
                {badge}
              </span>
            )}
            <h2 className="font-serif text-3xl font-bold text-white mb-2 leading-tight">
              {title}
              {subtitle && (
                <>
                  <br />
                  {subtitle}
                </>
              )}
            </h2>
            {description && <p className="text-white/90 text-sm mb-4 font-light">{description}</p>}
            <button
              onClick={ctaAction}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-amber-600/30 active:scale-95 transition-transform flex items-center gap-2"
            >
              {ctaText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
