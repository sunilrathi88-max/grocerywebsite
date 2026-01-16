import React from 'react';
import { LeafIcon } from './icons/LeafIcon';
import { UsersIcon } from './icons/UsersIcon';
import { GlobeIcon } from './icons/GlobeIcon';

const SustainabilitySection = () => {
  return (
    <section className="py-16 bg-brand-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-accent/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
            Your Impact With Tattva
          </h2>
          <p className="text-gray-600">
            Every purchase supports verified sustainable farming and preserves biodiversity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/10 hover:shadow-md transition-shadow text-center group">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <GlobeIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-4xl font-bold text-brand-dark mb-2">1,200+</h3>
            <p className="font-bold text-gray-800 mb-2">Kg of Plastic Saved</p>
            <p className="text-sm text-gray-500">
              Through our eco-friendly, biodegradable packaging initiatives.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/10 hover:shadow-md transition-shadow text-center group">
            <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-4xl font-bold text-brand-dark mb-2">450+</h3>
            <p className="font-bold text-gray-800 mb-2">Farmers Supported</p>
            <p className="text-sm text-gray-500">
              Direct trade relationships ensuring fair wages and community growth.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-brand-primary/10 hover:shadow-md transition-shadow text-center group">
            <div className="w-16 h-16 mx-auto bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <LeafIcon className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-4xl font-bold text-brand-dark mb-2">850</h3>
            <p className="font-bold text-gray-800 mb-2">Hectares Chemical-Free</p>
            <p className="text-sm text-gray-500">
              Of farmland converted to 100% natural, pesticide-free practices.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button className="text-brand-primary font-bold hover:text-brand-dark hover:underline transition-colors flex items-center justify-center gap-2 mx-auto">
            <span>Learn more about our sustainability mission</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
