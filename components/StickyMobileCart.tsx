import React from 'react';
import { Product } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { Button } from './Button';

interface StickyMobileCartProps {
  product: Product;
  price: number;
  onAddToCart: () => void;
  isVisible: boolean;
  image: string;
}

export const StickyMobileCart: React.FC<StickyMobileCartProps> = ({
  product,
  price,
  onAddToCart,
  isVisible,
  image,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-top z-50 md:hidden animate-slide-up">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-gray-100">
          <OptimizedImage
            src={image}
            alt={product.name}
            width={48}
            height={48}
            type="thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow min-w-0">
          <p className="font-bold text-gray-900 truncate text-sm">{product.name}</p>
          <p className="text-brand-primary font-bold text-sm">₹{price}</p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={onAddToCart} size="sm" className="whitespace-nowrap shadow-lg">
            Add to Cart
          </Button>
        </div>
      </div>
      <style>{`
        .shadow-top {
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
