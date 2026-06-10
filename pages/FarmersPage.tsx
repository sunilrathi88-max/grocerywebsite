import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FARMERS } from '../data/farmers';
import { OptimizedImage } from '../components/OptimizedImage';
import { motion } from 'framer-motion';
import { MapPin, Leaf, ArrowRight, Sprout } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const FarmersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF6F2] min-h-screen pb-24">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-[#0F0704] text-white py-32 px-4">
        {/* Background image with grain overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero_pouch_refined.png"
            alt="Farmers Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0704] via-[#0F0704]/70 to-transparent" />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#B38B59]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-700/30 bg-emerald-900/20 mb-8"
          >
            <Sprout size={13} className="text-emerald-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300">
              Know Your Grower
            </span>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-8"
          >
            Hand-Harvested.{' '}
            <span className="italic font-light" style={{ color: '#B38B59' }}>
              Heart-Felt.
            </span>
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed"
          >
            We don&apos;t buy from middlemen. We partner directly with farmers who treat their land
            like gold. Meet the hands that feed you.
          </motion.p>
        </div>
      </section>

      {/* ─── STATS STRIPE ─── */}
      <div className="bg-[#42210B]">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          {[
            { value: '6', label: 'Partner Farms' },
            { value: '60+', label: 'Years Tradition' },
            { value: '100%', label: 'Direct Trade' },
            { value: '3', label: 'Growing Regions' },
          ].map(({ value, label }) => (
            <div key={label} className="px-8 py-2 text-center">
              <div className="font-display text-3xl font-black text-[#B38B59]">{value}</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FARMERS GRID ─── */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
              Our Partners
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#42210B]">
              The Hands Behind Every Jar
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FARMERS.map((farmer, i) => (
              <motion.div
                key={farmer.id}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-2xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={farmer.image}
                    alt={farmer.name}
                    type="card"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0704]/85 via-black/20 to-transparent" />

                  {/* Name on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl font-black text-white mb-1">
                      {farmer.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-stone-300">
                      <MapPin size={12} />
                      <span className="text-xs font-bold">{farmer.location}</span>
                    </div>
                  </div>

                  {/* Since badge */}
                  <div className="absolute top-4 right-4 bg-[#B38B59] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Since {farmer.farmingSince}
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      Specialty: {farmer.specialty}
                    </span>
                  </div>

                  <blockquote className="text-stone-600 text-sm leading-relaxed italic mb-5 pl-4 border-l-2 border-[#B38B59]/40">
                    &ldquo;{farmer.quote}&rdquo;
                  </blockquote>

                  <p className="text-stone-500 text-sm leading-relaxed mb-6">{farmer.bio}</p>

                  {/* Crops */}
                  <div className="pt-5 border-t border-stone-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">
                      Grower of:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {farmer.crops.map((crop) => (
                        <span
                          key={crop}
                          className="text-[11px] font-bold bg-[#FAF6F2] text-stone-600 px-3 py-1 rounded-full border border-stone-200"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center"
            style={{ background: 'linear-gradient(135deg, #0F0704 0%, #2C1608 60%, #42210B 100%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#B38B59]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[#B38B59] font-black uppercase tracking-[0.3em] text-xs mb-4 block">
                Direct Trade
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-6">
                Taste the Difference
              </h2>
              <p className="text-stone-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                When you buy from Rathi Naturals, 100% of the fair-trade premium goes directly to
                these families. Every purchase matters.
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-base text-white transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                  boxShadow: '0 12px 40px rgba(179,139,89,0.35)',
                }}
              >
                Shop Our Spices
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FarmersPage;
