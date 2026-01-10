import React, { useState } from 'react';

interface CookingKit {
  id: string;
  name: string;
  description: string;
  products: {
    id: number;
    name: string;
    image: string;
    price: number;
  }[];
  discount: number;
  bundlePrice: number;
}

const cookingKits: Record<string, CookingKit> = {
  dal: {
    id: 'dal',
    name: 'Complete Dal Tadka Kit',
    description: 'Everything you need for the perfect dal',
    products: [
      {
        id: 1,
        name: 'Turmeric Powder',
        image: '/images/products/turmeric-powder-front.jpg',
        price: 149,
      },
      {
        id: 2,
        name: 'Cumin Seeds',
        image: '/images/products/tattv-cumin-seeds-front.jpg',
        price: 179,
      },
      {
        id: 3,
        name: 'Coriander Powder',
        image: '/images/products/coriander-powder-front.jpg',
        price: 129,
      },
      { id: 4, name: 'Garam Masala', image: '/images/products/garam-masala-front.jpg', price: 199 },
    ],
    discount: 15,
    bundlePrice: 558,
  },
  chai: {
    id: 'chai',
    name: "Chai Lover's Pack",
    description: 'Perfect spices for authentic masala chai',
    products: [
      { id: 5, name: 'Chai Masala', image: '/images/products/chai-masala-front.jpg', price: 149 },
      {
        id: 6,
        name: 'Green Cardamom',
        image: '/images/products/tattv-coorg-green-cardamom-front.jpg',
        price: 349,
      },
      {
        id: 7,
        name: 'Cinnamon Bark',
        image: '/images/products/tattv-cinnamon-bark-front.png',
        price: 199,
      },
    ],
    discount: 12,
    bundlePrice: 613,
  },
  curry: {
    id: 'curry',
    name: 'Everyday Curry Essentials',
    description: 'Must-have spices for any curry dish',
    products: [
      {
        id: 8,
        name: 'Turmeric Powder',
        image: '/images/products/turmeric-powder-front.jpg',
        price: 149,
      },
      {
        id: 9,
        name: 'Red Chilli Powder',
        image: '/images/products/red-chilli-powder-front.jpg',
        price: 169,
      },
      {
        id: 10,
        name: 'Coriander Powder',
        image: '/images/products/coriander-powder-front.jpg',
        price: 129,
      },
      {
        id: 11,
        name: 'Garam Masala',
        image: '/images/products/garam-masala-front.jpg',
        price: 199,
      },
    ],
    discount: 18,
    bundlePrice: 529,
  },
  biryani: {
    id: 'biryani',
    name: 'Biryani Master Kit',
    description: 'Authentic spices for restaurant-style biryani',
    products: [
      {
        id: 12,
        name: 'Garam Masala',
        image: '/images/products/garam-masala-front.jpg',
        price: 199,
      },
      {
        id: 13,
        name: 'Green Cardamom',
        image: '/images/products/tattv-coorg-green-cardamom-front.jpg',
        price: 349,
      },
      {
        id: 14,
        name: 'Cinnamon Bark',
        image: '/images/products/tattv-cinnamon-bark-front.png',
        price: 199,
      },
      {
        id: 15,
        name: 'Black Pepper',
        image: '/images/products/tattv-malabar-black-pepper-front.png',
        price: 249,
      },
    ],
    discount: 20,
    bundlePrice: 797,
  },
};

const cookingOptions = [
  { id: 'dal', label: 'Making Dal?', emoji: '🍛' },
  { id: 'chai', label: 'Making Chai?', emoji: '☕' },
  { id: 'curry', label: 'Making Curry?', emoji: '🍲' },
  { id: 'biryani', label: 'Biryani Night?', emoji: '🍚' },
];

interface CookingContextWidgetProps {
  onAddToCart?: (productIds: number[]) => void;
  onAddBundleToCart?: (kit: CookingKit) => void;
}

const CookingContextWidget: React.FC<CookingContextWidgetProps> = ({
  onAddToCart,
  onAddBundleToCart,
}) => {
  const [selectedCooking, setSelectedCooking] = useState<string | null>(null);
  const selectedKit = selectedCooking ? cookingKits[selectedCooking] : null;

  const calculateOriginalPrice = (kit: CookingKit) => {
    return kit.products.reduce((sum, p) => sum + p.price, 0);
  };

  const handleAddBundle = () => {
    if (selectedKit && onAddBundleToCart) {
      onAddBundleToCart(selectedKit);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-neutral-900 mb-3">
            🍳 Cook What You're Craving Today
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Select what you're cooking and get the complete spice kit with exclusive bundle
            discounts
          </p>
        </div>

        {/* Cooking Option Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {cookingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedCooking(selectedCooking === option.id ? null : option.id)}
              className={`
                inline-flex items-center gap-2 px-5 py-3 
                text-base font-semibold rounded-full
                border-2 transition-all duration-300
                ${
                  selectedCooking === option.id
                    ? 'bg-brand-primary text-brand-dark border-brand-primary shadow-lg transform scale-105'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-brand-primary hover:text-brand-dark'
                }
              `}
            >
              <span className="text-xl">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {/* Selected Kit Display */}
        {selectedKit && (
          <div className="animate-fadeIn max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden">
            {/* Kit Header */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{selectedKit.name}</h3>
                  <p className="text-sm text-neutral-600">{selectedKit.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Save {selectedKit.discount}%
                  </span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedKit.products.map((product) => (
                  <div
                    key={product.id}
                    className="group text-center bg-neutral-50 rounded-xl p-3 transition-all hover:bg-white hover:shadow-md"
                  >
                    <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-white">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-sm font-medium text-neutral-800 line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-sm text-neutral-500">₹{product.price}</p>
                  </div>
                ))}
              </div>

              {/* Pricing & CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-brand-dark">
                    ₹{selectedKit.bundlePrice}
                  </span>
                  <span className="text-lg text-neutral-400 line-through">
                    ₹{calculateOriginalPrice(selectedKit)}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    You save ₹{calculateOriginalPrice(selectedKit) - selectedKit.bundlePrice}
                  </span>
                </div>
                <button
                  onClick={handleAddBundle}
                  className="w-full sm:w-auto bg-brand-primary text-brand-dark font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add Complete Kit to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Hint */}
        {!selectedKit && (
          <div className="text-center py-8 text-neutral-500">
            <p>👆 Select what you're cooking to see the perfect spice kit!</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default CookingContextWidget;
