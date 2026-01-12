import React from 'react';
import SubscriptionCard from '../components/SubscriptionCard';
import { SUBSCRIPTION_PLANS } from '../utils/subscription';
import { UsersIcon } from '../components/icons/UsersIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';

import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);

  const handleSubscribe = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    addToCart({
      id: `sub-${plan.id}`,
      name: `Tattva Fresh: ${plan.name}`,
      price: plan.price,
      quantity: 1,
      weight: plan.interval, // Using weight field for interval display
      image:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80', // Generic spice box image
      stock: 999,
      isSubscription: true,
      subscriptionInterval: plan.interval,
    });
    navigate('/cart');
  };
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-dark text-white py-20 px-4 md:px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <span className="text-brand-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
            INTRODUCING TATTVA FRESH MONTHLY
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Never Run Out of Fresh Flavor.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get hand-picked, single-origin spices delivered to your door every month. Milled fresh,
            packed with aroma, and sourced directly from our farmers.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 text-left max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="bg-brand-primary/20 p-3 rounded-full h-fit">
                <SparklesIcon className="w-6 h-6 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-secondary mb-1">Peak Freshness</h3>
                <p className="text-sm text-gray-400">Ground and packed within days of shipping.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-brand-primary/20 p-3 rounded-full h-fit">
                <UsersIcon className="w-6 h-6 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-brand-secondary mb-1">Support Farmers</h3>
                <p className="text-sm text-gray-400">Fair-trade pricing for every harvest.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-neutral-50 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600">Pause or cancel anytime. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <SubscriptionCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Trust Section (Placeholder) */}
      <section className="py-20 px-4 md:px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-bold mb-2">Can I skip a month?</h4>
              <p className="text-gray-600">
                Yes! You can pause or skip your delivery from your dashboard anytime.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">What&apos;s inside the box?</h4>
              <p className="text-gray-600">
                A curated selection of seasonal spices, custom blends, and exclusive recipe cards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;
