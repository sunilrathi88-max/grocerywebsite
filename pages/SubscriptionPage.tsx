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
      productId: 9999, // Subscription Product ID
      variantId: 9999, // Subscription Variant ID
      name: `Rathi Naturals Fresh: ${plan.name}`,
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
    <div className="bg-[#FAF6F2] min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#42210B] text-white py-32 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')] opacity-10 pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="inline-block px-4 py-1.5 bg-[#B38B59]/20 border border-[#B38B59]/40 rounded-full text-[10px] font-bold text-[#B38B59] uppercase tracking-widest mb-8">
            Rathi Naturals Fresh Monthly
          </div>
          <h1 className="font-display text-4xl md:text-7xl font-bold mb-8 leading-tight">
            Never Run Out of <br /><span className="text-[#B38B59] italic text-5xl md:text-8xl">Fresh Flavor</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            Hand-picked, single-origin spices delivered to your door every month. Milled fresh in Sangaria and packed with soul.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto text-left">
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-[#B38B59]/20 rounded-2xl flex items-center justify-center shrink-0 border border-[#B38B59]/30">
                <SparklesIcon className="w-7 h-7 text-[#B38B59]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Peak Freshness</h3>
                <p className="text-sm text-stone-400 leading-relaxed">Ground and vacuum-sealed within 24 hours of shipping for maximum aroma.</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-[#B38B59]/20 rounded-2xl flex items-center justify-center shrink-0 border border-[#B38B59]/30">
                <UsersIcon className="w-7 h-7 text-[#B38B59]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Direct From Farmers</h3>
                <p className="text-sm text-stone-400 leading-relaxed">By subscribing, you ensure fair-trade pricing directly to our spice growers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-32 px-4 md:px-6 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B38B59]/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-[#42210B] mb-6">
              Choose Your <span className="text-[#B38B59] italic">Plan</span>
            </h2>
            <p className="text-stone-500 text-lg font-medium">No commitments. Pause, skip, or cancel your subscription anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <SubscriptionCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 bg-white px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold text-[#42210B] mb-20 text-center">Frequently Asked <span className="text-[#B38B59] italic">Questions</span></h2>
          <div className="grid md:grid-cols-2 gap-16 text-left">
            <div className="space-y-4 p-8 rounded-3xl bg-[#FAF6F2] border border-stone-50">
              <h4 className="font-bold text-[#42210B] text-xl">Can I skip a month?</h4>
              <p className="text-stone-500 leading-relaxed">
                Absolutely. Life happens. You can pause or skip your delivery from your account dashboard with a single click.
              </p>
            </div>
            <div className="space-y-4 p-8 rounded-3xl bg-[#FAF6F2] border border-stone-50">
              <h4 className="font-bold text-[#42210B] text-xl">What's inside the box?</h4>
              <p className="text-stone-500 leading-relaxed">
                A curated selection of our finest seasonal spices, artisan blends, and exclusive, chef-curated recipe cards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;
