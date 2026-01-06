import { Testimonial } from '../types';

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Mehta',
    quote:
      "The aroma when I opened the cardamom packet was unreal — it's like my grandmother's kitchen. I've tried everything from Big Basket to local stores, but nothing comes close to this freshness.",
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Priya+Mehta&background=D4A017&color=fff',
    location: 'Mumbai',
    productPurchased: 'Green Cardamom',
    verified: true,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    quote:
      'I was skeptical paying more for spices online. But the potency is incredible — I use half the amount now. The garam masala transformed my butter chicken completely.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=8B5CF6&color=fff',
    location: 'Delhi',
    productPurchased: 'Garam Masala',
    verified: true,
  },
  {
    id: 3,
    name: 'Aisha Lakshmi',
    quote:
      'Love the QR code transparency. I scanned it and saw exactly which farm my turmeric came from, the lab test results, everything. This is how food should be.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Aisha+Lakshmi&background=10B981&color=fff',
    location: 'Bangalore',
    productPurchased: 'Turmeric Powder',
    verified: true,
  },
  {
    id: 4,
    name: 'Vikram Singh',
    quote:
      "As a professional chef, I'm extremely particular about my spices. The Kashmiri chili powder has the perfect color and heat without bitterness. Restaurant quality at home.",
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=EF4444&color=fff',
    location: 'Jaipur',
    productPurchased: 'Kashmiri Chili',
    verified: true,
  },
  {
    id: 5,
    name: 'Deepa Nair',
    quote:
      "Finally, spices that don't have sawdust or artificial colors. My kids can taste the difference in my cooking now. Worth every rupee.",
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Deepa+Nair&background=F59E0B&color=fff',
    location: 'Chennai',
    productPurchased: 'Coriander Powder',
    verified: true,
  },
  {
    id: 6,
    name: 'Amit Sharma',
    quote:
      'The subscription service is brilliant. Fresh spices every month without me having to remember. The cumin seeds are so aromatic, my tadka game has leveled up!',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Amit+Sharma&background=3B82F6&color=fff',
    location: 'Pune',
    productPurchased: 'Cumin Seeds',
    verified: true,
  },
];

// Featured testimonials for homepage (top 4)
export const FEATURED_TESTIMONIALS = MOCK_TESTIMONIALS.slice(0, 4);
