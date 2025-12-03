import React from 'react';
import { SEO } from './SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Privacy Policy | THE RATHI SPICE CO"
        description="Privacy Policy for THE RATHI SPICE CO. Learn how we collect, use, and protect your data."
      />
      <div className="prose max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-8">
          Privacy Policy
        </h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p>
          THE RATHI SPICE CO (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the THE
          RATHI SPICE CO website (the &quot;Service&quot;). This page informs you of our policies
          regarding the collection, use, and disclosure of personal data when you use our Service
          and the choices you have associated with that data.
        </p>

        <h3>1. Information Collection and Use</h3>
        <p>
          We collect several different types of information for various purposes to provide and
          improve our Service to you. This may include, but is not limited to, your name, email
          address, shipping address, and payment information.
        </p>

        <h3>2. Use of Data</h3>
        <p>THE RATHI SPICE CO uses the collected data for various purposes:</p>
        <ul>
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To process your orders and manage your account</li>
          <li>To provide customer care and support</li>
          <li>To provide analysis or valuable information so that we can improve the Service</li>
        </ul>

        <h3>3. Security of Data</h3>
        <p>
          The security of your data is important to us, but remember that no method of transmission
          over the Internet, or method of electronic storage is 100% secure. While we strive to use
          commercially acceptable means to protect your Personal Data, we cannot guarantee its
          absolute security.
        </p>

        <h3>4. Changes to This Privacy Policy</h3>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
          periodically for any changes.
        </p>
      </div>
      <style>{`
        .prose h2, .prose h3 { font-family: 'Playfair Display', serif; }
        .prose p, .prose li { font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyPage;
