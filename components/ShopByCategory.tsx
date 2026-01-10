import React from 'react';
import { OptimizedImage } from './OptimizedImage'; // Assuming you have this or standard img

const categories = [
  {
    id: 'pure-spices',
    name: 'Pure Spices',
    description: 'Individual, unmixed spices for custom blending.',
    image: '/images/products/turmeric-powder-front.jpg',
  },
  {
    id: 'masala-blends',
    name: 'Masala Blends',
    description: 'Ready-to-use blends for quick, authentic dishes.',
    image: '/images/products/garam-masala-front.jpg',
  },
  {
    id: 'whole-spices',
    name: 'Whole Spices',
    description: 'Whole seeds and pods for fresh grinding at home.',
    image: '/images/products/tattv-cumin-seeds-front.jpg',
  },
  {
    id: 'single-origin',
    name: 'Single Origin',
    description: 'High-grade lots sourced from specific regions.',
    image: '/images/products/tattv-malabar-black-pepper-front.png',
  },
  {
    id: 'combo-packs',
    name: 'Combo Packs',
    description: 'Curated sets for daily cooking or gifting.',
    image: '/images/products/chai-masala-front.jpg',
  },
];

interface ShopByCategoryProps {
  onSelectCategory?: (category: string) => void;
}

const ShopByCategory: React.FC<ShopByCategoryProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group cursor-pointer"
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 shadow-md bg-white">
                <OptimizedImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-1">{cat.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
