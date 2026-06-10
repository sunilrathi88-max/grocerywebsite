import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Product, BlogPost } from '../../../types';
import { UniversalProductCard as ProductCard } from '../../../components/UniversalProductCard';
import BlogPostCard from '../../../components/BlogPostCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Search,
  Flame,
  Leaf,
  Box,
  Sparkles,
  LayoutGrid,
  FileText,
  ChevronDown,
  SortAsc,
  X,
  MapPin,
  ShoppingCart,
  ChevronUp,
  Minus,
  Plus,
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

interface ShopPageProps {
  products: Product[];
  posts: BlogPost[];
}

const REDESIGN_CATEGORIES = [
  { id: 'all', label: 'All', icon: <LayoutGrid size={15} /> },
  { id: 'powder', label: 'Powders', icon: <Flame size={15} /> },
  { id: 'whole', label: 'Whole', icon: <Leaf size={15} /> },
  { id: 'masala', label: 'Masalas', icon: <Box size={15} /> },
  { id: 'specialty', label: 'Specialty', icon: <Sparkles size={15} /> },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

const FILTER_CHIPS = ['Organic', 'Bestseller', 'Single origin', 'Under ₹500', 'Whole spice'];

const FREE_DELIVERY_THRESHOLD = 1000;

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ShopPage: React.FC<ShopPageProps> = ({ products, posts }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initCat = params.get('cat') || 'all';
  const initQ = params.get('q') || '';

  const [activeCat, setActiveCat] = useState(initCat);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(initQ);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { cartItemCount, subtotal, cartItems, updateQuantity } = useCart();

  const amountToFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  React.useEffect(() => {
    setActiveCat(params.get('cat') || 'all');
    setSearchQuery(params.get('q') || '');
  }, [params]);

  // Close drawer on outside tap
  React.useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && !drawer.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const filteredResults = useMemo(() => {
    return products
      .filter((p) => {
        if (activeCat === 'all') return true;
        const pCat = p.category.toLowerCase();
        const pName = p.name.toLowerCase();
        const pGrind = (p.grind || '').toLowerCase();
        const aCatLower = activeCat.toLowerCase();
        if (aCatLower === 'powder')
          return pCat.includes('powder') || pName.includes('powder') || pGrind.includes('powder');
        if (aCatLower === 'whole')
          return pCat.includes('whole') || pName.includes('whole') || pGrind.includes('whole');
        if (aCatLower === 'masala')
          return (
            pCat.includes('masala') ||
            pCat.includes('blend') ||
            pName.includes('masala') ||
            pName.includes('blend')
          );
        if (aCatLower === 'specialty')
          return (
            pCat.includes('special') ||
            pCat.includes('premium') ||
            pCat.includes('saffron') ||
            pName.includes('saffron') ||
            p.badge === 'Premium'
          );
        return pCat.includes(aCatLower) || pName.includes(aCatLower);
      })
      .filter(
        (p) =>
          activeTags.length === 0 ||
          activeTags.some((t) => {
            if (t === 'Organic')
              return p.tags?.some((tag) => tag.toLowerCase().includes('organic'));
            if (t === 'Bestseller')
              return (
                p.badge === 'Bestseller' ||
                p.tags?.some((tag) => tag.toLowerCase().includes('bestseller'))
              );
            if (t === 'Single origin')
              return (
                p.badge === 'Single Origin' ||
                p.tags?.some((tag) => tag.toLowerCase().includes('single-origin'))
              );
            if (t === 'Under ₹500') return (p.variants[0].salePrice || p.variants[0].price) < 500;
            if (t === 'Whole spice') return p.category.toLowerCase().includes('whole');
            return false;
          })
      )
      .filter(
        (p) =>
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        const priceA = a.variants[0].salePrice || a.variants[0].price;
        const priceB = b.variants[0].salePrice || b.variants[0].price;
        if (sort === 'price-asc') return priceA - priceB;
        if (sort === 'price-desc') return priceB - priceA;
        if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [products, activeCat, activeTags, sort, searchQuery]);

  const currentSort = SORT_OPTIONS.find((o) => o.value === sort)!;
  const hasActiveFilters = activeTags.length > 0 || activeCat !== 'all' || !!searchQuery;

  const productGrid = (
    <>
      {filteredResults.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filteredResults.map((p, i) => (
            <motion.div key={p.id} variants={FADE_UP} custom={i}>
              <ProductCard product={p} onAddToCart={() => {}} onToggleWishlist={() => {}} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center bg-white rounded-[2rem] border border-stone-100"
        >
          <div className="w-16 h-16 bg-[#FAF6F2] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-stone-300" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#42210B] mb-2">No products found</h2>
          <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
            Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setActiveCat('all');
              setActiveTags([]);
              setSearchQuery('');
            }}
            className="text-[#B38B59] font-black text-xs uppercase tracking-widest border-b-2 border-[#B38B59] pb-1"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {searchQuery && filteredPosts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
            <div className="w-9 h-9 bg-[#B38B59]/10 rounded-xl flex items-center justify-center">
              <FileText className="text-[#B38B59]" size={16} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#42210B]">Articles & Recipes</h3>
              <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">
                {filteredPosts.length} match{filteredPosts.length !== 1 ? 'es' : ''}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onSelectPost={(slug) => navigate(`/blog/${slug}`)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="bg-[#FAF6F2] min-h-screen">
      {/* ─── DESKTOP: STICKY TOP TOOLBAR ─── */}
      <div className="hidden md:block sticky top-16 z-30 bg-white/90 backdrop-blur-lg border-b border-stone-200/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-3 pb-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
            {REDESIGN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="relative flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-bold tracking-wide uppercase whitespace-nowrap transition-all duration-200"
                style={{
                  color: activeCat === cat.id ? 'white' : '#78716c',
                  background:
                    activeCat === cat.id
                      ? 'linear-gradient(135deg,#42210B,#6b3a1f)'
                      : 'transparent',
                  boxShadow: activeCat === cat.id ? '0 4px 16px rgba(66,33,11,0.25)' : 'none',
                }}
              >
                <span className="flex-shrink-0">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-100 bg-[#FAF6F2]/60">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal size={13} className="text-[#B38B59]" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#B38B59]">
                Filter
              </span>
              <div className="w-px h-4 bg-stone-300 mx-2" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {FILTER_CHIPS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleTag(f)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap"
                  style={{
                    background: activeTags.includes(f) ? '#B38B59' : 'white',
                    color: activeTags.includes(f) ? 'white' : '#78716c',
                    borderColor: activeTags.includes(f) ? '#B38B59' : '#e7e5e4',
                    boxShadow: activeTags.includes(f) ? '0 2px 12px rgba(179,139,89,0.3)' : 'none',
                  }}
                >
                  {f}
                  {activeTags.includes(f) && <X size={10} />}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <div className="relative shrink-0">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-[11px] font-bold uppercase tracking-widest text-stone-600 hover:border-[#B38B59] transition-all"
              >
                <SortAsc size={13} className="text-[#B38B59]" />
                {currentSort.label}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSort(opt.value);
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-5 py-3.5 text-[12px] font-bold uppercase tracking-widest transition-colors"
                        style={{
                          color: sort === opt.value ? '#B38B59' : '#57534e',
                          background: sort === opt.value ? '#FDF8F3' : 'transparent',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE: DELIVERY + SEARCH BAR ─── */}
      <div className="md:hidden sticky top-16 z-30 bg-white border-b border-stone-200 px-3 py-2 flex items-center gap-2">
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-600 shrink-0">
          <MapPin size={13} className="text-[#B38B59]" />
          <span>Delivering to:</span>
          <span className="text-[#42210B] font-black">India</span>
        </div>
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-300" />
          <input
            type="text"
            placeholder="Search spices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[#FAF6F2] rounded-xl border border-stone-200 focus:outline-none focus:border-[#B38B59] text-stone-700"
          />
        </div>
      </div>

      {/* ─── MOBILE: SPLIT-SCREEN LAYOUT ─── */}
      <div className="md:hidden flex" style={{ minHeight: 'calc(100vh - 8rem)' }}>
        {/* Left: Category Sidebar */}
        <div className="w-[22%] bg-[#1a0e07] overflow-y-auto flex-shrink-0 sticky top-[6.5rem] self-start max-h-[calc(100vh-6.5rem)]">
          {REDESIGN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className="w-full flex flex-col items-center gap-1.5 py-4 px-1 transition-all duration-150 border-l-2"
              style={{
                background: activeCat === cat.id ? '#42210B' : 'transparent',
                borderLeftColor: activeCat === cat.id ? '#B38B59' : 'transparent',
              }}
            >
              <span
                className={`transition-colors ${
                  activeCat === cat.id ? 'text-[#F5DEB3]' : 'text-stone-500'
                }`}
              >
                {cat.icon}
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-wider text-center leading-tight ${
                  activeCat === cat.id ? 'text-[#F5DEB3]' : 'text-stone-500'
                }`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Product Grid */}
        <div className="flex-1 overflow-y-auto bg-[#FAF6F2] p-2 pb-28">
          {/* Mobile filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)]">
            {FILTER_CHIPS.map((f) => (
              <button
                key={f}
                onClick={() => toggleTag(f)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                style={{
                  background: activeTags.includes(f) ? '#B38B59' : 'white',
                  color: activeTags.includes(f) ? 'white' : '#78716c',
                  borderColor: activeTags.includes(f) ? '#B38B59' : '#e7e5e4',
                }}
              >
                {f}
                {activeTags.includes(f) && <X size={9} />}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
            <span className="text-[#42210B] text-sm font-black mr-1">{filteredResults.length}</span>
            products
          </p>

          {productGrid}
        </div>
      </div>

      {/* ─── DESKTOP: MAIN CONTENT ─── */}
      <main className="hidden md:block max-w-7xl mx-auto px-4 md:px-8 py-10 pb-28">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            <span className="text-[#42210B] text-lg font-black mr-1">{filteredResults.length}</span>
            {filteredResults.length !== 1 ? 'Products' : 'Product'}
            {searchQuery && (
              <span className="text-[#B38B59] ml-1 normal-case font-medium">
                for &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </p>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setActiveCat('all');
                setActiveTags([]);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#B38B59] transition-colors"
            >
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        {productGrid}
      </main>

      {/* ─── STICKY BOTTOM CART BAR ─── */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-0 right-0 z-50 px-4 pb-4 pointer-events-none bottom-[calc(env(safe-area-inset-bottom,0px)+5rem)] md:bottom-[env(safe-area-inset-bottom,0px)]"
          >
            {/* Bump up above mobile bottom nav if present */}
            <div className="md:max-w-lg md:mx-auto pointer-events-auto">
              <button
                onClick={() => setDrawerOpen(true)}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl text-white"
                style={{ background: 'linear-gradient(135deg, #42210B, #6b3a1f)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <ShoppingCart size={20} />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#B38B59] rounded-full text-[10px] font-black flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest">
                      {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
                    </div>
                    <div className="text-base font-black">₹{subtotal.toFixed(0)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-black uppercase tracking-widest text-[#F5DEB3]">
                  View Cart <ChevronUp size={16} />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SLIDE-UP CART DRAWER ─── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              id="cart-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden"
              style={{ maxHeight: '78vh' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-stone-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
                <div>
                  <h3 className="font-black text-[#42210B] text-base">Your Cart</h3>
                  <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">
                    {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Free delivery progress */}
              <div className="px-5 py-3 bg-[#FAF6F2]">
                {amountToFree > 0 ? (
                  <>
                    <p className="text-[11px] font-bold text-stone-600 mb-1.5">
                      Add{' '}
                      <span className="text-[#42210B] font-black">₹{amountToFree.toFixed(0)}</span>{' '}
                      more for <span className="text-green-700 font-black">FREE delivery!</span>
                    </p>
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${deliveryProgress}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-green-600 rounded-full"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] font-black text-green-700">
                    🎉 You&apos;ve unlocked FREE delivery!
                  </p>
                )}
              </div>

              {/* Cart items */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(78vh - 17rem)' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3 border-b border-stone-50"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#42210B] truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400 font-bold">{item.weight}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center bg-[#42210B] rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#F5DEB3] active:bg-[#6b3a1f]"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-[#F5DEB3]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-[#F5DEB3] active:bg-[#6b3a1f]"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <span className="text-sm font-black text-[#42210B] w-16 text-right">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: UPI CTA + edit link */}
              <div className="px-5 py-4 bg-white border-t border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-stone-500">Total</span>
                  <span className="text-lg font-black text-[#42210B]">₹{subtotal.toFixed(0)}</span>
                </div>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  style={{ background: 'linear-gradient(135deg, #B38B59, #8B6940)' }}
                >
                  <span>💳</span>
                  Pay ₹{subtotal.toFixed(0)} via UPI
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full mt-2 py-2 text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-[#42210B] transition-colors"
                >
                  Edit Cart →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopPage;
