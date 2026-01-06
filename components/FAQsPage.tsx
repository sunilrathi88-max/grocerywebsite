import React, { useState, useMemo } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { SEO } from './SEO';
import { generateFAQSchema } from '../utils/seo';

const FAQ_CATEGORIES = ['Product Quality', 'Sourcing', 'Shipping', 'Returns', 'Wholesale'];

const FAQ_DATA = [
  {
    category: 'Product Quality',
    question: 'What makes your spices different?',
    answer:
      'Our spices are sourced directly from the best farms and regions in India, known for their specific aromatic and flavor profiles. We prioritize single-origin, high-grade products and often grind them in small batches to ensure maximum freshness.',
  },
  {
    category: 'Product Quality',
    question: 'Are your products organic?',
    answer:
      "We offer a wide range of products, and many are certified organic. Look for the 'Organic' tag on the product page. We are committed to expanding our organic selection continuously.",
  },
  {
    category: 'Product Quality',
    question: 'How should I store my spices?',
    answer:
      'To maintain their potency and flavor, spices should be stored in airtight containers in a cool, dark, and dry place. Avoid storing them near sources of heat, like your stove, or in the refrigerator where condensation can occur.',
  },
  {
    category: 'Sourcing',
    question: 'Where do you source your spices from?',
    answer:
      'We source directly from partner farmers in Kerala (Cardamom, Pepper), Guntur (Chilli), and Kashmir (Saffron). We believe in single-origin sourcing to maintain authentic flavor profiles.',
  },
  {
    category: 'Shipping',
    question: 'What is your shipping policy?',
    answer:
      'We offer free standard shipping on all orders over ₹500 within the country. Orders are typically processed within 1-2 business days and delivered within 3-5 business days.',
  },
  {
    category: 'Returns',
    question: 'Do you offer returns or refunds?',
    answer:
      'Yes, we have a 30-day return policy for unopened and unused products. Please visit our Refund Policy page for detailed information on how to initiate a return.',
  },
];

const FAQItem: React.FC<{ faq: (typeof FAQ_DATA)[0]; isOpen: boolean; onToggle: () => void }> = ({
  faq,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-brand-dark">{faq.question}</span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600 animate-fadeIn">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const faqSchema = React.useMemo(() => generateFAQSchema(filteredFAQs), [filteredFAQs]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO
        title="Frequently Asked Questions | Tattva Co."
        description="Find answers to common questions about our products, shipping, returns, and more."
        structuredData={faqSchema}
        structuredDataId="faq-schema"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
            How can we help?
          </h1>
          <p className="text-gray-600 mb-8">Search our help center or browse by category.</p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none text-lg"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2 rounded-full font-medium transition-colors ${activeCategory === 'All' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            All
          </button>
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-colors ${activeCategory === category ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-2">
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No results found for &ldquo;{searchQuery}&rdquo;. Try a different keyword.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
