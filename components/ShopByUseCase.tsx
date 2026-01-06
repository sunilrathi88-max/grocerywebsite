import React from 'react';

const useCases = [
  { id: 'daily', label: 'Daily Cooking', desc: 'Essential masalas for everyday Indian meals.' },
  { id: 'tandoor', label: 'Tandoor', desc: 'For tandoori, kebabs, grills, and marinades.' },
  { id: 'south-indian', label: 'South Indian', desc: 'Dosa, sambar, rasam, and more.' },
  { id: 'street-food', label: 'Street Food', desc: 'Chaats, pani puri, bhel, and snack masalas.' },
  { id: 'chai', label: 'Chai & Infusions', desc: 'Tea masalas and warm drink blends.' },
];

const ShopByUseCase = () => {
  return (
    <section className="py-16 border-t border-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-8 text-center">
          Shop by Cuisine & Use-Case
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              className="group relative px-6 py-4 bg-white border border-neutral-200 rounded-xl hover:border-brand-primary hover:shadow-md transition-all text-left max-w-xs flex-1 min-w-[200px]"
            >
              <h4 className="font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                {useCase.label}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{useCase.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByUseCase;
