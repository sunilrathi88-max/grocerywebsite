import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const ShippingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Shipping Policy | THE RATHI SPICE CO"
        description="Shipping Policy for THE RATHI SPICE CO. Information on delivery times, costs, and international shipping."
      />

      <div className="max-w-3xl mx-auto prose prose-amber">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-8">
          Shipping Policy
        </h1>

        <p className="text-gray-600 mb-8 italic">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">
            Domestic Shipping (India)
          </h2>
          <p className="mb-4">
            We are pleased to offer shipping across India. We partner with reliable courier services
            to ensure your spices reach you fresh and secure.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Processing Time:</strong> Orders are processed within 1-2 business days.
            </li>
            <li>
              <strong>Delivery Time:</strong> Standard delivery takes 3-7 business days depending on
              your location.
            </li>
            <li>
              <strong>Shipping Costs:</strong> Free shipping on orders above ₹999. A flat rate of
              ₹50 applies for orders below ₹999.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">
            International Shipping
          </h2>
          <p className="mb-4">
            We do ship internationally to select countries! Please contact us at{' '}
            <a href="mailto:support@rathi.com" className="text-brand-primary hover:underline">
              support@rathi.com
            </a>{' '}
            for international shipping rates and timelines specific to your location.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">
            Tracking Your Order
          </h2>
          <p className="mb-4">
            Once your order is shipped, you will receive a confirmation email and SMS with a
            tracking number. You can use this number to track your package on our{' '}
            <Link to="/tracking" className="text-brand-primary hover:underline">
              Order Tracking
            </Link>{' '}
            page.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">
            Damaged or Lost Packages
          </h2>
          <p className="mb-4">
            If your package arrives damaged or is lost in transit, please contact our support team
            immediately. We will work with the courier to resolve the issue and ensure you receive
            your order or a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">
            Returns & Exchanges
          </h2>
          <p className="mb-4">
            Please refer to our{' '}
            <Link to="/refund-policy" className="text-brand-primary hover:underline">
              Refund Policy
            </Link>{' '}
            for information on returns and exchanges.
          </p>
        </section>
      </div>

      <style>{`
        .prose h1, .prose h2, .prose h3 { font-family: 'Playfair Display', serif; }
        .prose p, .prose li { font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

export default ShippingPage;
