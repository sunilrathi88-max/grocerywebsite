import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { SubscriptionPlan } from '../types';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ plan, onSubscribe }) => {
  const isRecommended = plan.recommended;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative flex flex-col h-full"
    >
      {/* Recommended glow */}
      {isRecommended && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ boxShadow: '0 0 60px rgba(179,139,89,0.2)', zIndex: 0 }}
        />
      )}

      <div
        className={`relative z-10 flex flex-col h-full rounded-3xl overflow-hidden border transition-all duration-300 ${
          isRecommended
            ? 'bg-[#0F0704] border-[#B38B59]/40'
            : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xl'
        }`}
      >
        {/* Most Popular badge */}
        {isRecommended && (
          <div
            className="flex items-center justify-center gap-2 py-3 px-6"
            style={{ background: 'linear-gradient(90deg, #B38B59, #8C6D45)' }}
          >
            <Star size={12} className="fill-white text-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
              Most Popular
            </span>
            <Star size={12} className="fill-white text-white" />
          </div>
        )}

        <div className="p-8 flex flex-col flex-1">
          {/* Plan header */}
          <div className="mb-8">
            <h3
              className={`text-xl font-black mb-1 ${isRecommended ? 'text-white' : 'text-[#42210B]'}`}
            >
              {plan.name}
            </h3>
            <p className={`text-sm ${isRecommended ? 'text-stone-400' : 'text-stone-500'}`}>
              Fresh spices, delivered to your door
            </p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-display text-5xl font-black ${isRecommended ? 'text-white' : 'text-[#42210B]'}`}
              >
                ₹{plan.price}
              </span>
              <span
                className={`text-sm font-bold ${isRecommended ? 'text-stone-500' : 'text-stone-400'}`}
              >
                / {plan.interval}
              </span>
            </div>
            <div className="mt-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
                style={{
                  background: isRecommended ? 'rgba(34,197,94,0.1)' : '#F0FDF4',
                  color: '#16A34A',
                  border: isRecommended ? '1px solid rgba(34,197,94,0.2)' : '1px solid #BBF7D0',
                }}
              >
                Save {plan.savings}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{ background: isRecommended ? 'rgba(255,255,255,0.06)' : '#F5F5F4' }}
          />

          {/* Features */}
          <ul className="space-y-3.5 flex-1 mb-8">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <CheckCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: isRecommended ? '#B38B59' : '#16A34A' }}
                />
                <span className={isRecommended ? 'text-stone-300' : 'text-stone-600'}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={() => onSubscribe(plan.id)}
            className="group w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            style={
              isRecommended
                ? {
                    background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                    color: 'white',
                    boxShadow: '0 8px 30px rgba(179,139,89,0.4)',
                  }
                : {
                    background: '#FAF6F2',
                    color: '#42210B',
                    border: '2px solid #E7E0D9',
                  }
            }
          >
            Subscribe Now
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionCard;
