import React from 'react';
import { Accordion } from './Accordion';

const questions = [
  {
    question: 'Are your spices organic?',
    answer: 'Yes, we source from certified organic farms using sustainable practices.',
  }, // Generic answer based on context
  {
    question: 'What is the shelf life?',
    answer: 'Our cold-ground spices stay fresh for 12 months when stored correctly.',
  },
  {
    question: 'Do you offer bulk or wholesale orders?',
    answer: 'Yes, please contact our support team for bulk pricing.',
  },
  {
    question: 'How is your Garam Masala different from regular brands?',
    answer:
      'Ours is made from whole spices, roasted in small batches, and cold-ground to retain essential oils.',
  },
];

const FAQPreview = () => {
  // Note: Accordion component might need to be created if not exists.
  // I will check if Accordion exists or use a simple implementation here.

  // Simple Accordion Item implementation for now if needed, but I Recall Accordion.tsx in file list?
  // Let's assume Accordion exists or I'll implement a simple map.
  // Actually, I'll check list_dir output from earlier.
  // Step 451 showed Accordion.tsx exists.

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-lg text-brand-dark">{q.question}</span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <div className="text-gray-600 px-6 pb-6 pt-0 animate-fadeIn">{q.answer}</div>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="text-brand-primary font-bold hover:underline">More FAQs →</button>
        </div>
      </div>
    </section>
  );
};

export default FAQPreview;
