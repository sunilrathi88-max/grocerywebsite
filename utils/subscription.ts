import { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Box',
    price: 999,
    interval: 'monthly',
    features: [
      '4 Curated Spices Monthly',
      'Free Shipping',
      '1 Recipe Card',
      '10% OFF all other store orders',
    ],
    savings: '₹200 / year',
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Chef’s Collection',
    price: 1499,
    interval: 'monthly',
    features: [
      '6 Premium Spices Monthly',
      'Priority Free Shipping',
      '3 Recipe Cards',
      'Early Access to New Harvests',
      '20% OFF all other store orders',
      'Quarterly Surprise Gift',
    ],
    savings: '₹600 / year',
    recommended: true,
  },
];

export const calculateNextBillingDate = (startDate: string): string => {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
};
