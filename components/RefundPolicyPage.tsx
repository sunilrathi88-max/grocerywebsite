import React from 'react';
import { SEO } from './SEO';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Refund Policy | THE RATHI SPICE CO"
        description="Refund and Return Policy for THE RATHI SPICE CO. Learn about our 30-day return policy and refund process."
      />
      <div className="prose max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-8">
          Refund Policy
        </h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3>1. Returns</h3>
        <p>
          We have a 30-day return policy, which means you have 30 days after receiving your item to
          request a return. To be eligible for a return, your item must be in the same condition
          that you received it, unopened or unused, and in its original packaging.
        </p>

        <h3>2. Refunds</h3>
        <p>
          We will notify you once we’ve received and inspected your return, and let you know if the
          refund was approved or not. If approved, you’ll be automatically refunded on your original
          payment method. Please remember it can take some time for your bank or credit card company
          to process and post the refund too.
        </p>

        <h3>3. Damages and Issues</h3>
        <p>
          Please inspect your order upon reception and contact us immediately if the item is
          defective, damaged or if you receive the wrong item, so that we can evaluate the issue and
          make it right.
        </p>

        <h3>4. Contact Us</h3>
        <p>
          If you have any questions about our Refund Policy, please contact us at
          sunilrathi88@gmail.com.
        </p>
      </div>
      <style>{`
        .prose h2, .prose h3 { font-family: 'Playfair Display', serif; }
        .prose p, .prose li { font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

export default RefundPolicyPage;
