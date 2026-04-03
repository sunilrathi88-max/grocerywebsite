import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../../types';
import { UniversalProductCard as ProductCard } from '../../../components/UniversalProductCard';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Leaf,
  Flame,
  Box,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
}

const REDESIGN_CATEGORIES = [
  { id: 'powder', label: 'Powders', icon: <Flame size={24} className="text-orange-500" /> },
  { id: 'whole', label: 'Whole spices', icon: <Leaf size={24} className="text-green-600" /> },
  { id: 'masala', label: 'Masalas', icon: <Box size={24} className="text-amber-700" /> },
  { id: 'specialty', label: 'Specialty', icon: <Sparkles size={24} className="text-yellow-500" /> },
];

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const bestSellers = products
    .filter((p) => p.badge === 'Bestseller' || p.reviews.length > 5)
    .slice(0, 8);
  if (bestSellers.length === 0) bestSellers.push(...products.slice(0, 8));

  return (
    <div className="bg-[#FAF6F2] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#42210B] text-white py-20 px-4 md:py-32">
        {/* Real life background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_spices_lifestyle_1774245721165.png"
            alt="Premium Spices Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#42210B] via-[#42210B]/80 to-transparent" />
        </div>

        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B38B59]/10 rounded-full blur-3xl -mr-48 -mt-48 z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Trusted by 10,000+ Families Since 1965
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-7xl font-bold mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Pure Spices, <span className="text-[#B38B59] italic">Cold-Ground</span>.
          </h1>

          <p className="text-lg md:text-xl text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Single-origin spices from Salem, Mathania & Ramganj Mandi. Cold-ground below 10°C to
            preserve 40% more aromatic oils.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-450">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-[#B38B59] hover:bg-[#8C6D45] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              EXPLORE SHOP
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg transition-all"
            >
              OUR HERITAGE
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-70">
            {[
              '❄️ Cold-ground <10°C',
              '✅ FSSAI Certified',
              '🌿 Zero fillers',
              '📍 Single-origin',
            ].map((t, i) => (
              <span key={i} className="text-sm font-bold tracking-wider">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Toolbar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 md:top-16 z-40 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar py-4">
          <div className="flex items-center justify-center md:justify-center gap-8 md:gap-16">
            {REDESIGN_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?cat=${cat.id}`}
                className="group flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#FAF6F2] border border-stone-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#B38B59]/10 group-hover:border-[#B38B59]/20 transition-all shadow-sm">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest group-hover:text-[#42210B] transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Grid */}
      <section className="py-20 px-4 bg-[#FAF6F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                Difference that matters
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-[#42210B]">
                Why Rathi Naturals?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="text-[#B38B59]" />,
                title: 'Cold-ground <10°C',
                desc: '40% more volatile oils preserved vs hot-grinding. The science behind better aroma.',
              },
              {
                icon: <ShieldCheck className="text-[#B38B59]" />,
                title: 'Single-origin only',
                desc: 'Salem turmeric. Mathania chilli. Ramganj Mandi coriander. Always named, never blended.',
              },
              {
                icon: <Zap className="text-[#B38B59]" />,
                title: 'Total Purity',
                desc: 'Zero fillers, starch, or artificial coloring. Lab-tested for heavy metals & pesticides.',
              },
              {
                icon: <ShieldCheck className="text-[#B38B59]" />,
                title: 'FSSAI Certified',
                desc: 'Full compliance with food safety standards. Verification available on FSSAI portal.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#B38B59]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-[#42210B]">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                Customer favorites
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-[#42210B]">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="group flex items-center gap-2 text-[#B38B59] font-bold tracking-widest text-xs uppercase hover:text-[#42210B] transition-colors"
            >
              View All{' '}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {
                  /* Handled by card logic */
                }}
                onToggleWishlist={() => {
                  /* Handled by card logic */
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="px-4 py-20 bg-[#FAF6F2]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#42210B] rounded-[2rem] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B38B59]/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="flex-1 relative z-10 text-center md:text-left">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
                Subscribe & Save 10%
              </h2>
              <p className="text-stone-300 text-lg md:text-xl font-medium mb-8 max-w-xl">
                Monthly delivery of your favourite spices. Free shipping. Cancel anytime.
              </p>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-3">
                  <Truck className="text-[#B38B59]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Free Express Shipping
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="text-[#B38B59]" size={20} />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Flexible Scheduling
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/subscription"
              className="relative z-10 bg-[#B38B59] hover:bg-[#8C6D45] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shrink-0 transition-all hover:scale-105 active:scale-95"
            >
              SET UP SUBSCRIPTION
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
