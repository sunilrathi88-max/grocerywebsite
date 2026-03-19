import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface HarvestCollectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const HarvestCollection: React.FC<HarvestCollectionProps> = ({
  products,
  title = 'Our Harvest',
  subtitle = 'Seasonally curated. Limited batches.',
}) => {
  const navigate = useNavigate();

  // Curated product IDs: Saffron (1), Black Pepper (2), Garam Masala (28), Turmeric (4)
  const curatedIds = [1, 2, 28, 4];

  // If products are passed specifically (e.g. via slice in parent), use them if they match logic,
  // or just use the passed products directly if we want to be flexible.
  // The current logic filters by `curatedIds`.
  // If we want "New Arrivals" to be different, we should probably just use `products` passed in if it's a subset,
  // or add logic. For now, let's assume the parent passes the right products OR we use the curated list if products is the full list.
  // Actually, looking at `HomePage.tsx` update: `<HarvestCollection products={products.slice(0, 4)} ... />`
  // The current implementation IGNORES the passed `products` list content and filters from it using `curatedIds`.
  // I should change it to use `products` directly if `curatedIds` logic isn't desired, OR just use `products` as the source.
  // Let's rely on the parent to pass the correct products if they want specific ones,
  // BUT the current implementation filters `products` by `curatedIds`.

  // Let's modify to: if title is "New Arrivals", maybe show first 4?
  // OR better: accept `products` and SHOW THEM.
  // But `HomePage` passes `products` (all products) in the first usage.
  // So I should probably keep the filter for the default case, but if `products` is small (e.g. < 10) maybe just show them?
  // Or better, just show the products passed in.
  // BUT `HomePage` passes `products` (ALL) for "Best Sellers".
  // So for "Best Sellers", we still want the curated list? Yes.
  // For "New Arrivals", we passed `products.slice(0, 4)`.
  // So if I just map `products`, "Best Sellers" will show ALL products which is too many.

  // Compromise:
  // If `products.length > 4`, apply curation/filtering (default behavior).
  // If `products.length <= 4`, just show them (New Arrivals behavior).

  const displayProducts =
    products.length > 8
      ? curatedIds
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined)
      : products;

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const getProductPrice = (product: Product): number => {
    return product.variants[0]?.price || 0;
  };

  const getProductImage = (product: Product): string => {
    return product.images[0] || '/images/placeholder.jpg';
  };

  const getProductTag = (product: Product): string | null => {
    if (product.tags?.includes('Premium')) return 'Premium';
    if (product.tags?.includes('Organic')) return 'Organic';
    if (product.tags?.includes('Single-Origin')) return 'Single Origin';
    return null;
  };

  return (
    <section id="most-loved-section" className="py-20 bg-ink border-t border-mist/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-row justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl md:text-5xl font-serif text-cream mb-2">{title}</h3>
            <p className="text-dust font-light text-sm">{subtitle}</p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-saffron hover:text-gold transition-colors"
          >
            View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {displayProducts.map((product) => {
            const tag = getProductTag(product);
            return (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative overflow-hidden mb-6 bg-char border border-mist/10 aspect-[4/5]">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter saturate-[0.85] contrast-[1.1] group-hover:saturate-100 mix-blend-luminosity hover:mix-blend-normal"
                    src={getProductImage(product)}
                    loading="lazy"
                  />
                  {tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-ink/90 backdrop-blur-sm text-saffron text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                        {tag}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <h4 className="font-serif text-xl text-cream group-hover:text-saffron transition-colors">
                    {product.name}
                  </h4>
                  {product.origin && (
                    <p className="text-xs text-mist uppercase tracking-widest mb-2">
                      Origin: {product.origin}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2 border-t border-char pt-3">
                    <span className="font-medium text-dust">
                      ₹{getProductPrice(product)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="text-saffron uppercase text-xs font-bold tracking-widest hover:text-gold"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 md:hidden text-center">
          <button
            onClick={() => navigate('/shop')}
            className="inline-block border border-saffron text-saffron px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-saffron hover:text-ink transition-colors"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default HarvestCollection;
