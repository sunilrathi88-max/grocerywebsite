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
  badge = 'Est. 1984',
  title,
  subtitle,
  description,
  ctaText = 'Shop Pure',
  ctaAction,
  imageUrl,
  imageAlt = 'Hero image',
}) => {
  return (
    <section className="relative w-full h-[70vh] min-h-[450px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover"
          width={600}
          height={800}
          priority="high"
          style={{ filter: 'brightness(0.9) saturate(0.9)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto text-center px-6 flex flex-col items-center gap-4">
        {badge && (
          <span className="text-white/90 font-sans font-bold tracking-[0.2em] text-[10px] uppercase border border-white/30 px-3 py-1.5 bg-black/10 backdrop-blur-sm">
            {badge}
          </span>
        )}
        <h2 className="text-4xl font-serif font-light text-white drop-shadow-sm leading-tight">
          {title}
          {subtitle && (
            <>
              <br />
              <span className="italic font-normal">{subtitle}</span>
            </>
          )}
        </h2>
        {description && (
          <p className="text-sm text-white/90 max-w-xs leading-relaxed font-light font-sans mt-1 tracking-wide">
            {description}
          </p>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={ctaAction}
            className="bg-white text-stone-800 hover:bg-stone-100 px-8 py-3 font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
          >
            {ctaText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MobileHero;
