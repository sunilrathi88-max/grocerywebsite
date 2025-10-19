import React from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';

interface ComparisonBarProps {
  items: Product[];
  onRemove: (product: Product) => void;
  onClear: () => void;
  onCompare: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ items, onRemove, onClear, onCompare }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-dark text-white p-4 shadow-lg-top z-40 animate-slide-up">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow">
          <h4 className="font-bold text-lg hidden sm:block">Compare Products ({items.length}/4)</h4>
          <div className="flex items-center gap-3">
            {items.map(item => (
              <div key={item.id} className="relative">
                <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-md" loading="lazy" onError={(e) => { const t = e.target as HTMLImageElement; t.src = 'https://via.placeholder.com/48x48/F8E3D9/333333?text=Img'; }} />
                <button 
                  onClick={() => onRemove(item)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  aria-label={`Remove ${item.name} from comparison`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
             {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="w-12 h-12 bg-gray-700 rounded-md border-2 border-dashed border-gray-500 hidden sm:block"></div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
           <button 
            onClick={onCompare} 
            disabled={items.length < 2}
            className="bg-brand-primary font-bold py-2 px-6 rounded-full shadow-md hover:bg-opacity-90 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Compare
          </button>
           <button onClick={onClear} className="text-sm text-gray-300 hover:text-white">Clear all</button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .shadow-lg-top { box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1); }
      `}</style>
    </div>
  );
};

export default ComparisonBar;
