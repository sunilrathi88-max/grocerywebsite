import React from 'react';
import { Product, Variant } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistedIds: Set<number>;
  onSelectProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onToggleWishlist, wishlistedIds, onSelectProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistedIds.has(product.id)}
            onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};

export default React.memo(ProductGrid);