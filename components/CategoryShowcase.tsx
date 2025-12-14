import React from 'react';
import { TagIcon } from './icons/TagIcon';

interface CategoryShowcaseProps {
    onSelectCategory: (category: string) => void;
}

const CATEGORIES = [
    { name: 'Spices', image: '/images/category-spices.jpg', color: 'bg-orange-50' },
    { name: 'Nuts', image: '/images/category-nuts.jpg', color: 'bg-amber-50' },
    { name: 'Dry Fruits', image: '/images/category-dryfruits.jpg', color: 'bg-yellow-50' },
    { name: 'Beverages', image: '/images/category-beverages.jpg', color: 'bg-rose-50' },
    { name: 'Offers', image: '/images/category-offers.jpg', color: 'bg-green-50' },
    { name: 'Gift Sets', image: '/images/category-gifts.jpg', color: 'bg-purple-50' },
];

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-16">
                <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-8 text-center">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => onSelectCategory(cat.name === 'Offers' ? 'All' : cat.name)} // Link 'Offers' to All+Filter logic later if needed
                            className={`relative overflow-hidden group rounded-xl aspect-[4/3] ${cat.color} transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
                        >
                            {/* Fallback pattern if image fails or for mock */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                <TagIcon className="w-32 h-32 text-brand-dark" />
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                    {cat.name}
                                </h3>
                                <span className="text-sm font-medium text-neutral-600 border-b-2 border-transparent group-hover:border-brand-primary transition-all">
                                    View Collection
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
