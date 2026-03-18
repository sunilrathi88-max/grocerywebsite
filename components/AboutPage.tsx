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
              Rooted in a <strong className="text-brand-dark">60-year Rajasthani heritage</strong>, Rathi Naturals was born from a generational commitment to authentic Indian flavours. Long before the era of mass-produced, hot-ground spices, our family traded the finest yields directly from India&apos;s most renowned agricultural hubs.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Today, we bypass the middlemen to work directly with farmers in the heartland. From the bustling coriander markets of <strong className="text-brand-dark">Ramganj Mandi</strong> to the turmeric fields of <strong className="text-brand-dark">Salem</strong> and the red chilli farms of <strong className="text-brand-dark">Mathania</strong>, every product we offer is a testament to unwavering quality, precision cold-ground processing, and transparent, ethical sourcing.
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
              <h3 className="font-bold text-xl mb-2 text-brand-dark">Cold-Grinding Moat</h3>
              <p className="text-gray-600 text-sm">
                Unlike mass-market brands reliant on high-speed hot-grinding, we uphold our heritage by slowly grinding spices at low temperatures. This scientifically defensible process prevents the loss of volatile essential oils, locking in maximum aroma, potency, and vibrant color.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🧪
              </div>
              <h3 className="font-bold text-xl mb-2 text-brand-dark">Lab Tested</h3>
              <p className="text-gray-600 text-sm">
                Every batch undergoes rigorous testing for pesticides, heavy metals, and
                adulteration. Only the purest spices make it to your kitchen with FSSAI-certified transparency.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🌿
              </div>
              <h3 className="font-bold text-xl mb-2 text-brand-dark">Authentic Origins</h3>
              <p className="text-gray-600 text-sm">
                We source exclusively from historically significant regions: <strong className="text-brand-dark">Ramganj Mandi</strong> for Coriander, <strong className="text-brand-dark">Mathania</strong> for Red Chilli, and <strong className="text-brand-dark">Salem</strong> for Turmeric. We never compromise on geographic authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
