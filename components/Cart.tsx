import React, { useState } from 'react';
import type { Product, Variant } from '../types';
import type { CartItem } from '../store/cartStore';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { m, AnimatePresence } from 'framer-motion';
import PincodeChecker from './PincodeChecker';
import { useCartStore } from '../store/cartStore';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClose: () => void;
  isLoggedIn: boolean;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: (code: string) => void;
  discount: number;
  subtotal: number;
  shippingCost: number;
  onCheckout: () => void;
  onAddToCart?: (product: Product, variant: Variant) => void;
  recommendedProducts?: Product[];
}

const Spinner: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Success checkmark animation for add-to-cart feedback
const SuccessCheckmark: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <m.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  >
    <svg
      className={`text-green-500 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </m.div>
);

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onClose,

  isLoggedIn,
  promoCode,
  onPromoCodeChange,
  onApplyPromoCode,
  discount,
  subtotal,
  shippingCost,
  onCheckout,
  onAddToCart,
  recommendedProducts = [],
}) => {
  const FREE_SHIPPING_THRESHOLD = 1000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const [loadingState, setLoadingState] = useState<{
    type: 'item' | 'promo' | 'success' | null;
    id?: string;
  }>({
    type: null,
  });

  // Local Storage for "Save for Later"
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tattva_saved_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('tattva_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCartStore = useCartStore((state) => state.addItem);

  const handleSaveForLater = (item: CartItem) => {
    // Remove from cart
    onUpdateQuantity(item.id, 0);
    // Add to saved if not already there
    setSavedItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleMoveToCart = (item: CartItem) => {
    // Add to cart
    addToCartStore(item);
    // Remove from saved
    setSavedItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleRemoveFromSaved = (itemId: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + shippingCost + tax;

  const canCheckout = items.length > 0;

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    const performUpdate = () => {
      setLoadingState({ type: 'item', id: item.id });
      setTimeout(() => {
        onUpdateQuantity(item.id, newQuantity);
        // Show success state briefly after update
        if (newQuantity > 0) {
          setLoadingState({ type: 'success', id: item.id });
          setTimeout(() => {
            setLoadingState({ type: null });
          }, 800); // Show success for 800ms
        } else {
          setLoadingState({ type: null });
        }
      }, 400); // Reduced from 500ms for snappier feel
    };

    if (newQuantity <= 0) {
      if (window.confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
        performUpdate();
      }
    } else {
      performUpdate();
    }
  };

  const handleApplyPromo = () => {
    setLoadingState({ type: 'promo' });
    setTimeout(() => {
      onApplyPromoCode(promoCode);
      setLoadingState({ type: null });
    }, 800); // Simulate network delay
  };

  return (
    <div className="h-full flex flex-col">
      {/* Free Shipping Progress Bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span>
            {remainingForFreeShipping > 0
              ? `Add ₹${remainingForFreeShipping.toFixed(2)} for Free Shipping`
              : 'You have unlocked Free Shipping!'}
          </span>
          <span>{Math.round(shippingProgress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${remainingForFreeShipping > 0 ? 'bg-brand-primary' : 'bg-green-500'}`}
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div
          className="flex-1 flex flex-col items-center justify-center text-gray-500 overflow-y-auto"
          data-testid="cart-empty"
        >
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCartIcon className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <button onClick={onClose} className="mt-4 text-brand-primary hover:underline">
              Start Shopping
            </button>
          </div>

          {/* Recommendations in Empty State */}
          {recommendedProducts.length > 0 && onAddToCart && (
            <div className="w-full px-6 pb-6 animate-fadeIn">
              <h4 className="font-bold text-gray-800 mb-3 text-sm text-left">Trending Products</h4>
              <div className="space-y-3">
                {recommendedProducts.slice(0, 3).map((product) => (
                  <div
                    key={`empty-${product.id}`}
                    className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md"
                        type="thumbnail"
                        width={40}
                        height={40}
                        onError={imageErrorHandlers.thumb}
                      />
                      <div className="overflow-hidden text-left">
                        <p className="font-bold text-xs text-brand-dark truncate w-40">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{product.variants[0].salePrice || product.variants[0].price}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onAddToCart(product, product.variants[0])}
                      className="text-brand-primary hover:bg-brand-primary hover:text-white p-1.5 rounded-full transition-colors bg-brand-primary/10"
                      aria-label="Add to cart"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const isItemLoading = loadingState.type === 'item' && loadingState.id === item.id;
                const isItemSuccess =
                  loadingState.type === 'success' && loadingState.id === item.id;
                return (
                  <m.div
                    key={item.id}
                    className="flex flex-col gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                    data-testid="cart-item"
                  >
                    {/* Product info row */}
                    <div className="flex items-center gap-3">
                      <OptimizedImage
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-md bg-gray-200 flex-shrink-0"
                        type="thumbnail"
                        priority="high"
                        width={56}
                        height={56}
                        onError={imageErrorHandlers.thumb}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-dark dark:text-white leading-tight text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.weight}</p>
                        {item.isSubscription && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {item.subscriptionInterval === 'quarterly'
                                ? 'Every 3 Months'
                                : 'Every Month'}
                            </span>
                          </div>
                        )}
                        <p className="text-sm font-bold text-brand-primary">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      {/* Success indicator */}
                      <AnimatePresence>
                        {isItemSuccess && (
                          <m.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <SuccessCheckmark className="h-6 w-6" />
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Controls row */}
                    <div className="flex items-center justify-between">
                      {isItemLoading ? (
                        <div className="w-full flex justify-center items-center py-2">
                          <Spinner className="h-5 w-5 text-brand-primary" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                            <m.button
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              whileTap={{ scale: 0.9 }}
                              aria-label="Decrease quantity"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </m.button>
                            <m.span
                              className="w-8 text-center font-bold text-sm"
                              key={item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                            >
                              {item.quantity}
                            </m.span>
                            <m.button
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"
                              disabled={item.quantity >= (item.stock || 999)}
                              whileTap={{ scale: 0.9 }}
                              aria-label="Increase quantity"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </m.button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveForLater(item)}
                              className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline group"
                            >
                              <HeartIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              Save
                            </button>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <m.button
                              onClick={() => handleQuantityChange(item, 0)}
                              className="flex items-center gap-1 text-red-500 hover:bg-red-50 rounded px-2 py-1 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              aria-label="Remove item"
                            >
                              <TrashIcon className="w-4 h-4" />
                              <span className="text-xs font-bold">Remove</span>
                            </m.button>
                          </div>
                        </>
                      )}
                    </div>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Saved for Later Section */}
          {savedItems.length > 0 && (
            <div className="mt-8 border-t pt-4">
              <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <HeartIcon className="w-4 h-4 text-brand-primary" /> Saved for Later (
                {savedItems.length})
              </h3>
              <div className="space-y-3">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                      type="thumbnail"
                      width={48}
                      height={48}
                      onError={imageErrorHandlers.thumb}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-brand-primary font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="text-xs bg-brand-primary text-white px-2 py-1 rounded hover:bg-brand-dark transition-colors"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromSaved(item.id)}
                        className="text-[10px] text-gray-400 hover:text-red-500 text-center hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="promo-code" className="text-sm font-medium text-gray-700">
              Promo Code
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="promo-code"
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="TATTVA10"
                disabled={loadingState.type === 'promo'}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={loadingState.type === 'promo'}
                className="relative inline-flex items-center justify-center w-[75px] px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-wait"
              >
                {loadingState.type === 'promo' ? <Spinner /> : 'Apply'}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <PincodeChecker />
          </div>

          <div className="mt-6 border-t pt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-brand-dark">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          {!isLoggedIn && items.length > 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              You can check out as a guest or log in.
            </p>
          )}
          <button
            onClick={canCheckout ? onCheckout : undefined}
            disabled={!canCheckout || !!loadingState.type}
            className={`mt-4 block w-full text-center bg-brand-primary text-brand-dark font-bold py-3 rounded-full shadow-lg transition-all duration-300 ${
              !canCheckout || !!loadingState.type
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:bg-opacity-90 transform hover:scale-105'
            }`}
            data-testid="checkout-btn"
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {/* Recommendations */}
      {recommendedProducts.length > 0 && onAddToCart && (
        <div className="mt-6 border-t pt-6 bg-gray-50 -mx-6 px-6 pb-6">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Customers also bought</h4>
          <div className="space-y-3">
            {recommendedProducts
              .filter((p) => !items.some((i) => i.id.startsWith(`${p.id}-`)))
              .slice(0, 3)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <OptimizedImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                      type="thumbnail"
                      width={40}
                      height={40}
                      onError={imageErrorHandlers.thumb}
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-gray-800 truncate w-32">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{product.variants[0].salePrice || product.variants[0].price}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(product, product.variants[0])}
                    className="text-brand-primary hover:bg-brand-primary hover:text-white p-1 rounded transition-colors"
                    aria-label="Add to cart"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
