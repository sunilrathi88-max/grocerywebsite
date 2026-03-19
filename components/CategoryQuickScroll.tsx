import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'Spices', label: 'Spices', icon: '🌶️' },
  { id: 'Nuts', label: 'Nuts', icon: '🥜' },
  { id: 'Tea', label: 'Teas', icon: '☕' },
  { id: 'Saffron', label: 'Saffron', icon: '✨' },
  { id: 'Offers', label: 'Offers', icon: '🏷️' },
  { id: 'Gifts', label: 'Gifts', icon: '🎁' },
];

const CategoryQuickScroll: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden w-full overflow-x-auto pb-4 pt-2 no-scrollbar px-4">
      <div className="flex gap-3 min-w-max">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(cat.id === 'Offers' ? '/offers' : `/category/${cat.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium whitespace-nowrap active:bg-white/20 transition-all"
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryQuickScroll;
