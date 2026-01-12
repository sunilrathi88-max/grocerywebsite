import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from './icons/SparklesIcon';
import { GiftIcon } from './icons/GiftIcon';

interface LoyaltyWidgetProps {
  className?: string;
}

const LoyaltyWidget: React.FC<LoyaltyWidgetProps> = ({ className = '' }) => {
  const tiers = [
    { name: 'Bronze', color: 'from-amber-600 to-amber-400', points: '0' },
    { name: 'Silver', color: 'from-gray-400 to-gray-300', points: '2,000' },
    { name: 'Gold', color: 'from-yellow-500 to-yellow-300', points: '5,000' },
    { name: 'Platinum', color: 'from-purple-600 to-purple-400', points: '10,000' },
  ];

  const benefits = [
    { icon: '🎁', text: '100 Welcome Points' },
    { icon: '💰', text: '1 Point = ₹1 Spent' },
    { icon: '🚚', text: 'Free Shipping at Gold' },
    { icon: '⭐', text: 'Exclusive Member Deals' },
  ];

  return (
    <section
      className={`bg-gradient-to-br from-amber-50 via-white to-orange-50 py-16 ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-amber-600 font-bold tracking-wider uppercase text-sm mb-3">
            <SparklesIcon className="w-5 h-5" />
            Rewards Program
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-3">
            Earn Points. Unlock Rewards.
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join Tattva Rewards and get exclusive benefits with every purchase.
          </p>
        </div>

        {/* Tier Preview */}
        <div className="flex justify-center gap-3 md:gap-6 mb-10 overflow-x-auto py-2">
          {tiers.map((tier, index) => (
            <div key={tier.name} className="flex flex-col items-center min-w-[80px]">
              <div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg mb-2`}
              >
                <span className="text-white font-bold text-lg md:text-xl">{index + 1}</span>
              </div>
              <p className="font-bold text-neutral-800 text-sm">{tier.name}</p>
              <p className="text-xs text-neutral-500">{tier.points}+ pts</p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
          {benefits.map((benefit) => (
            <div
              key={benefit.text}
              className="bg-white rounded-xl p-4 text-center shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">{benefit.icon}</span>
              <p className="text-sm font-medium text-neutral-700">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <GiftIcon className="w-5 h-5" />
            Join Now - Get 100 Points Free
          </Link>
          <p className="text-sm text-neutral-500 mt-3">
            Already a member?{' '}
            <Link to="/profile" className="text-amber-600 font-medium hover:underline">
              Check your points →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoyaltyWidget;
