import React from 'react';
import { Product } from '../../types';

interface ProductOverviewTabProps {
  product: Product;
}

const ProductOverviewTab: React.FC<ProductOverviewTabProps> = ({ product }) => {
  return (
    <div className="prose prose-stone max-w-none">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h3 className="font-serif font-bold text-2xl mb-4 text-[#1c1917]">
            Pure {product.name}, Straight from the Source
          </h3>
          <p className="text-lg leading-relaxed text-gray-700">{product.description}</p>
        </div>
        <div className="bg-[#fff7ed] p-6 rounded-xl border border-[#ffedd5]">
          <h4 className="font-bold text-[#9a3412] uppercase tracking-wide text-sm mb-3">
            Key Benefits
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>High Potency: Contains &gt;5% essential oils (market avg: 2%)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Single Origin: Traced back to one farm in {product.origin}</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Cold Ground: Milled at low temps to preserve flavor</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <span className="text-3xl block mb-2">🌿</span>
          <span className="font-bold text-gray-800 text-sm">Vegan Friendly</span>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <span className="text-3xl block mb-2">🍞</span>
          <span className="font-bold text-gray-800 text-sm">Gluten Free</span>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <span className="text-3xl block mb-2">⚛️</span>
          <span className="font-bold text-gray-800 text-sm">No GMOs</span>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <span className="text-3xl block mb-2">🚫</span>
          <span className="font-bold text-gray-800 text-sm">No Additives</span>
        </div>
      </div>

      <h3 className="font-serif font-bold text-xl mt-8 mb-4">Best Uses</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>Enhance curries and gravies with deep, complex flavor.</li>
        <li>Add to marinades for meats and vegetables.</li>
        <li>Bloom in hot oil/ghee to release aromatics before cooking.</li>
      </ul>
    </div>
  );
};

export default ProductOverviewTab;
