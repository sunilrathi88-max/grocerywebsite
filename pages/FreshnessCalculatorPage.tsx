import React from 'react';
import SEO from '../components/SEO';
import SpiceFreshnessCalculator from '../components/tools/SpiceFreshnessCalculator';
import { generateBreadcrumbSchema } from '../utils/seo';

const FreshnessCalculatorPage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Spice Freshness Calculator',
    url: 'https://rathinaturals.com/tools/spice-freshness-calculator',
    description:
      'Check if your spices are still fresh or expired. Calculate potency based on storage, age, and sensory checks.',
    applicationCategory: 'Utility',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  };

  const breadCrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://rathinaturals.com' },
    { name: 'Tools', url: 'https://rathinaturals.com/tools' }, // Virtual parent
    {
      name: 'Freshness Calculator',
      url: 'https://rathinaturals.com/tools/spice-freshness-calculator',
    },
  ]);

  return (
    <>
      <SEO
        title="Spice Freshness Calculator | Check Spice Expiry & Potency | Tattva Co."
        description="Is your garam masala past its prime? Use our free interactive tool to check spice freshness, calculate shelf life, and get storage tips. Don't cook with dust!"
        structuredData={[structuredData, breadCrumbSchema]}
      />

      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <span className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-2 block">
              Free Utility Tool
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Stop Cooking with <span className="text-brand-primary italic">Dead Spices</span>.
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Spices don&apos;t technically &quot;expire&quot; like milk, but they lose their
              essential oils—the soul of your food. Use this calculator to detect if your pantry
              staples are adding flavor or just colored dust.
            </p>
          </div>

          {/* Tool Component */}
          <SpiceFreshnessCalculator />

          {/* SEO Content Section (Below the fold) */}
          <div className="prose prose-lg mx-auto mt-16 text-gray-600">
            <h2 className="text-2xl font-bold text-gray-900">Why Spice Freshness Matters</h2>
            <p>
              Many home cooks don&apos;t realize that ground spices (like turmeric, coriander, and
              chili powder) lose about 50% of their potency within 6 months of grinding. Volatile
              oils evaporate when exposed to air, light, and heat.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6">The 3 Enemies of Flavor</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Heat:</strong> Storing spices above your stove is the #1 mistake. It cooks
                the oils out.
              </li>
              <li>
                <strong>Light:</strong> UV rays bleach the color and break down flavor compounds.
              </li>
              <li>
                <strong>Moisture:</strong> Causes clumping and can lead to mold growth (a health
                hazard).
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-6">
              How Tattva Co. Ensures Freshness
            </h3>
            <p>
              We solve this by cold-grinding our spices to preserve oils, testing them for purity in
              NABL labs, and packing them in UV-blocking packaging.{' '}
              <a href="/shop" className="text-brand-primary font-bold hover:underline">
                Explore our fresh range here.
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreshnessCalculatorPage;
