import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const FAQ_DATA = [
  {
    question: 'What makes your spices different?',
    answer:
      'Our spices are sourced directly from the best farms and regions in India, known for their specific aromatic and flavor profiles. We prioritize single-origin, high-grade products and often grind them in small batches to ensure maximum freshness.',
  },
  {
    question: 'What is your shipping policy?',
    answer:
      'We offer free standard shipping on all orders over $50 within the country. Orders are typically processed within 1-2 business days and delivered within 3-5 business days. You can find more details on our Shipping Policy page.',
  },
  {
    question: 'How should I store my spices?',
    answer:
      'To maintain their potency and flavor, spices should be stored in airtight containers in a cool, dark, and dry place. Avoid storing them near sources of heat, like your stove, or in the refrigerator where condensation can occur.',
  },
  {
    question: 'Do you offer returns or refunds?',
    answer:
      'Yes, we have a 30-day return policy for unopened and unused products. Please visit our Refund Policy page for detailed information on how to initiate a return.',
  },
  {
    question: 'Are your products organic?',
    answer:
      "We offer a wide range of products, and many are certified organic. Look for the 'Organic' tag on the product page. We are committed to expanding our organic selection continuously.",
  },
];

const FAQItem: React.FC<{ faq: (typeof FAQ_DATA)[0]; isOpen: boolean; onToggle: () => void }> = ({
  faq,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left py-4 px-2"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-brand-dark">{faq.question}</span>
        <ChevronDownIcon
          className={`h-6 w-6 text-brand-primary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-600">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
