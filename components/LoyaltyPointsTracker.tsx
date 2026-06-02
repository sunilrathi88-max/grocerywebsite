import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Truck,
  ShoppingBag,
  Star,
  Zap,
  Crown,
  Award,
  ChevronRight,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { BadgeCollection } from './BadgeCollection';
import toast from 'react-hot-toast';
import { useLoyaltyStore } from '../store/loyaltyStore';

const TIER_CONFIG = {
  Bronze: {
    gradient: 'from-amber-800 to-amber-600',
    glow: 'rgba(180,83,9,0.3)',
    icon: <Award size={20} />,
    color: '#D97706',
  },
  Silver: {
    gradient: 'from-slate-500 to-slate-400',
    glow: 'rgba(100,116,139,0.3)',
    icon: <Star size={20} />,
    color: '#94A3B8',
  },
  Gold: {
    gradient: 'from-yellow-600 to-amber-400',
    glow: 'rgba(234,179,8,0.35)',
    icon: <Crown size={20} />,
    color: '#EAB308',
  },
  Platinum: {
    gradient: 'from-purple-700 to-violet-500',
    glow: 'rgba(139,92,246,0.35)',
    icon: <Zap size={20} />,
    color: '#8B5CF6',
  },
};

const TIER_BENEFITS = {
  Bronze: ['1 point per ₹1 spent', 'Birthday reward', 'Exclusive sale access'],
  Silver: ['1.5 points per ₹1', 'Free shipping always', 'Early product access', 'Birthday reward'],
  Gold: ['2 points per ₹1', 'Priority support', 'Free shipping', 'Early access', 'Surprise gifts'],
  Platinum: ['2.5 points per ₹1', 'VIP events', 'Priority support', 'Personal shopper'],
};

const REDEEM_OPTIONS = [
  { points: 500, reward: '₹50 Off', icon: ShoppingBag, desc: 'Discount on any order' },
  { points: 1000, reward: '₹100 Off + Free Ship', icon: Truck, desc: 'Includes free delivery' },
  { points: 2000, reward: '₹250 Off + Free Ship', icon: Gift, desc: 'Best value redemption' },
];

const FADE = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export const LoyaltyPointsTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'points' | 'badges'>('points');
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmingReward, setConfirmingReward] = useState<{
    points: number;
    reward: string;
  } | null>(null);
  const { points, history, redeemPoints } = useLoyaltyStore();

  const tier = TIER_CONFIG[points.tier];
  const progress = Math.min((points.lifetime / points.nextTierPoints) * 100, 100);
  const nextTier =
    points.tier === 'Bronze' ? 'Silver' : points.tier === 'Silver' ? 'Gold' : 'Platinum';

  const handleRedeem = (amount: number, reward: string) => {
    setConfirmingReward({ points: amount, reward });
  };

  const confirmRedeem = () => {
    if (!confirmingReward) return;
    const prefix = confirmingReward.reward.includes('Free Ship') ? 'FREESHIP' : 'SAVE';
    const code = `${prefix}-${Math.floor(Math.random() * 10000)}`;
    const success = redeemPoints(confirmingReward.points, confirmingReward.reward);
    if (success) {
      setRedeemedCode(code);
      toast.success(`Redeemed! Your code: ${code}`);
    } else {
      toast.error('Not enough points.');
    }
    setConfirmingReward(null);
  };

  const copyCode = () => {
    if (!redeemedCode) return;
    navigator.clipboard.writeText(redeemedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Confirm Redeem Modal */}
      <AnimatePresence>
        {confirmingReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0F0704] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#B38B59]/10 flex items-center justify-center mx-auto mb-5">
                <Gift size={28} className="text-[#B38B59]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Confirm Redemption
              </h3>
              <p className="text-stone-400 text-sm mb-2">You're redeeming</p>
              <p className="font-black text-[#B38B59] text-xl mb-1">{confirmingReward.reward}</p>
              <p className="text-stone-500 text-sm mb-8">
                for <strong className="text-white">{confirmingReward.points}</strong> points
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmingReward(null)}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-stone-400 text-sm font-bold hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedeem}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                    boxShadow: '0 4px 20px rgba(179,139,89,0.35)',
                  }}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redemption Success Banner */}
      <AnimatePresence>
        {redeemedCode && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center justify-between gap-4 bg-emerald-950/50 border border-emerald-700/40 rounded-2xl px-6 py-4"
          >
            <div>
              <p className="font-bold text-emerald-400 text-sm mb-1">🎉 Reward Unlocked!</p>
              <p className="text-stone-400 text-sm">
                Use code{' '}
                <span className="font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-lg font-black text-white select-all">
                  {redeemedCode}
                </span>{' '}
                at checkout
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800/40 text-emerald-300 text-xs font-bold uppercase tracking-widest hover:bg-emerald-800/60 transition-colors"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setRedeemedCode(null)}
                className="text-stone-500 hover:text-stone-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl w-fit">
        {(['points', 'badges'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-6 py-2.5 rounded-xl text-sm font-bold transition-colors capitalize"
            style={{ color: activeTab === tab ? '#42210B' : 'rgba(255,255,255,0.4)' }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tabBg"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg,#B38B59,#8C6D45)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative z-10">
              {tab === 'points' ? 'Loyalty Points' : 'Achievements & Badges'}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'points' ? (
        <div className="space-y-6">
          {/* Points Hero Card */}
          <motion.div
            variants={FADE}
            initial="hidden"
            animate="visible"
            className="relative rounded-3xl overflow-hidden p-8 md:p-10"
            style={{
              background: `linear-gradient(135deg, #1a0d04 0%, #2C1608 100%)`,
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `0 20px 60px ${tier.glow}`,
            }}
          >
            {/* Glow blob */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-30 pointer-events-none"
              style={{ background: tier.color, transform: 'translate(40%,-40%)' }}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${tier.color}20`, color: tier.color }}
                  >
                    {tier.icon}
                  </div>
                  <span
                    className="font-black text-sm uppercase tracking-[0.2em]"
                    style={{ color: tier.color }}
                  >
                    {points.tier} Member
                  </span>
                </div>
                <div className="font-display text-5xl md:text-6xl font-black text-white mb-1">
                  {points.current.toLocaleString()}
                  <span className="text-2xl text-stone-500 font-bold ml-3">pts</span>
                </div>
                <p className="text-stone-500 text-sm">
                  Lifetime: {points.lifetime.toLocaleString()} points
                </p>
              </div>

              {/* Progress to next tier */}
              <div className="w-full md:w-72">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                    Progress to {nextTier}
                  </span>
                  <span className="text-xs font-black" style={{ color: tier.color }}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(90deg, ${tier.color}, ${tier.color}aa)` }}
                  />
                </div>
                <p className="text-stone-600 text-xs mt-2">
                  {points.nextTierPoints - points.lifetime} more points to {nextTier}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Redeem Options */}
          <div className="bg-[#FAF6F2] rounded-3xl p-8">
            <h3 className="font-display text-xl font-bold text-[#42210B] mb-6 flex items-center gap-2">
              <Gift size={20} className="text-[#B38B59]" />
              Redeem Your Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REDEEM_OPTIONS.map((opt, i) => {
                const Icon = opt.icon;
                const canRedeem = points.current >= opt.points;
                return (
                  <motion.div
                    key={i}
                    variants={FADE}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="relative rounded-2xl border-2 overflow-hidden transition-all duration-300"
                    style={{
                      borderColor: canRedeem ? '#B38B59' : '#E7E5E4',
                      opacity: canRedeem ? 1 : 0.65,
                    }}
                  >
                    <div className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#B38B59]/10 flex items-center justify-center mx-auto mb-4">
                        <Icon size={24} className="text-[#B38B59]" />
                      </div>
                      <p className="font-display text-xl font-black text-[#42210B] mb-1">
                        {opt.reward}
                      </p>
                      <p className="text-stone-500 text-xs mb-1">{opt.desc}</p>
                      <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-5">
                        {opt.points} points
                      </p>
                      <button
                        onClick={() => canRedeem && handleRedeem(opt.points, opt.reward)}
                        disabled={!canRedeem}
                        className="w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
                        style={{
                          background: canRedeem
                            ? 'linear-gradient(135deg,#B38B59,#8C6D45)'
                            : '#E7E5E4',
                          color: canRedeem ? 'white' : '#A8A29E',
                          cursor: canRedeem ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="bg-white rounded-3xl border border-stone-100 p-8">
            <h3 className="font-display text-xl font-bold text-[#42210B] mb-6">
              Your {points.tier} Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TIER_BENEFITS[points.tier].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: tier.color }}
                  />
                  <span className="text-sm font-medium text-stone-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white rounded-3xl border border-stone-100 p-8">
            <h3 className="font-display text-xl font-bold text-[#42210B] mb-6">Points History</h3>
            {history.length === 0 ? (
              <div className="text-center py-10 text-stone-400">
                <Star size={32} className="mx-auto mb-2 text-stone-200" />
                <p className="text-sm font-medium">
                  No history yet. Start shopping to earn points!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-stone-800 text-sm">{item.description}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {new Date(item.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="font-black text-base"
                        style={{ color: item.type === 'earned' ? '#22C55E' : '#EF4444' }}
                      >
                        {item.points > 0 ? '+' : ''}
                        {item.points}
                      </span>
                      <ChevronRight size={14} className="text-stone-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <BadgeCollection />
      )}
    </div>
  );
};

export default LoyaltyPointsTracker;
