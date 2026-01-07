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
  loadingStrategy?: 'eager' | 'lazy';
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products, ...props }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      {title && <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6">{title}</h3>}
      <div className="flex space-x-8 pb-4 -mx-4 px-4 overflow-x-auto min-h-[420px]">
        {products.map((product) => (
          <div key={product.id} className="w-80 flex-shrink-0">
            <ProductCard
              id={product.id.toString()}
              name={product.name}
              price={product.variants[0]?.salePrice || product.variants[0]?.price}
              originalPrice={
                product.variants[0]?.salePrice ? product.variants[0]?.price : undefined
              }
              image={product.images[0]}
              rating={product.rating || 0}
              reviewCount={product.reviews.length}
              heatLevel="medium"
              useCase={product.category}
              sizes={product.variants.map((v) => ({
                size: v.name,
                price: v.salePrice || v.price,
              }))}
              onAddToCart={(id) => {
                const p = products.find((prod) => prod.id.toString() === id);
                if (p && p.variants[0]) {
                  props.onAddToCart(p, p.variants[0]);
                }
              }}
              onWishlist={(id) => {
                const p = products.find((prod) => prod.id.toString() === id);
                if (p) props.onToggleWishlist(p);
              }}
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
