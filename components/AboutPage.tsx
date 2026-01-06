import React from 'react';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { SEO } from './SEO';
import { pageSEO } from '../utils/seo';

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
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="A vibrant Indian spice market"
              className="relative rounded-lg shadow-xl"
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

        {/* Meet Our Farmers */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-10 text-center">
            Meet Our Partners
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="overflow-hidden rounded-xl mb-4 h-64">
                <img
                  src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=800&auto=format&fit=crop"
                  alt="Farmer"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-brand-dark">Ramesh & Family</h3>
              <p className="text-brand-primary font-bold text-sm mb-2">Guntur, Andhra Pradesh</p>
              <p className="text-gray-600 text-sm line-clamp-3">
                Third-generation chilli farmers who practice traditional sun-drying methods. Their
                Guntur red chillies are famous for their fiery heat and vibrant color.
              </p>
            </div>
            <div className="group">
              <div className="overflow-hidden rounded-xl mb-4 h-64">
                <img
                  src="https://images.unsplash.com/photo-1627885376595-827cb347895e?q=80&w=800&auto=format&fit=crop"
                  alt="Farmer"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-brand-dark">The Singh Sisters</h3>
              <p className="text-brand-primary font-bold text-sm mb-2">Pahalgam, Kashmir</p>
              <p className="text-gray-600 text-sm line-clamp-3">
                Pioneering sustainable saffron cultivation in the valley. They hand-pick each stigma
                before sunrise to preserve the potency of the world&apos;s most expensive spice.
              </p>
            </div>
            <div className="group">
              <div className="overflow-hidden rounded-xl mb-4 h-64">
                <img
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800&auto=format&fit=crop"
                  alt="Farmer"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-brand-dark">Thomas Varghese</h3>
              <p className="text-brand-primary font-bold text-sm mb-2">Idukki, Kerala</p>
              <p className="text-gray-600 text-sm line-clamp-3">
                Expert in shade-grown cardamom and peppercorns. His farm is a biodiversity haven,
                intercropped with coffee and fruit trees to enrich the soil naturally.
              </p>
            </div>
          </div>
        </div>

        {/* Lab Reports & QR Transparency */}
        <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-2xl p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-primary font-bold text-sm uppercase tracking-wider">
                Full Transparency
              </span>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mt-2 mb-4">
                Scan. Verify. Trust.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Every Tattvaco product comes with a QR code that reveals its complete journey — from
                farm to your kitchen. No black boxes, no hidden processes.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Lab Test Results</h4>
                    <p className="text-sm text-gray-600">
                      Aflatoxin, pesticide residue, heavy metals — every batch tested
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">📍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Farm Origin</h4>
                    <p className="text-sm text-gray-600">
                      Know exactly which farm and region your spices came from
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">📅</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Harvest & Pack Date</h4>
                    <p className="text-sm text-gray-600">
                      See when your spices were harvested and packed — freshness guaranteed
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-8 px-6 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-dark transition-colors">
                View Sample Lab Report →
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="text-center mb-4">
                  <div className="w-32 h-32 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <svg
                      className="w-20 h-20 text-brand-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13 0h-2v2h2v2h-2v2h2v-2h2v2h2v-2h-2v-2h2v-2h-2v2h-2v-2zm0-2v-2h2v2h-2zm-4 0h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Sample QR Code</p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Product:</span>
                    <span className="font-bold text-brand-dark">Kashmiri Saffron (1g)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Batch No:</span>
                    <span className="font-mono text-gray-700">SAF-2024-0847</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Origin:</span>
                    <span className="text-gray-700">Pampore, Kashmir</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harvest Date:</span>
                    <span className="text-gray-700">October 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lab Test:</span>
                    <span className="text-green-600 font-bold">✓ Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-gray-200 pt-16 text-center">
          <p className="text-gray-500 font-bold tracking-wider uppercase mb-8">
            Certified for Purity & Safety
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Mock Certification Logos using text/icons for now if no images available */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">
                FSSAI
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">
                ISO
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">
                GMP
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center font-bold text-xl text-gray-600">
                HACCP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
