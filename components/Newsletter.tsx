import React from 'react';
import { Button } from './Button';

const Newsletter = () => {
  return (
    <section className="py-20 bg-brand-dark text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/10 rounded-l-[10rem] transform translate-x-1/3" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
          Get Fresh Recipes & Exclusive Offers
        </h2>
        <p className="text-xl text-brand-light/90 max-w-2xl mx-auto mb-10">
          Join the list for weekly recipes, cooking tips, and early access to new batches and
          offers.
        </p>

        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email address..."
            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white/20 transition-all font-medium"
            required
          />
          <Button variant="primary" size="lg" className="px-8 py-4 rounded-full">
            Subscribe
          </Button>
        </form>

        <p className="mt-6 text-sm text-brand-light/70 font-medium">
          Get 10% off your first order with code:{' '}
          <span className="text-brand-primary font-bold">FRESH10</span>
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
