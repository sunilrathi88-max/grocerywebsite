export interface Farmer {
  id: string;
  name: string;
  location: string;
  farmingSince: string;
  specialty: string;
  image: string;
  quote: string;
  bio: string;
  crops: string[];
}

export const FARMERS: Farmer[] = [
  {
    id: 'rajesh-kumar',
    name: 'Rajesh Kumar',
    location: 'Wayanad, Kerala',
    farmingSince: '1998',
    specialty: 'Black Pepper & Cardamom',
    image:
      'https://images.unsplash.com/photo-1595245842188-4235b2e6669f?auto=format&fit=crop&q=80&w=800', // Authentic looking farmer image
    quote:
      "My grandfather taught me that healthy soil makes healthy food. We use no chemicals, only nature's methods.",
    bio: 'Rajesh manages a 12-acre biodiversity-rich spice plantation. His farm is a model for regenerative agriculture, intercropping spices with fruit trees to maintain soil health and local wildlife habitats.',
    crops: ['Black Pepper', 'Green Cardamom', 'Clove'],
  },
  {
    id: 'lakshmi-devi',
    name: 'Lakshmi Devi',
    location: 'Guntur, Andhra Pradesh',
    farmingSince: '2005',
    specialty: 'Heirloom Chillies',
    image:
      'https://images.unsplash.com/photo-1623164479929-195b0c793130?auto=format&fit=crop&q=80&w=800',
    quote:
      "The heat in our chillies comes from the sun and the soil. You can't fake that flavor in a factory.",
    bio: 'Lakshmi leads a cooperative of 50 women farmers in Guntur. They specialize in preserving rare heirloom chilli varieties that maintain their vibrant color and complex heat profile naturally.',
    crops: ['Guntur Sannam Chilli', 'Kashmiri Chilli', 'Turmeric'],
  },
  {
    id: 'amrit-singh',
    name: 'Amrit Singh',
    location: 'Amritsar, Punjab',
    farmingSince: '1985',
    specialty: 'Mustard & Cumin',
    image:
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=800', // Placeholder
    quote:
      "Farming is not a job, it's a service (Sewa). We feed people pure food so they can live pure lives.",
    bio: "Amrit's family has farmed the same land for four generations. He was one of the first in his region to revert to 100% organic practices, proving that traditional wisdom yields better crops than modern chemicals.",
    crops: ['Mustard Seeds', 'Cumin (Jeera)', 'Coriander'],
  },
];
