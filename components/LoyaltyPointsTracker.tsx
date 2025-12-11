import React, { useState, useEffect } from 'react';
import { GiftIcon } from './icons/GiftIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { TruckIcon } from './icons/TruckIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';

interface LoyaltyPoints {
  current: number;
  lifetime: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
}

interface PointsHistory {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

export const LoyaltyPointsTracker: React.FC = () => {
  const [points, setPoints] = useState<LoyaltyPoints>(() => {
    const saved = localStorage.getItem('tattva_loyalty_points');
    return saved
      ? JSON.parse(saved)
      : {
          current: 1250,
          lifetime: 3800,
          tier: 'Silver',
          nextTierPoints: 5000,
        };
  });

  const [history, setHistory] = useState<PointsHistory[]>(() => {
    const saved = localStorage.getItem('tattva_loyalty_history');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            date: '2024-01-15',
            description: 'Purchase #1234',
            points: 150,
            type: 'earned',
          },
          {
            id: '2',
            date: '2024-01-10',
            description: 'Product Review',
            points: 50,
            type: 'earned',
          },
          {
            id: '4',
            date: '2024-01-05',
            description: 'Purchase #1233',
            points: 220,
            type: 'earned',
          },
          {
            id: '5',
            date: '2024-01-01',
            description: 'Welcome Bonus',
            points: 100,
            type: 'earned',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('tattva_loyalty_points', JSON.stringify(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('tattva_loyalty_history', JSON.stringify(history));
  }, [history]);

  const handleRedeem = (amount: number, reward: string) => {
    if (points.current >= amount) {
      const newPoints = { ...points, current: points.current - amount };
      setPoints(newPoints);

      const newHistoryItem: PointsHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        description: `Redeemed: ${reward}`,
        points: -amount,
        type: 'redeemed',
      };
      setHistory([newHistoryItem, ...history]);
      alert(`Successfully redeemed ${reward}!`);
    }
  };

  const progressToNextTier = ((points.lifetime / points.nextTierPoints) * 100).toFixed(1);

  const tierColors = {
    Bronze: 'from-amber-600 to-amber-400',
    Silver: 'from-gray-400 to-gray-200',
    Gold: 'from-yellow-500 to-yellow-300',
    Platinum: 'from-purple-600 to-purple-400',
  };

  const tierBenefits = {
    Bronze: ['1 point per $1', 'Birthday reward', 'Exclusive sales'],
    Silver: ['1.5 points per $1', 'Free shipping', 'Early access', 'Birthday reward'],
    Gold: [
      '2 points per $1',
      'Priority support',
      'Free shipping',
      'Early access',
      'Surprise gifts',
    ],
    Platinum: [
      '2.5 points per $1',
      'VIP events',
      'Priority support',
      'Free shipping',
      'Personal shopper',
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Points Overview Card */}
      <div
        className={`bg-gradient-to-br ${tierColors[points.tier]} text-white rounded-2xl p-8 shadow-xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-1">{points.current.toLocaleString()} Points</h2>
            <p className="text-white/80 text-sm">
              Lifetime: {points.lifetime.toLocaleString()} points
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <SparklesIcon className="w-6 h-6 inline mr-2" />
            <span className="font-bold text-lg">{points.tier}</span>
          </div>
        </div>

        {/* Progress to Next Tier */}
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>
              Progress to{' '}
              {points.tier === 'Bronze' ? 'Silver' : points.tier === 'Silver' ? 'Gold' : 'Platinum'}
            </span>
            <span>{progressToNextTier}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progressToNextTier}%` }}
            />
          </div>
          <p className="text-white/80 text-xs mt-2">
            {points.nextTierPoints - points.lifetime} points to next tier
          </p>
        </div>
      </div>

      {/* Redeem Points Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <GiftIcon className="w-6 h-6 mr-2 text-brand-primary" />
          Redeem Your Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RedeemOption
            points={500}
            reward="$5 Off"
            available={points.current >= 500}
            icon={<ShoppingBagIcon className="w-8 h-8 text-brand-primary" />}
            onRedeem={() => handleRedeem(500, '$5 Off')}
          />
          <RedeemOption
            points={1000}
            reward="$10 Off + Free Shipping"
            available={points.current >= 1000}
            icon={<TruckIcon className="w-8 h-8 text-brand-primary" />}
            onRedeem={() => handleRedeem(1000, '$10 Off + Free Shipping')}
          />
          <RedeemOption
            points={2000}
            reward="$25 Off + Free Shipping"
            available={points.current >= 2000}
            icon={<GiftIcon className="w-8 h-8 text-brand-primary" />}
            onRedeem={() => handleRedeem(2000, '$25 Off + Free Shipping')}
          />
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your {points.tier} Benefits</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tierBenefits[points.tier].map((benefit, index) => (
            <li key={index} className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-brand-primary rounded-full mr-3" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Points History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Points History</h3>
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{item.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div
                className={`font-bold ${
                  item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.points > 0 ? '+' : ''}
                {item.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface RedeemOptionProps {
  points: number;
  reward: string;
  available: boolean;
  icon: React.ReactNode;
  onRedeem?: () => void;
}

const RedeemOption: React.FC<RedeemOptionProps> = ({
  points,
  reward,
  available,
  icon,
  onRedeem,
}) => {
  return (
    <div
      className={`border-2 rounded-lg p-4 text-center transition-all ${
        available
          ? 'border-brand-primary hover:shadow-lg cursor-pointer'
          : 'border-gray-200 opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="font-bold text-lg text-gray-900 mb-1">{reward}</p>
      <p className="text-sm text-gray-600 mb-3">{points} points</p>
      <button
        onClick={() => onRedeem?.()}
        disabled={!available}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          available
            ? 'bg-brand-primary text-white hover:bg-brand-dark'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        {available ? 'Redeem' : 'Not Available'}
      </button>
    </div>
  );
};
