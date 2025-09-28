
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1600/600')" }}>
      <div className="absolute inset-0 bg-brand-dark bg-opacity-40"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-start text-white">
        <h1 className="text-4xl md:text-6xl font-serif font-bold drop-shadow-lg">Authentic Indian Gourmet</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl font-sans drop-shadow-md">
          Discover a curated selection of the finest spices, nuts, and artisanal products, sourced ethically from the heart of India.
        </p>
        <button className="mt-8 bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Hero;