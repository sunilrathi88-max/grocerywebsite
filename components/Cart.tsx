import React, { useState } from 'react';
import type { Product, Variant, CartItem } from '../types';
// XIcon removed
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import PincodeChecker from './PincodeChecker';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, variantId: number, quantity: number) => void;
  onClose: () => void;
  isLoggedIn: boolean;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: (code: string) => void;
  discount: number;
  subtotal: number;
  shippingCost: number;
  onRemoveItem: (productId: number, variantId: number) => void;
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
  onAddToCart,
  recommendedProducts = [],
}) => {
  const FREE_SHIPPING_THRESHOLD = 1000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const [loadingState, setLoadingState] = useState<{ type: 'item' | 'promo' | null; id?: string }>({
    type: null,
  });
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const canCheckout = items.length > 0;

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    const performUpdate = () => {
      setLoadingState({ type: 'item', id: `${item.product.id}-${item.selectedVariant.id}` });
      setTimeout(() => {
        onUpdateQuantity(item.product.id, item.selectedVariant.id, newQuantity);
        setLoadingState({ type: null });
      }, 500); // Simulate network delay
    };

    if (newQuantity <= 0) {
      if (
        window.confirm(`Are you sure you want to remove "${item.product.name}" from your cart?`)
      ) {
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
          className="flex-1 flex flex-col items-center justify-center text-gray-500"
          data-testid="cart-empty"
        >
          <ShoppingCartIcon className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <button onClick={onClose} className="mt-4 text-brand-primary hover:underline">
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const isItemLoading =
                  loadingState.type === 'item' &&
                  loadingState.id === `${item.product.id}-${item.selectedVariant.id}`;
                return (
                  <motion.div
                    key={`${item.product.id}-${item.selectedVariant.id}`}
                    className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                    data-testid="cart-item"
                  >
                    <div className="flex items-center gap-4">
                      <OptimizedImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md bg-gray-200"
                        type="thumbnail"
                        priority="high"
                        width={64}
                        height={64}
                        onError={imageErrorHandlers.thumb}
                      />
                      <div>
                        <p className="font-bold text-brand-dark dark:text-white leading-tight">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.selectedVariant.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ₹
                          {(item.selectedVariant.salePrice ?? item.selectedVariant.price).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isItemLoading ? (
                        <div className="w-[140px] flex justify-center items-center">
                          <Spinner className="h-6 w-6 text-brand-primary" />
                        </div>
                      ) : (
                        <>
                          <motion.button
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            whileTap={{ scale: 0.9 }}
                          >
                            <MinusIcon />
                          </motion.button>
                          <motion.span
                            className="w-8 text-center font-bold"
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                          >
                            {item.quantity}
                          </motion.span>
                          <motion.button
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            disabled={item.quantity >= item.selectedVariant.stock}
                            whileTap={{ scale: 0.9 }}
                          >
                            <PlusIcon />
                          </motion.button>
                          <motion.button
                            onClick={() => handleQuantityChange(item, 0)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ml-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <TrashIcon />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

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
              <span>Taxes (8%)</span>
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
          <a
            href={canCheckout ? '#/checkout' : undefined}
            onClick={canCheckout ? onClose : (e) => e.preventDefault()}
            className={`mt-4 block w-full text-center bg-brand-primary text-brand-dark font-bold py-3 rounded-full shadow-lg transition-all duration-300 ${
              !canCheckout || !!loadingState.type
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:bg-opacity-90 transform hover:scale-105'
            }`}
            aria-disabled={!canCheckout || !!loadingState.type}
            data-testid="checkout-btn"
          >
            Proceed to Checkout
          </a>
        </>
      )}

      {/* Recommendations */}
      {recommendedProducts.length > 0 && onAddToCart && (
        <div className="mt-6 border-t pt-6 bg-gray-50 -mx-6 px-6 pb-6">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Customers also bought</h4>
          <div className="space-y-3">
            {recommendedProducts
              .filter((p) => !items.some((i) => i.product.id === p.id))
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
