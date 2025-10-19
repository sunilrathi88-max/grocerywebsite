

import React from 'react';

const Hero: React.FC = () => {
  return (
    <div 
      className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center text-white" 
      style={{ backgroundImage: "url('https://via.placeholder.com/1200x500/F8E3D9/333333?text=Tattva+Co.')" }}
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
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
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;