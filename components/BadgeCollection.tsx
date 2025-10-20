import React, { useState } from 'react';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { StarIcon } from './icons/StarIcon';
import { HeartIcon } from './icons/HeartIcon';
import { LeafIcon } from './icons/LeafIcon';
import { GiftIcon } from './icons/GiftIcon';
import { UsersIcon } from './icons/UsersIcon';
import { TruckIcon } from './icons/TruckIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt?: string;
  progress?: number;
  requirement: number;
  category: 'purchase' | 'social' | 'seasonal' | 'special';
}

export const BadgeCollection: React.FC = () => {
  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'First Purchase',
      description: 'Complete your first order',
      icon: <ShoppingBagIcon className="w-8 h-8" />,
      unlockedAt: '2024-01-01',
      progress: 1,
      requirement: 1,
      category: 'purchase',
    },
    {
      id: '2',
      name: 'Spice Explorer',
      description: 'Try 10 different spices',
      icon: <LeafIcon className="w-8 h-8" />,
      unlockedAt: '2024-01-15',
      progress: 10,
      requirement: 10,
      category: 'purchase',
    },
    {
      id: '3',
      name: 'Review Master',
      description: 'Write 5 product reviews',
      icon: <StarIcon className="w-8 h-8" />,
      unlockedAt: '2024-01-10',
      progress: 5,
      requirement: 5,
      category: 'social',
    },
    {
      id: '4',
      name: 'Loyal Customer',
      description: 'Complete 20 orders',
      icon: <HeartIcon className="w-8 h-8" />,
      progress: 12,
      requirement: 20,
      category: 'purchase',
    },
    {
      id: '5',
      name: 'Gift Giver',
      description: 'Send 3 gift orders',
      icon: <GiftIcon className="w-8 h-8" />,
      progress: 1,
      requirement: 3,
      category: 'special',
    },
    {
      id: '6',
      name: 'Community Builder',
      description: 'Refer 5 friends',
      icon: <UsersIcon className="w-8 h-8" />,
      progress: 2,
      requirement: 5,
      category: 'social',
    },
    {
      id: '7',
      name: 'Speed Shopper',
      description: 'Order with express shipping 10 times',
      icon: <TruckIcon className="w-8 h-8" />,
      progress: 0,
      requirement: 10,
      category: 'purchase',
    },
    {
      id: '8',
      name: 'Premium Member',
      description: 'Reach Gold tier',
      icon: <SparklesIcon className="w-8 h-8" />,
      progress: 0,
      requirement: 1,
      category: 'special',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter((badge) => badge.category === selectedCategory);

  const unlockedCount = badges.filter((b) => b.unlockedAt).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-primary to-amber-500 text-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Badge Collection</h2>
        <p className="text-white/90 mb-4">
          Unlock badges by shopping, reviewing, and engaging with our community
        </p>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-2xl font-bold">{unlockedCount}</span>
            <span className="text-white/80 text-sm ml-1">/ {badges.length} Unlocked</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 flex-1 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterButton
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
          label="All Badges"
          count={badges.length}
        />
        <FilterButton
          active={selectedCategory === 'purchase'}
          onClick={() => setSelectedCategory('purchase')}
          label="Purchase"
          count={badges.filter((b) => b.category === 'purchase').length}
        />
        <FilterButton
          active={selectedCategory === 'social'}
          onClick={() => setSelectedCategory('social')}
          label="Social"
          count={badges.filter((b) => b.category === 'social').length}
        />
        <FilterButton
          active={selectedCategory === 'seasonal'}
          onClick={() => setSelectedCategory('seasonal')}
          label="Seasonal"
          count={badges.filter((b) => b.category === 'seasonal').length}
        />
        <FilterButton
          active={selectedCategory === 'special'}
          onClick={() => setSelectedCategory('special')}
          label="Special"
          count={badges.filter((b) => b.category === 'special').length}
        />
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBadges.map((badge, index) => (
          <BadgeCard key={badge.id} badge={badge} index={index} />
        ))}
      </div>
    </div>
  );
};

interface BadgeCardProps {
  badge: Badge;
  index: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, index }) => {
  const isUnlocked = !!badge.unlockedAt;
  const progress = badge.progress || 0;
  const progressPercent = ((progress / badge.requirement) * 100).toFixed(0);

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up stagger-${(index % 6) + 1} ${
        !isUnlocked && 'opacity-75'
      }`}
    >
      {/* Badge Icon */}
      <div
        className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all ${
          isUnlocked
            ? 'bg-gradient-to-br from-brand-primary to-amber-500 text-white shadow-lg animate-pulse-glow'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        {badge.icon}
      </div>

      {/* Badge Name */}
      <h3 className="text-lg font-bold text-center mb-2 text-gray-900">{badge.name}</h3>

      {/* Badge Description */}
      <p className="text-sm text-gray-600 text-center mb-4">{badge.description}</p>

      {/* Progress or Unlock Date */}
      {isUnlocked ? (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            <StarIcon className="w-4 h-4" />
            Unlocked {new Date(badge.unlockedAt!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {progress} / {badge.requirement}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-primary to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({ active, onClick, label, count }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
        active
          ? 'bg-gradient-to-r from-brand-primary to-amber-500 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label} <span className="opacity-75">({count})</span>
    </button>
  );
};
