import React from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';

interface ComparisonModalProps {
  items: Product[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ items, onClose }) => {
    
  const getAverageRating = (product: Product) => {
    if (product.reviews.length === 0) return { avg: 0, count: 0 };
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return { avg: total / product.reviews.length, count: product.reviews.length };
  };
  
  const features = [
    { name: 'Price', getValue: (p: Product) => `$${(p.variants[0].salePrice ?? p.variants[0].price).toFixed(2)}` },
    { name: 'Rating', getValue: (p: Product) => {
        const rating = getAverageRating(p);
        if (rating.count === 0) return <span className="text-gray-400">N/A</span>;
        return (
            <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span>{rating.avg.toFixed(1)} ({rating.count})</span>
            </div>
        );
    }},
    { name: 'Stock', getValue: (p: Product) => {
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
        return totalStock > 0 
            ? <span className="text-green-600 font-bold">In Stock</span> 
            : <span className="text-red-500 font-bold">Out of Stock</span>;
    }},
    { name: 'Category', getValue: (p: Product) => p.category },
    { name: 'Origin', getValue: (p: Product) => p.origin || 'N/A' },
    { name: 'Tags', getValue: (p: Product) => (p.tags || []).join(', ') || 'None' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-serif font-bold text-brand-dark">Compare Products</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr>
                <th className="p-4 font-bold w-1/5">Feature</th>
                {items.map(item => (
                  <th key={item.id} className="p-4 text-center">
                    <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover mx-auto rounded-md" />
                    <p className="font-bold mt-2 text-brand-dark">{item.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {features.map(feature => (
                <tr key={feature.name} className="hover:bg-brand-secondary/20">
                  <td className="p-4 font-semibold text-gray-600">{feature.name}</td>
                  {items.map(item => (
                    <td key={item.id} className="p-4 text-center">
                      {feature.getValue(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ComparisonModal;
