import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../../../types';
import ProductCard from './ProductCard';
import {
  SlidersHorizontal,
  ChevronDown,
  Search,
  Flame,
  Leaf,
  Box,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

interface ShopPageProps {
  products: Product[];
}

const REDESIGN_CATEGORIES = [
  { id: 'all', label: 'All products', icon: <LayoutGrid size={18} /> },
  { id: 'powder', label: 'Powders', icon: <Flame size={18} /> },
  { id: 'whole', label: 'Whole spices', icon: <Leaf size={18} /> },
  { id: 'masala', label: 'Masalas', icon: <Box size={18} /> },
  { id: 'specialty', label: 'Specialty', icon: <Sparkles size={18} /> },
];

const ShopPage: React.FC<ShopPageProps> = ({ products }) => {
  const [params] = useSearchParams();
  const initCat = params.get('cat') || 'all';
  const initQ = params.get('q') || '';

  const [activeCat, setActiveCat] = useState(initCat);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(initQ);

  // Sync with URL params
  React.useEffect(() => {
    setActiveCat(params.get('cat') || 'all');
    setSearchQuery(params.get('q') || '');
  }, [params]);

  const filters = ['Organic', 'Bestseller', 'Single origin', 'Under ₹500', 'Whole spice'];

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const filteredResults = useMemo(() => {
    return products
      .filter((p) => {
        if (activeCat === 'all') return true;
        const pCat = p.category.toLowerCase();
        const aCat = activeCat.toLowerCase();
        // More robust matching
        if (aCat === 'powder') return pCat.includes('powder');
        if (aCat === 'whole') return pCat.includes('whole');
        if (aCat === 'masala') return pCat.includes('masala') || pCat.includes('blend');
        if (aCat === 'specialty')
          return pCat.includes('special') || pCat.includes('premium') || pCat.includes('saffron');
        return pCat.includes(aCat);
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
        return 0; // popular/default
      });
  }, [products, activeCat, activeTags, sort, searchQuery]);

  return (
    <div className="bg-[#FAF6F2] min-h-screen">
      {/* Category Tabs Section */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3">
            {REDESIGN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-2xl whitespace-nowrap text-sm font-bold tracking-wide transition-all ${
                  activeCat === cat.id
                    ? 'bg-[#42210B] text-white shadow-lg shadow-[#42210B]/20'
                    : 'bg-[#FAF6F2] text-stone-500 hover:bg-[#B38B59]/10 hover:text-[#42210B]'
                }`}
              >
                <span className="flex-shrink-0">{cat.icon}</span>
                <span className="uppercase tracking-widest">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#F2ECE4] border-b border-stone-200 py-3 px-4 md:px-8 shadow-inner overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-stone-300">
            <SlidersHorizontal size={16} className="text-[#B38B59]" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#B38B59]">
              Filters
            </span>
          </div>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => toggleTag(f)}
                className={`px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTags.includes(f)
                    ? 'bg-[#B38B59] text-white border-[#B38B59] shadow-md'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-[#B38B59]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative group">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-stone-200 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-stone-600 outline-none focus:ring-2 focus:ring-[#B38B59] cursor-pointer min-w-[140px]"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B38B59] pointer-events-none"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
            {searchQuery && <span className="text-[#B38B59] ml-1">for "{searchQuery}"</span>}
          </div>
        </div>

        {/* Product Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredResults.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-stone-100 shadow-sm">
            <div className="w-24 h-24 bg-[#FAF6F2] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-stone-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#42210B] mb-3">
              No products found
            </h2>
            <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setActiveCat('all');
                setActiveTags([]);
                setSearchQuery('');
              }}
              className="mt-8 text-[#B38B59] font-bold text-xs uppercase tracking-widest border-b-2 border-[#B38B59] hover:text-[#42210B] hover:border-[#42210B] transition-all pb-1"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;
