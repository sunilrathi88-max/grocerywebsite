import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJAJQpaMFNB6WLQB77bKXgSpPTZYfz66Wyca45BdecV6IvQW8IqUWnyuTlBpy9CdH1TcE2EXBR7LwAH1uPDNoj5ScAJrtDjDEwnrF5i6puZMCu0C6e7kfqOAbsFRrt2dyQPYIBmPwnARV63RCloDT2AQmg1M6nEKkcxcRRS1eWBhvDLLxtreTYJ_C9KAI1hbZK0NgQ9Zw5bBHPpOo_oKdYpjbMzM2gQa5EDNxjCrbNYFeNf7DqIWtJV0V1IZUGoBCBjAXOnG_nSA")',
            filter: 'brightness(0.9) saturate(0.9)',
          }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 flex flex-col items-center gap-6">
        <span className="text-white/90 font-sans font-bold tracking-[0.3em] text-xs uppercase border border-white/30 px-4 py-2 bg-black/10 backdrop-blur-sm">
          Est. 1984
        </span>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white drop-shadow-sm leading-tight">
          Pure Origin
          <br />
          <span className="italic font-normal">Untouched.</span>
        </h2>
        <p className="text-lg text-white/90 max-w-lg leading-relaxed font-light font-sans mt-2 tracking-wide">
          Single-origin spices sourced directly from heritage farms. Experience the difference of
          purity.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/shop')}
            className="bg-white text-accent-charcoal hover:bg-accent-cream px-10 py-3.5 font-sans font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shop Pure
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
