import React from 'react';
import { Product } from '../../types';

interface ProductSourcingTabProps {
  product: Product;
}

const ProductSourcingTab: React.FC<ProductSourcingTabProps> = ({ product }) => {
  return (
    <div>
      <div className="bg-white border rounded-xl overflow-hidden mb-8">
        <div className="grid md:grid-cols-2">
          <div className="h-64 md:h-auto bg-gray-200 relative">
            <img
              src="https://images.unsplash.com/photo-1595257841889-addca67dd711?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover"
              alt="Farmer"
            />
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-6 text-white">
              <p className="font-bold text-lg">Rajesh Kumar</p>
              <p className="text-sm opacity-80">Farmer Partner since 2018</p>
            </div>
          </div>
          <div className="p-8">
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
              Direct Trade
            </span>
            <h3 className="font-serif font-bold text-2xl mb-4">Met The Farmer</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              &quot;I've been growing turmeric on my family's land in Telengana for 25 years. We
              don't use chemical sprays—only neem oil and natural compost. Rathi Naturals. pays us
              fair rates, which lets me send my daughter to college.&quot;
            </p>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <span className="block text-xs text-gray-500 uppercase">Location</span>
                <span className="font-bold text-gray-800">{product.origin}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase">Harvest Date</span>
                <span className="font-bold text-gray-800">{product.harvestDate || 'Jan 2025'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">Sustainable Farming</h4>
          <p className="text-sm text-gray-600">
            Intercropping methods used to maintain soil health naturally.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">Ethical Labor</h4>
          <p className="text-sm text-gray-600">
            Strict no-child-labor policy and fair wages for all workers.
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">Plastic Neutral</h4>
          <p className="text-sm text-gray-600">
            We offset 100% of plastic used in our supply chain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductSourcingTab;
