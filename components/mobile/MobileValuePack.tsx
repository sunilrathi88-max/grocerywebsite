import React from 'react';
import { OptimizedImage } from '../OptimizedImage';

interface MobileValuePackProps {
  badge?: string;
  title: string;
  description: string;
  linkText?: string;
  onLinkClick?: () => void;
  imageUrl: string;
}

const MobileValuePack: React.FC<MobileValuePackProps> = ({
  badge = 'Value Pack',
  title,
  description,
  linkText = 'View Bundle',
  onLinkClick,
  imageUrl,
}) => {
  return (
    <section className="px-4 mb-8">
      <div className="bg-stone-900 dark:bg-stone-800 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden">
        {/* Content */}
        <div className="relative z-10 w-2/3 pr-2">
          <span className="text-amber-400 text-xs font-bold tracking-wider uppercase mb-1 block">
            {badge}
          </span>
          <h3 className="font-serif text-xl text-white font-bold mb-2">{title}</h3>
          <p className="text-stone-300 text-xs mb-4">{description}</p>
          <button
            onClick={onLinkClick}
            className="text-white text-sm font-medium underline decoration-amber-600 decoration-2 underline-offset-4 hover:decoration-amber-400 transition"
          >
            {linkText}
          </button>
        </div>

        {/* Glow Effect */}
        <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-32 h-32 rounded-full bg-amber-600/20 blur-xl" />

        {/* Image */}
        <div className="relative z-10 w-1/3">
          <OptimizedImage
            src={imageUrl}
            alt={title}
            className="rounded-lg rotate-6 shadow-xl border-2 border-white/10"
            width={120}
            height={120}
          />
        </div>
      </div>
    </section>
  );
};

export default MobileValuePack;
