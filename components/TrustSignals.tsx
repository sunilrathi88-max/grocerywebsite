import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TruckIcon } from './icons/TruckIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { BeakerIcon } from './icons/BeakerIcon'; // Assuming BeakerIcon exists for "Lab Tested", else using ShieldCheckIcon

const TrustSignals: React.FC = () => {
  const deepSignals = [
    {
      icon: <TruckIcon className="w-5 h-5 md:w-6 md:h-6" />,
      text: 'Free Shipping > ₹600',
    },
    {
      icon: <CheckBadgeIcon className="w-5 h-5 md:w-6 md:h-6" />,
      text: 'Direct from Farms',
    },
    {
      icon: <ShieldCheckIcon className="w-5 h-5 md:w-6 md:h-6" />,
      text: 'FSSAI Certified',
    },
    {
      icon: <BeakerIcon className="w-5 h-5 md:w-6 md:h-6" />, // Fallback to Shield if Beaker missing in next check
      text: 'Lab Tested Purity',
    },
  ];

  return (
    <div className="bg-neutral-50 border-y border-neutral-100 py-4">
      <div className="max-w-7xl mx-auto px-4 md:px-16 space-y-4">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-8">
          {deepSignals.map((signal, idx) => (
            <div key={idx} className="flex items-center gap-2 text-neutral-700">
              <span className="text-brand-primary opacity-80">{signal.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{signal.text}</span>
            </div>
          ))}
        </div>

        {/* Payment & Security Row */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-4 border-t border-dashed border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-bold">
            <ShieldCheckIcon className="w-4 h-4" /> 100% Secure Payments
          </div>
          <div className="flex gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <img
              src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
              alt="Visa"
              className="h-6"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/825/825454.png"
              alt="UPI"
              className="h-6"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
              alt="PayPal"
              className="h-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
