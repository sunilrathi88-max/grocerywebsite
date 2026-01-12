import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoyaltyPoints {
  current: number;
  lifetime: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
}

export interface PointsHistory {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

interface LoyaltyState {
  points: LoyaltyPoints;
  history: PointsHistory[];

  // Actions
  addPoints: (amount: number, reason: string) => void;
  redeemPoints: (amount: number, reward: string) => boolean; // Returns true if successful
  calculateTier: () => void;
}

const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 2000,
  Gold: 5000,
  Platinum: 10000,
};

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      points: {
        current: 1250,
        lifetime: 3800,
        tier: 'Silver',
        nextTierPoints: 5000,
      },
      history: [
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
      ],

      addPoints: (amount, reason) => {
        set((state) => {
          const newCurrent = state.points.current + amount;
          const newLifetime = state.points.lifetime + amount;

          let tier: LoyaltyPoints['tier'] = state.points.tier;
          let nextTierPoints = state.points.nextTierPoints;

          // Simple tier calculation logic
          if (newLifetime >= TIER_THRESHOLDS.Platinum) {
            tier = 'Platinum';
            nextTierPoints = Infinity;
          } else if (newLifetime >= TIER_THRESHOLDS.Gold) {
            tier = 'Gold';
            nextTierPoints = TIER_THRESHOLDS.Platinum;
          } else if (newLifetime >= TIER_THRESHOLDS.Silver) {
            tier = 'Silver';
            nextTierPoints = TIER_THRESHOLDS.Gold;
          } else {
            tier = 'Bronze';
            nextTierPoints = TIER_THRESHOLDS.Silver;
          }

          const newHistoryItem: PointsHistory = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            description: reason,
            points: amount,
            type: 'earned',
          };

          return {
            points: {
              current: newCurrent,
              lifetime: newLifetime,
              tier,
              nextTierPoints,
            },
            history: [newHistoryItem, ...state.history],
          };
        });
      },

      redeemPoints: (amount, reward) => {
        const state = get();
        if (state.points.current < amount) return false;

        set((state) => {
          const newHistoryItem: PointsHistory = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            description: `Redeemed: ${reward}`,
            points: -amount,
            type: 'redeemed',
          };

          return {
            points: {
              ...state.points,
              current: state.points.current - amount,
            },
            history: [newHistoryItem, ...state.history],
          };
        });
        return true;
      },

      calculateTier: () => {
        // Logic already embedded in addPoints, but could be separate
      },
    }),
    {
      name: 'tattva_loyalty_store',
    }
  )
);
