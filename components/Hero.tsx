

import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const heroImageUrl = 'https://via.placeholder.com/1200x600/F8E3D9/333333?text=Tattva+Co.';
  const fallbackImageUrl = 'https://via.placeholder.com/1200x600/F8E3D9/333333?text=Tattva+Co.';
  const gradientFallback = 'linear-gradient(135deg, #8B5A3C 0%, #D2B48C 50%, #F4A460 100%)';

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBackgroundLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      // Try fallback image
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setBackgroundLoaded(true);
        setImageError(false);
      };
      fallbackImg.onerror = () => {
        setBackgroundLoaded(true);
        setImageError(true);
      };
      fallbackImg.src = fallbackImageUrl;
    };
    img.src = heroImageUrl;
  }, []);

  const getBackgroundImage = () => {
    if (!backgroundLoaded) {
      return gradientFallback;
    }
    if (imageError) {
      return `url('${fallbackImageUrl}')`;
    }
    return `url('${heroImageUrl}')`;
  };

  return (
    <div 
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center text-white transition-all duration-1000 ease-in-out" 
      style={{ 
        backgroundImage: getBackgroundImage(),
        backgroundBlendMode: imageError ? 'normal' : 'overlay'
      }}
      aria-labelledby="hero-heading"
    >
      {!backgroundLoaded && (
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10 animate-fade-in-up">
        <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold drop-shadow-2xl leading-tight">
          The Essence of India, Delivered.
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto font-sans drop-shadow-lg text-white/90">
          Experience the rich tapestry of authentic flavors, from pristine Himalayan valleys to the lush Malabar coast, curated just for you.
        </p>
        <button 
          onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 bg-brand-primary text-white font-bold text-lg py-3 px-10 rounded-full shadow-xl hover:bg-opacity-80 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-primary/50"
        >
          Explore Collection
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;