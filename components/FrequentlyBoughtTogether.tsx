import React, { useMemo, useState } from 'react';
import { Product } from '../types';
import { PlusIcon } from '@heroicons/react/24/outline'; // Adjust import if needed
import { imageErrorHandlers } from '../utils/imageHelpers';

// Fallback icon if heroicons missing or path wrong
const PlusSymbol = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  recommendations: Product[];
  onAddBundle: (products: Product[]) => void;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  recommendations,
  onAddBundle,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(recommendations.map((p) => p.id))
  );

  const toggleSelection = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const bundleItems = useMemo(() => {
    return [mainProduct, ...recommendations.filter((p) => selectedIds.has(p.id))];
  }, [mainProduct, recommendations, selectedIds]);

  const totalPrice = useMemo(() => {
    return bundleItems.reduce((sum, p) => {
      const price = p.variants[0].salePrice || p.variants[0].price;
      return sum + price;
    }, 0);
  }, [bundleItems]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8 border border-neutral-200 rounded-xl p-5 bg-white shadow-sm">
      <h3 className="font-serif font-bold text-gray-900 text-lg mb-4">
        Frequently Bought Together
      </h3>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {/* Main Product */}
          <div className="flex-shrink-0 relative">
            <img
              src={mainProduct.images[0]}
              alt={mainProduct.name}
              className="w-20 h-20 object-cover rounded-md border border-gray-100"
              onError={imageErrorHandlers.thumb}
            />
          </div>

          {[...recommendations].map((product, idx) => (
            <React.Fragment key={product.id}>
              <div className="flex-shrink-0 text-gray-400">
                <PlusSymbol />
              </div>
              <div className="flex-shrink-0 relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={`w-20 h-20 object-cover rounded-md border ${
                    selectedIds.has(product.id)
                      ? 'border-brand-primary ring-2 ring-brand-primary/20'
                      : 'border-gray-100 opacity-60'
                  } transition-all cursor-pointer`}
                  onClick={() => toggleSelection(product.id)}
                  onError={imageErrorHandlers.thumb}
                />
                {selectedIds.has(product.id) && (
                  <div className="absolute -top-2 -right-2 bg-brand-primary text-white rounded-full p-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 text-center md:text-left md:pl-4">
          <div className="text-sm text-gray-500 mb-1">
            Total Price for {bundleItems.length} items:
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-3">₹{totalPrice.toFixed(2)}</div>
          <button
            onClick={() => onAddBundle(bundleItems)}
            className="bg-brand-dark text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-opacity-90 transition-all shadow-md active:scale-95 w-full md:w-auto"
          >
            Add Bundle to Cart
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-xs font-bold">
            1
          </div>
          <span className="text-sm text-gray-700 font-medium">This item: {mainProduct.name}</span>
        </div>
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => toggleSelection(product.id)}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center rounded border ${
                selectedIds.has(product.id)
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {selectedIds.has(product.id) && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${selectedIds.has(product.id) ? 'text-gray-900' : 'text-gray-400 line-through'}`}
            >
              {product.name}{' '}
              <span className="text-brand-primary opacity-80 font-bold ml-1">
                ₹{product.variants[0].salePrice || product.variants[0].price}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
