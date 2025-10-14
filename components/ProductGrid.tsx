import React from 'react';
import { Product, Variant } from '../types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistedIds: Set<number>;
  onSelectProduct: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  comparisonIds: Set<number>;
  isLoading: boolean;
  onNotifyMe: (productName: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistedIds, 
  onSelectProduct,
  onToggleCompare,
  comparisonIds,
  isLoading,
  onNotifyMe
}) => {
  // Debugging log as requested
  console.log('Product grid data:', products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }

  if(products.length === 0) {
    return (
        <div className="text-center py-20">
            <h3 className="text-2xl font-serif font-bold text-brand-dark">No Products Found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters or search query.</p>
        </div>
    );
  }
  
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
            onToggleCompare={onToggleCompare}
            isCompared={comparisonIds.has(product.id)}
            onNotifyMe={onNotifyMe}
        />
      ))}
    </div>
  );
};

export default ProductGrid;