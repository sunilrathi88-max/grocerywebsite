import React from 'react';
import { Link } from 'react-router-dom';

const FarmerSpotlight: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden relative shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1595257841889-addca67dd711?auto=format&fit=crop&q=80&w=800"
                alt="Rajesh Kumar, Turmeric Farmer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-8 w-full">
                <p className="text-white font-serif text-2xl font-bold">Rajesh Kumar</p>
                <p className="text-white/80">Turmeric Farmer, Telangana • Partner since 2018</p>
              </div>
            </div>
            {/* Decorative Badge */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#2D8B4F] rounded-full flex items-center justify-center p-4 shadow-lg animate-spin-slow-static">
              <div className="text-center text-white text-xs font-bold uppercase tracking-wide leading-tight">
                Fair
                <br />
                Trade
                <br />
                Certified
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2 lg:pl-10">
            <span className="text-[#c2410c] font-bold tracking-widest uppercase text-sm mb-2 block">
              Meet Our Farmers
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1c1917] mb-8 leading-tight">
              "Healthy soil makes healthy food. We use no chemicals, only nature."
            </h2>
            <div className="prose prose-lg text-gray-600 mb-8">
              <p>
                Rajesh has been farming turmeric for 26 years. Unlike commercial farms that
                prioritize yield, Rajesh focuses on <strong>curcumin content</strong> and aroma.
              </p>
              <p>
                By partnering directly with Tattva Co., Rajesh earns{' '}
                <strong>30% above market rate</strong>, which has allowed him to transition 15 acres
                of land to fully organic practices.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#1c1917]">24h</span>
                <span className="text-sm text-gray-500 uppercase tracking-wide">
                  Harvest to Pack
                </span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#1c1917]">0%</span>
                <span className="text-sm text-gray-500 uppercase tracking-wide">Pesticides</span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-[#1c1917]">100%</span>
                <span className="text-sm text-gray-500 uppercase tracking-wide">Traceable</span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                to="/farmers"
                className="inline-flex items-center text-[#1c1917] font-bold border-b-2 border-[#c2410c] pb-1 hover:text-[#c2410c] transition-colors"
              >
                Read Rajesh's Full Story
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmerSpotlight;
