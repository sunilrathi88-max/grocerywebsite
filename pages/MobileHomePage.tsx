import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useNavigate } from 'react-router-dom';
import { MobileHeader, MobileFeaturedSection } from '../components/mobile';

interface MobileHomePageProps {
  products: Product[];
  wishlistedIds: Set<number>;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  handleAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  handleToggleWishlist: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  onCartClick: () => void;
  addToast: (msg: string, type: ToastMessage['type']) => void;
}

const MobileHomePage: React.FC<MobileHomePageProps> = ({
  products,
  wishlistedIds,
  cartItemCount,
  searchQuery,
  onSearchChange,
  handleAddToCart,
  handleToggleWishlist,
  setSelectedProduct: _setSelectedProduct,
  onCartClick,
  addToast: _addToast,
}) => {
  const navigate = useNavigate();

  // Get most loved products (IDs 4, 12, 29, 28)
  const mostLovedProducts = products.filter((p) => [4, 12, 29, 28].includes(p.id));

  // Pure Origin Hero background image
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJAJQpaMFNB6WLQB77bKXgSpPTZYfz66Wyca45BdecV6IvQW8IqUWnyuTlBpy9CdH1TcE2EXBR7LwAH1uPDNoj5ScAJrtDjDEwnrF5i6puZMCu0C6e7kfqOAbsFRrt2dyQPYIBmPwnARV63RCloDT2AQmg1M6nEKkcxcRRS1eWBhvDLLxtreTYJ_C9KAI1hbZK0NgQ9Zw5bBHPpOo_oKdYpjbMzM2gQa5EDNxjCrbNYFeNf7DqIWtJV0V1IZUGoBCBjAXOnG_nSA';

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <MobileHeader
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCartClick={onCartClick}
      />

      {/* Pure Origin Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url("${heroImage}")`,
              filter: 'brightness(0.9) saturate(0.9)',
            }}
          ></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto text-center px-6 flex flex-col items-center gap-4">
          <span className="text-white/90 font-sans font-bold tracking-[0.2em] text-[10px] uppercase border border-white/30 px-3 py-1.5 bg-black/10 backdrop-blur-sm">
            Est. 1984
          </span>
          <h2 className="text-4xl font-serif font-light text-white drop-shadow-sm leading-tight">
            Pure Origin
            <br />
            <span className="italic font-normal">Untouched.</span>
          </h2>
          <p className="text-sm text-white/90 max-w-xs leading-relaxed font-light font-sans mt-1 tracking-wide">
            Single-origin spices sourced directly from heritage farms.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigate('/shop')}
              className="bg-white text-stone-800 hover:bg-stone-100 px-8 py-3 font-sans font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Shop Pure
            </button>
          </div>
        </div>
      </section>

      {/* Trust Signals - Dark Strip */}
      <section className="bg-stone-900 text-stone-100 py-6 px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-white">verified_user</span>
            </div>
            <div>
              <p className="font-serif text-sm text-white">FSSAI Certified</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">100% Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-white">eco</span>
            </div>
            <div>
              <p className="font-serif text-sm text-white">Organic Origin</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Pesticide Free</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-white">factory</span>
            </div>
            <div>
              <p className="font-serif text-sm text-white">ISO 9001:2015</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Quality Assured</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-white">location_on</span>
            </div>
            <div>
              <p className="font-serif text-sm text-white">Single Source</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Farm Traceable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline - Mobile Version */}
      <section className="py-12 px-4 bg-[#FAF9F6]">
        <div className="text-center mb-8">
          <span className="text-amber-700 font-bold tracking-[0.15em] text-[10px] uppercase mb-2 block">
            Transparency
          </span>
          <h3 className="text-2xl font-serif font-medium text-stone-800">The Journey of Purity</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { step: '01', title: 'Harvest', icon: 'agriculture' },
            { step: '02', title: 'Sun Drying', icon: 'wb_sunny' },
            { step: '03', title: 'Lab Testing', icon: 'science' },
            { step: '04', title: 'To Your Kitchen', icon: 'inventory_2' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="size-12 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-xl text-amber-700">
                  {item.icon}
                </span>
              </div>
              <span className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mb-1">
                Step {item.step}
              </span>
              <h4 className="font-serif text-sm text-stone-800">{item.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Most Loved Products */}
      <MobileFeaturedSection
        title="Our Harvest"
        products={mostLovedProducts}
        onAddToCart={(product, variant) => handleAddToCart(product, variant, 1)}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={(product) => navigate(`/product/${product.id}`)}
        wishlistedIds={wishlistedIds}
        onViewAll={() => navigate('/shop')}
      />

      {/* Category Showcase - Mobile Version */}
      <section className="px-4 py-8 bg-[#FAF9F6]">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="relative h-40 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => navigate('/category/Spices')}
          >
            <img
              alt="Spices"
              className="absolute inset-0 w-full h-full object-cover brightness-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUiko4PeG0SntdKOmXzLeIGYiNhPHtJCJrXpkg6Dda41UoJ_J9-6XXjMk4M-9MDyAkSyHxW8tQgakLt_MjErv5nUUIlFHI9bJaoHvcgDCClxoDbLxztg-Tzvp7PTxIwHb6PZQpRgMdJEAY77p7AY_ysoAfzClZR1F5_CixauImNoBGMBrWGil3Dz8wbJqSXUl60Hx9ITsRyATOUO-XWIoLdFzKp-prC-GpZoffK_3nGIAfgdw6jhThOPoe2vkydi1OVhN8q8VPAw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-serif text-xl text-white">Spices</h3>
                <p className="text-white/80 text-[9px] uppercase tracking-widest">Pure & Fresh</p>
              </div>
            </div>
          </div>
          <div
            className="relative h-40 rounded-xl overflow-hidden cursor-pointer"
            onClick={() => navigate('/category/Nuts')}
          >
            <img
              alt="Nuts"
              className="absolute inset-0 w-full h-full object-cover brightness-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm_domXhY5rxtzMHSCkaJQLSViPrzYizogFs-OBY3NpcK1rs9-7R3SLLCIJrLn_E3GzBJrCS2U_HOpCYbxyQa2xnitarOiamq31NwkvKYWJBl8XWNPzeG2Y0gbssIGJNeFvXZMgJrMvISEUMKak5HEn_mjTjLfMjD4NBD0kawfUnbpjnXLvFWKo_5sjl4ob9V9vJ_VpLAx6M1fGFXH4kER4B0xMH5AdHI6_lgyp9828hJCD4jmF-tMqDqltceLiIxyZ05Xrmt6IA"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-serif text-xl text-white">Nuts</h3>
                <p className="text-white/80 text-[9px] uppercase tracking-widest">
                  Premium Quality
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop All Button */}
      <div className="px-4 py-8 mb-20 text-center">
        <button
          onClick={() => navigate('/shop')}
          className="w-full bg-stone-900 text-white py-3.5 font-bold text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] transition-transform"
        >
          Shop All Products
        </button>
      </div>
    </div>
  );
};

export default MobileHomePage;
