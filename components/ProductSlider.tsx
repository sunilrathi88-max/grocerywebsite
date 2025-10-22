import React from 'react';
import { Product, Variant } from '../types';
import ProductCard from './ProductCard';

interface ProductSliderProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistedIds: Set<number>;
  onSelectProduct: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  comparisonIds?: Set<number>;
  onNotifyMe: (productName: string) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products, onNotifyMe, ...props }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">{title}</h3>
      <div className="flex space-x-8 pb-4 -mx-4 px-4 overflow-x-auto">
        {products.map((product) => (
          <div key={product.id} className="w-80 flex-shrink-0">
            <ProductCard
              product={product}
              onAddToCart={props.onAddToCart}
              onToggleWishlist={props.onToggleWishlist}
              isWishlisted={props.wishlistedIds.has(product.id)}
              onSelectProduct={props.onSelectProduct}
              onToggleCompare={props.onToggleCompare || (() => {})}
              isCompared={(props.comparisonIds || new Set()).has(product.id)}
              onNotifyMe={onNotifyMe}
            />
          </div>
        ))}
      </div>
      <style>{`
        .overflow-x-auto::-webkit-scrollbar { height: 8px; }
        .overflow-x-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .overflow-x-auto::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #aaa; }
      `}</style>
    </div>
  );
};

export default ProductSlider;
