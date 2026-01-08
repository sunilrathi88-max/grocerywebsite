import React from 'react';
import { SubscriptionPlan } from '../types';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan, onSubscribe }) => {
  return (
    <div
      className={`relative bg-white rounded-2xl p-8 border-2 transition-transform duration-300 hover:-translate-y-2 ${
        plan.recommended
          ? 'border-brand-primary shadow-xl ring-4 ring-brand-primary/10'
          : 'border-transparent shadow-lg hover:shadow-xl'
      }`}
    >
      {plan.recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
          MOST POPULAR
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-serif font-bold text-brand-dark">₹{plan.price}</span>
          <span className="text-gray-500 text-sm">/ {plan.interval}</span>
        </div>
        <p className="text-green-600 font-bold text-sm mt-3 bg-green-50 inline-block px-3 py-1 rounded-full">
          Save {plan.savings}
        </p>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
            <CheckBadgeIcon className="w-5 h-5 text-brand-primary flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan.id)}
        className={`w-full py-3.5 rounded-xl font-bold transition-all ${
          plan.recommended
            ? 'bg-brand-primary text-white hover:bg-brand-dark shadow-md hover:shadow-lg'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Subscribe Now
      </button>
    </div>
  );
};

export default SubscriptionCard;
