import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TruckIcon } from './icons/TruckIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Secure Payment',
      description: '256-bit SSL encryption',
      color: 'text-green-500 dark:text-green-400',
    },
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: 'Fast Delivery',
      description: 'Free shipping over $50',
      color: 'text-blue-500 dark:text-blue-400',
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: 'Money Back',
      description: '30-day guarantee',
      color: 'text-purple-500 dark:text-purple-400',
    },
    {
      icon: <CheckBadgeIcon className="h-8 w-8" />,
      title: 'Quality Assured',
      description: 'Fresh & organic',
      color: 'text-orange-500 dark:text-orange-400',
    },
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center group transition-transform duration-300 hover:scale-105"
          >
            <div
              className={`${badge.color} mb-3 transition-transform duration-300 group-hover:scale-110`}
            >
              {badge.icon}
            </div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
              {badge.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
          Accepted Payment Methods
        </p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {/* Visa */}
          <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="white" />
              <path
                d="M20.5 11h-3.2l-2 12.5h3.2L20.5 11zm11.3 8.1l1.7-4.6.95 4.6h-2.65zm3.6 4.4h2.9l-2.5-12.5h-2.7c-.6 0-1.1.35-1.3.88l-4.6 11.6h3.4l.67-1.85h4.15l.39 1.85zM26.8 18.8c0-3.3-4.6-3.5-4.6-5 0-.45.45-.93 1.4-.93.75-.02 1.5.15 2.15.5l.39-2.25c-.7-.26-1.45-.4-2.2-.4-3.4 0-5.8 1.8-5.8 4.4 0 1.9 1.7 2.95 3 3.6 1.35.65 1.8 1.1 1.8 1.7 0 .9-1.1 1.3-2.1 1.3-.9 0-1.8-.2-2.6-.55l-.4 2.3c.85.35 1.75.55 2.65.55 3.6.05 6-1.75 6-4.5zM14.9 11l-5.3 12.5H6.2L3.5 13.4c-.17-.65-.32-.9-.83-1.15-.85-.45-2.25-.85-3.48-1.1L9 23.5h3.4l5.1-12.5h-2.6z"
                fill="#1434CB"
              />
            </svg>
          </div>

          {/* Mastercard */}
          <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="white" />
              <circle cx="18" cy="16" r="8" fill="#EB001B" />
              <circle cx="30" cy="16" r="8" fill="#FF5F00" />
              <path
                d="M24 21.6c-1.8 1.4-4 2.4-6.4 2.4-5.5 0-10-4.5-10-10s4.5-10 10-10c2.4 0 4.6.8 6.4 2.2 1.8-1.4 4-2.2 6.4-2.2 5.5 0 10 4.5 10 10s-4.5 10-10 10c-2.4 0-4.6-.8-6.4-2.2z"
                fill="#F79E1B"
              />
            </svg>
          </div>

          {/* PayPal */}
          <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="white" />
              <path
                d="M18.6 9.5h-5.2c-.35 0-.65.25-.7.6l-2.1 13c-.04.25.15.48.4.48h2.4c.35 0 .65-.25.7-.6l.55-3.5c.05-.35.35-.6.7-.6h1.6c3.35 0 5.3-1.6 5.8-4.8.25-1.4 0-2.5-.7-3.3-.75-.9-2.1-1.3-3.8-1.3zm.6 4.7c-.3 1.9-1.7 1.9-3.1 1.9h-.8l.55-3.5c.03-.2.2-.35.4-.35h.35c.9 0 1.75 0 2.2.5.25.3.35.75.25 1.45zm14.5-.05h-2.4c-.2 0-.4.15-.4.35l-.1.65-.15-.25c-.5-.7-1.6-1-2.7-1-2.5 0-4.7 1.9-5.1 4.6-.2 1.35.1 2.65.85 3.55.7.85 1.7 1.2 2.9 1.2 2.05 0 3.2-1.3 3.2-1.3l-.1.65c-.04.25.15.48.4.48h2.2c.35 0 .65-.25.7-.6l1.3-8.2c.05-.25-.15-.48-.4-.48zm-3.3 4.7c-.2 1.3-1.2 2.2-2.5 2.2-.65 0-1.15-.2-1.5-.6-.35-.4-.5-.95-.4-1.6.2-1.3 1.2-2.2 2.5-2.2.65 0 1.15.2 1.5.6.35.4.5.95.4 1.6z"
                fill="#003087"
              />
              <path
                d="M38.6 9.5h-2.4c-.2 0-.4.15-.4.35l-.1.65-.15-.25c-.5-.7-1.6-1-2.7-1-2.5 0-4.7 1.9-5.1 4.6-.2 1.35.1 2.65.85 3.55.7.85 1.7 1.2 2.9 1.2 2.05 0 3.2-1.3 3.2-1.3l-.1.65c-.04.25.15.48.4.48h2.2c.35 0 .65-.25.7-.6l1.3-8.2c.05-.25-.15-.48-.4-.48zm-3.3 4.7c-.2 1.3-1.2 2.2-2.5 2.2-.65 0-1.15-.2-1.5-.6-.35-.4-.5-.95-.4-1.6.2-1.3 1.2-2.2 2.5-2.2.65 0 1.15.2 1.5.6.35.4.5.95.4 1.6z"
                fill="#009CDE"
              />
            </svg>
          </div>

          {/* American Express */}
          <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
            <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
              <rect width="48" height="32" rx="4" fill="#006FCF" />
              <path
                d="M8.5 19.5l-1.2-3h-2.6l-1.2 3H1l3.5-8h2.5l3.5 8h-2zm-2.8-6.5l-.9 2.3h1.8l-.9-2.3zm5.8 6.5v-8h3.5c.9 0 1.6.2 2.1.7.4.4.6 1 .6 1.6 0 1.2-.7 2-2 2.3l2.3 3.4h-2.5l-2-3h-.5v3h-1.5zm1.5-4.5h1.7c.8 0 1.2-.4 1.2-1s-.4-1-1.2-1h-1.7v2zm8.5 4.5l-1.2-3h-2.6l-1.2 3H14l3.5-8h2.5l3.5 8h-2zm-2.8-6.5l-.9 2.3h1.8l-.9-2.3zM26 19.5v-8h5.5v1.5h-4v1.5h3.5v1.5h-3.5v2h4v1.5H26zm8 0v-8h1.5l2.5 4.2 2.5-4.2h1.5v8h-1.5v-5.2l-2.5 4.2h-.5l-2.5-4.2v5.2H34z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
