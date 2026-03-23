import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, Variant } from '../../../types';
import { useProducts } from '../../../hooks/useProducts';
import { useCart } from '../../../hooks/useCart';
import StarRating from './StarRating';
import ProductCard from './ProductCard';
import { ShieldCheck, Truck, RotateCcw, Zap, Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const { products } = useProducts({ useMockData: true });
  const { addToCart } = useCart();
  
  const product = useMemo(() => 
    products.find(p => p.id === Number(id)), 
    [products, id]
  );

  const [selSize, setSelSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return (
    <div className="py-24 text-center bg-[#FAF6F2] min-h-screen">
      <div className="text-6xl mb-6">😕</div>
      <h2 className="font-display text-2xl font-bold mb-4">Product not found</h2>
      <Link to="/shop" className="text-[#B38B59] font-bold underline">Back to shop</Link>
    </div>
  );

  const currentVariant = product.variants[selSize] || product.variants[0];
  const currentPrice = currentVariant.salePrice || currentVariant.price;
  const originalPrice = currentVariant.salePrice ? currentVariant.price : null;
  const discount = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : null;

  const handleAdd = () => {
    addToCart(product, currentVariant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category))
    .slice(0, 4);

  return (
    <div className="bg-[#FAF6F2] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-8">
          <Link to="/" className="hover:text-[#B38B59] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#B38B59] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#42210B]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column: Image & Media */}
          <div className="space-y-6 lg:sticky lg:top-32">
            <div className="relative aspect-square bg-white rounded-[2.5rem] border border-stone-200 overflow-hidden shadow-sm group">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover p-10 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-8 left-8">
                <span className="bg-[#42210B] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} fill="currentColor" />
                  Cold-ground &lt;10°C
                </span>
              </div>
            </div>

            {/* USP Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: '📍', text: 'Single Origin' },
                { icon: '✅', text: 'FSSAI Certified' },
                { icon: '🌿', text: 'No Fillers Ever' },
                { icon: '🧪', text: 'Batch Lab Tested' }
              ].map((u, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-100 rounded-2xl text-[11px] font-bold text-stone-600 shadow-sm">
                  <span>{u.icon}</span> {u.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 text-[#B38B59] font-bold tracking-[0.2em] uppercase text-xs mb-4">
                <span className="bg-[#B38B59]/10 px-3 py-1 rounded-full whitespace-nowrap">📍 {product.origin}</span>
                <span className="w-1 h-1 bg-[#B38B59] rounded-full hidden sm:block" />
                <span className="hidden sm:block">Product ID: #{product.id}</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-[#42210B] mb-6 leading-tight">
                {product.name} {product.emoji}
              </h1>

              <StarRating rating={product.rating || 4.8} reviews={product.reviews?.length || 124} size={18} />
            </div>

            {/* Pricing Area */}
            <div className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-8">
              <div className="flex items-end gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-[#42210B]">₹{currentPrice}</span>
                    {originalPrice && (
                      <span className="text-xl text-stone-400 line-through">₹{originalPrice}</span>
                    )}
                  </div>
                  {discount && (
                    <span className="text-[11px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-widest inline-block">
                      SAVE {discount}% ON THIS PACK
                    </span>
                  )}
                </div>
                <div className="pb-1 text-xs font-bold text-stone-400 uppercase tracking-widest ml-auto">
                  Inclusive of all taxes
                </div>
              </div>

              {/* Pack Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Select Pack Size</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variants.map((v, i) => (
                    <button 
                      key={v.id}
                      onClick={() => setSelSize(i)}
                      className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1 ${
                        selSize === i 
                        ? "border-[#42210B] bg-[#42210B]/5 shadow-md" 
                        : "border-stone-100 bg-[#FAF6F2] hover:border-[#B38B59] text-stone-500"
                      }`}
                    >
                      <span className="text-sm font-bold uppercase tracking-widest">{v.name}</span>
                      <span className="text-xs font-medium">₹{v.salePrice || v.price}</span>
                      {selSize === i && (
                        <div className="absolute -top-2 -right-2 bg-[#42210B] text-white p-1 rounded-full">
                          <ShieldCheck size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty & Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center justify-between bg-stone-100 p-2 rounded-2xl sm:w-40">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-lg">{qty}</span>
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="text-center sm:text-right">
                    <span className="text-xs text-stone-400 uppercase tracking-widest font-bold">Subtotal:</span>
                    <span className="text-xl font-bold text-[#42210B] ml-3">₹{currentPrice * qty}</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleAdd}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm tracking-widest shadow-xl transition-all active:scale-[0.98] ${
                        added ? "bg-green-600 text-white" : "bg-[#B38B59] hover:bg-[#8C6D45] text-white"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {added ? "ADDED TO CART" : "ADD TO CART"}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#42210B] hover:bg-[#5D3D28] text-white rounded-2xl font-bold text-sm tracking-widest shadow-xl transition-all active:scale-[0.98]">
                      <CreditCard size={18} />
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Shipping Trust */}
              <div className="flex justify-between items-center px-4 py-4 bg-stone-50 rounded-2xl text-[10px] font-bold text-stone-500 uppercase tracking-widest overflow-hidden">
                <div className="flex items-center gap-2"><Truck size={14} className="text-[#B38B59]" /> Free Ship ₹1000+</div>
                <div className="flex items-center gap-2"><RotateCcw size={14} className="text-[#B38B59]" /> 7 Day Returns</div>
                <div className="hidden sm:flex items-center gap-2"><ShieldCheck size={14} className="text-[#B38B59]" /> SSL Secure</div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-8 px-4">
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-[#42210B]">Experience Pure Essence</h3>
                <p className="text-stone-500 leading-relaxed font-normal text-lg">
                  {product.description}
                </p>
              </div>

              {product.features && (
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em]">Key Botanical Features</h4>
                  <div className="grid gap-4">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex gap-4 items-start bg-white/50 p-4 rounded-2xl border border-dashed border-stone-200">
                        <div className="w-6 h-6 rounded-full bg-[#B38B59]/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#B38B59]" />
                        </div>
                        <p className="text-stone-600 text-sm font-medium leading-relaxed italic">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-32 pt-20 border-t border-stone-200">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[#B38B59] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">You might also like</span>
                <h2 className="font-display text-3xl md:text-5xl font-bold text-[#42210B]">Complete Your Spice Box</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
