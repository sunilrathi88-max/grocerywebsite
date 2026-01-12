import React from 'react';
import { OptimizedImage } from './OptimizedImage'; // Assuming you have this or standard img

const categories = [
  {
    id: 'single-origin',
    name: 'Single Origin',
    description: 'High-grade turmeric, chili, and pepper.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', // Placeholder
  },
  {
    id: 'spice-blends',
    name: 'Spice Blends',
    description: 'Authentic masalas for every dish.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'ready-to-cook',
    name: 'Ready-to-Cook',
    description: 'Pastes and marinades for quick meals.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'organic-staples',
    name: 'Organic Staples',
    description: 'Daily essentials, 100% certified organic.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'gifting',
    name: 'Gifting & Hampers',
    description: 'Beautifully packed spice collections.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  },
  {
    id: 'wellness',
    name: 'Wellness & Herbal',
    description: 'Teas, infusions, and immunity boosters.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
