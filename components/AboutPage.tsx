import React from 'react';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { SEO } from './SEO';
import { pageSEO } from '../utils/seo';
import { OptimizedImage } from './OptimizedImage';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <SEO {...pageSEO.about()} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 animate-fadeIn">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              THE RATHI SPICE CO was born from a passion for authentic Indian flavors and a desire
              to share them with the world. We travel to the heart of India, from the saffron fields
              of Kashmir to the pepper vines of the Malabar Coast, to source the finest, most
              aromatic spices and gourmet products.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our philosophy is simple: quality, authenticity, and sustainability. We work directly
              with farmers and artisans who share our commitment to traditional methods and ethical
              practices. Every product we offer tells a story of its origin, its people, and the
              rich culinary heritage of India.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/10 rounded-lg transform translate-x-4 translate-y-4"></div>
            <OptimizedImage
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="A vibrant Indian spice market"
              className="relative rounded-lg shadow-xl"
              type="hero"
              onError={imageErrorHandlers.hero}
            />
          </div>
        </div>

        {/* The Tattva Difference - Lab & Process */}
        <div className="bg-stone-50 rounded-2xl p-8 md:p-12 mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">
              The Tattva Difference
            </h2>
            <p className="text-gray-600">
              We believe in transparency and purity. Here&apos;s how we ensure you get nothing but
              the best.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                ❄️
              </div>
              <h3 className="font-bold text-xl mb-2 text-brand-dark">Cold Ground</h3>
              <p className="text-gray-600 text-sm">
                We grind our spices at low temperatures to prevent the loss of volatile essential
                oils, ensuring maximum aroma and flavor in every pinch.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🧪
              </div>
              <h3 className="font-bold text-xl mb-2 text-brand-dark">Lab Tested</h3>
              <p className="text-gray-600 text-sm">
                Every batch undergoes rigorous testing for pesticides, heavy metals, and
                adulteration. Only the purest spices make it to your kitchen.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🌿
              </div>
              <h3 className="font-bold text-xl mb-2 text-brand-dark">Single Origin</h3>
              <p className="text-gray-600 text-sm">
                We source from specific regions known for their superior produce—Lakadong for
                Turmeric, Guntur for Chilli, and Idukki for Cardamom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
