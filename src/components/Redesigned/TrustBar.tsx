import React from 'react';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/shippingConfig';
import { motion } from 'framer-motion';
import { ShieldCheck, Snowflake, Leaf, Lock, Package, RefreshCw } from 'lucide-react';

const badges = [
  { icon: Lock, text: '256-bit SSL' },
  { icon: RefreshCw, text: '7-day Returns' },
  { icon: ShieldCheck, text: 'FSSAI Certified' },
  { icon: Leaf, text: '100% Organic' },
  { icon: Snowflake, text: 'Cold-ground <10°C' },
  { icon: Package, text: `Free Shipping ₹${FREE_SHIPPING_THRESHOLD}+` },
  // Duplicate for seamless loop
  { icon: Lock, text: '256-bit SSL' },
  { icon: RefreshCw, text: '7-day Returns' },
  { icon: ShieldCheck, text: 'FSSAI Certified' },
  { icon: Leaf, text: '100% Organic' },
  { icon: Snowflake, text: 'Cold-ground <10°C' },
  { icon: Package, text: `Free Shipping ₹${FREE_SHIPPING_THRESHOLD}+` },
];

export default function TrustBar() {
  return (
    <div className="relative bg-surface border-y border-border overflow-hidden h-10 flex items-center">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-surface to-transparent pointer-events-none" />

      <motion.div
        className="flex items-center gap-0 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 28,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2 px-8">
                <Icon size={14} className="text-sage" strokeWidth={2} />
                <span className="text-[12px] font-body font-semibold tracking-wide text-bark uppercase">
                  {badge.text}
                </span>
              </div>
              {/* Divider dot */}
              <div className="w-[3px] h-[3px] rounded-full bg-border flex-shrink-0" />
            </React.Fragment>
          );
        })}
      </motion.div>
    </div>
  );
}
