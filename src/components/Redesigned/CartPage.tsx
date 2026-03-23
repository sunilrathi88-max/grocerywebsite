import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import { useProducts } from '../../../hooks/useProducts';
import { CartItem } from '../../../types';
import { Trash2, Minus, Plus, ShoppingBag, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cartItems: items, removeFromCart, updateQuantity, cartItemCount: totalItems, subtotal: totalPrice } = useCart();
  const { products } = useProducts({ useMockData: true });

  const freeShipAt = 1000;
  const shipping = totalPrice >= freeShipAt ? 0 : 70;
  const remaining = Math.max(0, freeShipAt - totalPrice);
  const progressPercent = Math.min(100, (totalPrice / freeShipAt) * 100);

  // Cross-sell suggestions: products not in cart
  const suggestions = products
    .filter(p => !items.some(item => item.productId === p.id))
    .slice(0, 3);

  if (totalItems === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#FAF6F2]">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-8">
        <ShoppingBag className="text-stone-300" size={40} />
      </div>
      <h2 className="font-display text-3xl font-bold text-[#42210B] mb-4 text-center">Your Spice Box is Empty</h2>
      <p className="text-stone-500 mb-10 text-center max-w-sm leading-relaxed">
        Discover single-origin, cold-ground spices from Sangaria, Rajasthan. Freshly packed for your kitchen.
      </p>
      <Link 
        to="/shop" 
        className="bg-[#B38B59] hover:bg-[#8C6D45] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 flex items-center gap-2"
      >
        SHOP ALL SPICES
        <ArrowRight size={18} />
      </Link>
    </div>
  );

  return (
    <div className="bg-[#FAF6F2] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-[#42210B] mb-12">My Spice Box</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress */}
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Truck className="text-orange-500" size={20} />
                  </div>
                  {remaining > 0 ? (
                    <span className="text-sm font-bold text-[#42210B]">
                      Add ₹<span className="text-orange-500">{remaining}</span> more for <span className="text-orange-600 underline">FREE Express Shipping</span>
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-green-600">You've unlocked FREE Express Shipping! ✨</span>
                  )}
                </div>
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full relative z-10">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-100">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="p-6 md:p-8 flex gap-6 group hover:bg-[#FAF6F2]/50 transition-colors">
                    {/* Image */}
                    <Link to={`/product/${item.productId}`} className="shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FAF6F2] rounded-2xl border border-stone-100 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover p-2 transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="text-lg md:text-xl font-display font-bold text-[#42210B] group-hover:text-[#B38B59] transition-colors">{item.name}</h3>
                          </Link>
                          <span className="text-lg font-bold text-[#42210B]">₹{item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{item.weight} Pouch</p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center bg-stone-100 p-1.5 rounded-xl gap-4">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.variantId, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="flex items-center gap-1.5 text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="space-y-6 lg:sticky lg:top-32">
            <div className="bg-[#42210B] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#B38B59]/10 rounded-full blur-3xl -mr-24 -mt-24" />
              
              <h2 className="text-xl font-display font-bold mb-8 relative z-10">Order Summary</h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between text-sm text-stone-300 font-medium">
                  <span>Items ({totalItems})</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-stone-300"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-stone-300 font-bold uppercase tracking-widest text-[10px]">Grand Total</span>
                  <span className="text-3xl font-bold">₹{totalPrice + shipping}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="block w-full bg-[#B38B59] hover:bg-[#8C6D45] text-white py-5 rounded-2xl text-center font-bold text-lg shadow-xl shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 mb-6"
              >
                PROCEED TO CHECKOUT
              </Link>
              
              <div className="flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck size={20} className="text-[#B38B59]" />
                  <span>Secure</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-green-400">
                  <Truck size={20} fill="currentColor" className="text-green-400/20" />
                  <span>Fast</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ShoppingBag size={20} className="text-[#B38B59]" />
                  <span>Quality</span>
                </div>
              </div>
            </div>

            {/* Cross-sell */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
                <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6 px-1">Complete your box</h3>
                <div className="space-y-4">
                  {suggestions.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} className="group flex items-center gap-4 hover:bg-[#FAF6F2] p-2 rounded-2xl transition-colors">
                      <div className="w-16 h-16 bg-[#FAF6F2] rounded-xl flex items-center justify-center shrink-0 border border-stone-50 overflow-hidden">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{p.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#42210B] mb-0.5">{p.shortName || p.name}</div>
                        <div className="text-xs text-stone-400 font-medium">₹{p.variants[0].salePrice || p.variants[0].price}</div>
                      </div>
                      <ArrowRight size={16} className="text-stone-300 group-hover:text-[#B38B59] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
