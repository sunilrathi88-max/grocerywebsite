import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../../types';
import { UniversalProductCard as ProductCard } from '../../../components/UniversalProductCard';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Thermometer,
  Truck,
  RotateCcw,
  Leaf,
  Flame,
  Box,
  Sparkles,
  FlaskConical,
  MapPin,
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

// Animated counter hook
function useCounter(target: number, duration: number = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const REDESIGN_CATEGORIES = [
  {
    id: 'powder',
    label: 'Spice Powders',
    desc: 'Finely cold-ground single-origin',
    icon: <Flame size={28} className="text-orange-400" />,
    bg: 'from-orange-950/70 to-orange-900/50',
    accent: '#FB923C',
    imgUrl: '/images/categories/powders.png',
  },
  {
    id: 'whole',
    label: 'Whole Spices',
    desc: 'Farm-sourced, handpicked',
    icon: <Leaf size={28} className="text-emerald-400" />,
    bg: 'from-emerald-950/70 to-emerald-900/50',
    accent: '#34D399',
    imgUrl: '/images/categories/whole.png',
  },
  {
    id: 'masala',
    label: 'Masala Blends',
    desc: 'Traditional recipes, pure ratios',
    icon: <Box size={28} className="text-amber-400" />,
    bg: 'from-amber-950/70 to-amber-900/50',
    accent: '#FCD34D',
    imgUrl: '/images/categories/masalas.png',
  },
  {
    id: 'specialty',
    label: 'Premium Range',
    desc: 'Saffron, rare & exotic varieties',
    icon: <Sparkles size={28} className="text-violet-400" />,
    bg: 'from-violet-950/70 to-violet-900/50',
    accent: '#A78BFA',
    imgUrl: '/images/categories/premium.png',
  },
];

const TRUST_ITEMS = [
  {
    icon: <Thermometer className="text-sky-400" size={28} />,
    title: 'Cold-ground <10°C',
    desc: '40% more volatile oils preserved vs hot-grinding. The science behind better aroma.',
    stat: '40%',
    statLabel: 'more aroma oils',
    accentColor: '#38BDF8',
  },
  {
    icon: <MapPin className="text-rose-400" size={28} />,
    title: 'Single-origin Only',
    desc: 'Salem turmeric. Mathania chilli. Ramganj Mandi coriander. Always named, never blended.',
    stat: '3',
    statLabel: 'premium origins',
    accentColor: '#FB7185',
  },
  {
    icon: <FlaskConical className="text-emerald-400" size={28} />,
    title: 'Lab-tested Purity',
    desc: 'Zero fillers, starch, or artificial coloring. Tested for heavy metals & pesticides.',
    stat: '0',
    statLabel: 'fillers or additives',
    accentColor: '#34D399',
  },
  {
    icon: <ShieldCheck className="text-amber-400" size={28} />,
    title: 'FSSAI Certified',
    desc: 'Full food safety compliance. License #12225025000253, verifiable on FSSAI portal.',
    stat: '60+',
    statLabel: 'years of trust',
    accentColor: '#FCD34D',
  },
];

// Stat counter component
function StatBadge({ value, label, color }: { value: string; label: string; color: string }) {
  const numericValue = parseInt(value.replace(/\D/g, ''), 10);
  const suffix = value.replace(/\d/g, '');
  const { count, ref } = useCounter(numericValue);
  return (
    <div className="mt-6 pt-5 border-t border-white/5">
      <span ref={ref} className="font-display text-3xl font-black" style={{ color }}>
        {count}
        {suffix}
      </span>
      <p className="text-stone-500 text-xs uppercase tracking-widest font-bold mt-1">{label}</p>
    </div>
  );
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const bestSellers = products
    .filter((p) => p.badge === 'Bestseller' || p.reviews.length > 5)
    .slice(0, 8);
  if (bestSellers.length === 0) bestSellers.push(...products.slice(0, 8));

  return (
    <div className="bg-[#FAF6F2] min-h-screen pb-20">
      {/* ─── HERO SECTION ─── */}
      <section
        className="relative overflow-hidden bg-[#130A04] text-white"
        style={{ minHeight: '92vh' }}
      >
        {/* Background image with grain overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero_pouch_refined.png"
            alt="Rathi Naturals Premium Packaging"
            className="w-full h-full object-cover opacity-40"
          />
          {/* Gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#130A04] via-[#130A04]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#130A04]/80 via-transparent to-[#130A04]/40" />
        </div>

        {/* Ambient glow blobs */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#B38B59]/10 rounded-full blur-[120px] z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-orange-900/20 rounded-full blur-[100px] z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center min-h-[92vh] py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#B38B59]/30 bg-[#B38B59]/10 backdrop-blur-sm mb-8"
            >
              <Star size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-stone-200">
                Trusted by 10,000+ Families · Est. 1965
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-8"
            >
              Pure Spices,{' '}
              <span className="block italic font-light" style={{ color: '#B38B59' }}>
                Cold-Ground.
              </span>
            </motion.h1>

            <motion.p
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-stone-400 mb-12 max-w-xl leading-relaxed"
            >
              Single-origin spices from Salem, Mathania & Ramganj Mandi. Ground below 10°C to
              preserve 40% more aromatic oils than conventional methods.
            </motion.p>

            <motion.div
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #B38B59 0%, #8C6D45 100%)',
                  boxShadow: '0 8px 32px rgba(179,139,89,0.35)',
                }}
              >
                Shop the Collection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-stone-300 border border-white/10 hover:border-[#B38B59]/40 hover:text-white backdrop-blur-sm transition-all"
              >
                Our 60-Year Heritage
              </Link>
            </motion.div>

            {/* Proof pillars */}
            <motion.div
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-16 flex flex-wrap gap-x-10 gap-y-3 opacity-60"
            >
              {[
                '❄️ Cold-ground <10°C',
                '✅ FSSAI 12225025000253',
                '🌿 Zero fillers',
                '📍 Single-origin',
              ].map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-bold tracking-[0.18em] uppercase text-stone-300"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAF6F2] to-transparent z-10" />
      </section>

      {/* ─── BENTO CATEGORY GRID ─── */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#FAF6F2]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-14"
            variants={FADE_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
              Shop by category
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#42210B]">
              What are you looking for?
            </h2>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {REDESIGN_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={`/shop?cat=${cat.id}`}
                  className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl aspect-[3/4] bg-[#1a0d04] border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}
                >
                  {/* Background Image with Layered Gradient */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={cat.imgUrl}
                      alt=""
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-110 duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${cat.bg} opacity-75`} />
                  </div>

                  {/* Ambient glow on hover */}
                  <div
                    className="absolute inset-0 z-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                    style={{
                      background: `radial-gradient(circle at 50% 80%, ${cat.accent}18 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon float */}
                  <div className="absolute top-6 left-6 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>

                  {/* Label */}
                  <div className="relative z-10 p-6">
                    <h3 className="font-display text-lg md:text-xl font-bold text-white mb-1">
                      {cat.label}
                    </h3>
                    <p className="text-[11px] uppercase tracking-widest font-bold text-stone-400 mb-4">
                      {cat.desc}
                    </p>
                    <div
                      className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all group-hover:gap-3"
                      style={{ color: cat.accent }}
                    >
                      Shop Now <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BESTSELLERS ─── */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-14">
            <motion.div
              variants={FADE_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
                Customer favorites
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#42210B]">
                Best Sellers
              </h2>
            </motion.div>
            <Link
              to="/shop"
              className="group flex items-center gap-2 text-[#B38B59] font-bold tracking-widest text-xs uppercase hover:text-[#42210B] transition-colors"
            >
              View All
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product, i) => (
              <motion.div
                key={product.id}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
              >
                <ProductCard product={product} onAddToCart={() => {}} onToggleWishlist={() => {}} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST GRID (WHY RATHI) ─── */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#0F0704]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={FADE_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-3 block">
              The difference that matters
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              Why Rathi Naturals?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="relative group p-8 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300 overflow-hidden"
              >
                {/* Glowing corner */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-[60px]"
                  style={{ background: item.accentColor, transform: 'translate(50%, -50%)' }}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  <StatBadge value={item.stat} label={item.statLabel} color={item.accentColor} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBSCRIPTION BANNER ─── */}
      <section className="px-4 md:px-8 py-12 md:py-16 bg-[#FAF6F2]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="relative rounded-[2.5rem] overflow-hidden"
            variants={FADE_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #42210B 0%, #2C1608 50%, #1a0d04 100%)',
            }}
          >
            {/* Animated grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Glow blobs */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#B38B59]/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-700/10 rounded-full blur-[80px]" />

            <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                  Monthly subscription
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-5">
                  Subscribe &amp; Save 10%
                </h2>
                <p className="text-stone-400 text-lg mb-8 max-w-md">
                  Monthly delivery of your favourite spices. Free express shipping. Flexible
                  schedules. Cancel anytime.
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  {[
                    { icon: <Truck size={16} />, text: 'Free Express Shipping' },
                    { icon: <RotateCcw size={16} />, text: 'Flexible Scheduling' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-stone-400">
                      <span className="text-[#B38B59]">{icon}</span>
                      <span className="text-xs font-bold uppercase tracking-widest">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/subscription"
                className="shrink-0 group flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white transition-all hover:scale-[1.04] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #B38B59, #8C6D45)',
                  boxShadow: '0 12px 40px rgba(179,139,89,0.4)',
                }}
              >
                Set Up Subscription
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
