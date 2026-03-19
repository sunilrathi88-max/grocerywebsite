import React from 'react';
import { Product } from '../../types';

interface ProductCertificationTabProps {
  product: Product;
}

const ProductCertificationTab: React.FC<ProductCertificationTabProps> = ({ product }) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <h3 className="font-serif font-bold text-xl mb-4">Certifications</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 border p-4 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full text-2xl">🌱</div>
              <div>
                <h4 className="font-bold text-gray-900">Certified Organic</h4>
                <p className="text-sm text-gray-500">NPOP & NOP Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border p-4 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full text-2xl">🛡️</div>
              <div>
                <h4 className="font-bold text-gray-900">FSSAI Compliant</h4>
                <p className="text-sm text-gray-500">Lic No. 1234567890</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-6 rounded-xl">
          <h3 className="font-serif font-bold text-xl mb-4">Lab Analysis Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Every batch is tested for 236 types of pesticides and heavy metals.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm py-2 border-b border-gray-200">
              <span>Pesticides</span>
              <span className="font-bold text-green-600">Not Detected</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-200">
              <span>Heavy Metals (Lead, Arsenic)</span>
              <span className="font-bold text-green-600">Below Limits</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-200">
              <span>Curcumin Content</span>
              <span className="font-bold text-gray-900">5.2% (High)</span>
            </div>
          </div>

          <button className="text-brand-primary text-sm font-bold flex items-center hover:underline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Batch Report (PDF)
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        * Tests conducted by Eurofins Analytical Services India Pvt Ltd.
      </div>
    </div>
  );
};

export default ProductCertificationTab;
