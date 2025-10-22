import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-8">
          Terms of Service
        </h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h3>1. Agreement to Terms</h3>
        <p>
          By accessing or using our Service, you agree to be bound by these Terms. If you disagree
          with any part of the terms then you may not access the Service.
        </p>

        <h3>2. Purchases</h3>
        <p>
          If you wish to purchase any product or service made available through the Service
          ("Purchase"), you may be asked to supply certain information relevant to your Purchase
          including, without limitation, your credit card number, the expiration date of your credit
          card, your billing address, and your shipping information.
        </p>

        <h3>3. Content</h3>
        <p>
          Our Service allows you to post, link, store, share and otherwise make available certain
          information, text, graphics, videos, or other material ("Content"). You are responsible
          for the Content that you post to the Service, including its legality, reliability, and
          appropriateness.
        </p>

        <h3>4. Governing Law</h3>
        <p>
          These Terms shall be governed and construed in accordance with the laws of India, without
          regard to its conflict of law provisions.
        </p>
      </div>
      <style>{`
        .prose h2, .prose h3 { font-family: 'Playfair Display', serif; }
        .prose p, .prose li { font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

export default TermsOfServicePage;
