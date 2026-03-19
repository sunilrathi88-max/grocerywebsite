import React, { useMemo } from 'react';
import { Product, Variant } from '../types';
import { OptimizedImage } from './OptimizedImage';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  allProducts: Product[];
  onAddBundleToCart: (products: Product[]) => void;
}

const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  allProducts,
  onAddBundleToCart,
}) => {
  // Simple rule-based logic for complementary products
  const complementaryProducts = useMemo(() => {
    let suggestions: Product[] = [];

    // Rule 1: Spices -> Suggest Cumin, Black Pepper, or Turmeric (if not current)
    if (currentProduct.category === 'Spices') {
      const staples = ['Cumin', 'Black Pepper', 'Turmeric', 'Coriander'];
      suggestions = allProducts.filter(
        (p) =>
          p.category === 'Spices' &&
          p.id !== currentProduct.id &&
          staples.some((s) => p.name.includes(s))
      );
    }
    // Rule 2: Tea -> Suggest Cardamom, Saffron, or Lemongrass
    else if (currentProduct.category === 'Beverages') {
      suggestions = allProducts.filter(
        (p) =>
          (p.name.includes('Cardamom') || p.name.includes('Saffron')) && p.id !== currentProduct.id
      );
    }
    // Rule 3: Nuts -> Suggest other Nuts
    else if (currentProduct.category === 'Nuts') {
      suggestions = allProducts.filter((p) => p.category === 'Nuts' && p.id !== currentProduct.id);
    }

    // Fallback: Random robust suggestions
    if (suggestions.length < 2) {
      suggestions = allProducts.filter((p) => p.id !== currentProduct.id).slice(0, 5);
    }

    // Take top 2
    return suggestions.slice(0, 2);
  }, [currentProduct, allProducts]);

  if (complementaryProducts.length === 0) return null;

  const bundleProducts = [currentProduct, ...complementaryProducts].filter(
    (p) => p && p.variants && p.variants.length > 0
  );

  if (bundleProducts.length < 2) return null;

  const totalPrice = bundleProducts.reduce((sum, p) => sum + (p.variants[0]?.price || 0), 0);
  const bundlePrice = Math.round(totalPrice * 0.85); // 15% discount
  const savings = totalPrice - bundlePrice;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 my-12 shadow-sm">
      <h3 className="font-serif text-2xl font-bold text-brand-dark mb-6">
        Frequently Bought Together
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Products List */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto">
          {bundleProducts.map((product, index) => (
            <React.Fragment key={product.id}>
              {/* Plus Icon */}
              {index > 0 && <span className="text-neutral-300 font-bold text-xl">+</span>}

              {/* Product Item */}
              <div className="flex flex-col items-center w-28 shrink-0">
                <div className="w-24 h-24 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 mb-2">
                  <OptimizedImage
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    width={96}
                    height={96}
                  />
                </div>
                <p className="text-xs font-medium text-center line-clamp-2 text-neutral-800 h-8">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-neutral-900 mt-1">
                  ₹{product.variants?.[0]?.price || 'N/A'}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-32 bg-neutral-200"></div>

        {/* CTA Section */}
        <div className="flex flex-col items-center md:items-start ml-auto min-w-[200px]">
          <div className="mb-4 text-center md:text-left">
            <p className="text-neutral-500 text-sm">Total Price:</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-primary">₹{bundlePrice}</span>
              <span className="text-neutral-400 line-through text-lg">₹{totalPrice}</span>
            </div>
            <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">
              Save ₹{savings} (15%)
            </span>
          </div>

          <button
            onClick={() => onAddBundleToCart(bundleProducts)}
            className="w-full bg-brand-dark text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors shadow-md transform active:scale-95"
          >
            Add All to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
