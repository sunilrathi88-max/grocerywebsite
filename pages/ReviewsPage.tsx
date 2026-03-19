import React from 'react';
import Testimonials from '../components/Testimonials';
import { MOCK_TESTIMONIALS } from '../data/testimonials';
import SEO from '../components/SEO';
import { pageSEO } from '../utils/seo';

const ReviewsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-24">
      {/* Basic SEO until a specific page wrapper is built */}
      <SEO
        title="Customer Reviews | Rathi Naturals"
        description="Read real customer reviews and testimonials about Rathi Naturals cold-ground spices and premium nuts."
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            TRUST & TRANSPARENCY
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            What Our Customers Say
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Real stories from our community regarding our cold-ground spices and direct-trade
            sourcing. Discover why households across India trust our 60-year heritage.
          </p>
        </div>

        {/* We reuse the beautiful Testimonials carousel component */}
        <Testimonials testimonials={MOCK_TESTIMONIALS} />

        {/* Trust Signals Footer Block */}
        <div className="mt-20 max-w-4xl mx-auto bg-stone-50 rounded-2xl p-8 text-center border border-neutral-100">
          <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">
            Our Quality Promise
          </h3>
          <p className="text-neutral-600 mb-6">
            Every product is backed by our 100% satisfaction guarantee. FSSAI Certified:
            12225025000253
          </p>
          <a
            href="/shop"
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors"
          >
            Shop the Collection
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
