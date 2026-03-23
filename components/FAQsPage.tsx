import React, { useState, useMemo } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { Search } from 'lucide-react';
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
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left py-6 px-4 hover:bg-[#FAF6F2] rounded-2xl transition-all group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-lg font-bold transition-colors ${isOpen ? 'text-[#B38B59]' : 'text-[#42210B] group-hover:text-[#B38B59]'}`}
        >
          {faq.question}
        </span>
        <div
          className={`p-2 rounded-full bg-stone-50 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#B38B59] text-white' : 'text-stone-400'}`}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </button>
      {isOpen && (
        <div className="pb-8 px-4 text-stone-500 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="leading-relaxed font-medium">{faq.answer}</p>
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

  return (
    <div className="min-h-screen bg-[#FAF6F2] py-20">
      <SEO
        title="Frequently Asked Questions | Rathi Naturals"
        description="Find answers to common questions about our cold-ground spices, shipping, and more."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-[#B38B59]/10 border border-[#B38B59]/20 rounded-full text-[10px] font-bold text-[#B38B59] uppercase tracking-widest mb-6">
            Help Center
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-[#42210B] mb-6">
            Everything You Need to <span className="text-[#B38B59] italic">Know</span>
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Can't find what you're looking for? Reach out to our support team directly through the
            contact page.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-12 relative group">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-8 py-5 rounded-2xl bg-white border border-stone-100 shadow-sm focus:ring-2 focus:ring-[#B38B59] outline-none text-lg transition-all"
            />
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#B38B59]">
              <Search size={24} />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-[#42210B] text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-[#B38B59]/10 hover:text-[#42210B] border border-stone-100'}`}
          >
            All Questions
          </button>
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === category ? 'bg-[#42210B] text-white shadow-lg' : 'bg-white text-stone-500 hover:bg-[#B38B59]/10 hover:text-[#42210B] border border-stone-100'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8 md:p-12">
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
