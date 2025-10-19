
import React, { useState } from 'react';
import { CartItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

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
}

const Spinner: React.FC<{className?: string}> = ({ className = "h-5 w-5" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onClose, isLoggedIn, promoCode, onPromoCodeChange, onApplyPromoCode, discount, subtotal, shippingCost }) => {
  const [loadingState, setLoadingState] = useState<{ type: 'item' | 'promo' | null, id?: string }>({ type: null });
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (!img.src.startsWith('data:image/svg+xml')) {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjhFM0Q5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRhdHR2YSBDby48L3RleHQ+PC9zdmc+';
    }
  };

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
      if (window.confirm(`Are you sure you want to remove "${item.product.name}" from your cart?`)) {
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
      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <ShoppingCartIcon className="h-20 w-20 text-gray-300" />
          <h3 className="mt-4 text-xl font-serif font-bold text-brand-dark">Your Cart is Empty</h3>
          <p className="mt-2 text-gray-500">Add some delicious products to get started.</p>
          <button 
            onClick={onClose}
            className="mt-6 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow space-y-4 pr-2 -mr-2 overflow-y-auto">
            {items.map(item => {
              const isItemLoading = loadingState.type === 'item' && loadingState.id === `${item.product.id}-${item.selectedVariant.id}`;
              return (
                <div key={`${item.product.id}-${item.selectedVariant.id}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-cover rounded-md bg-gray-200" 
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div>
                      <p className="font-bold text-brand-dark leading-tight">{item.product.name}</p>
                      <p className="text-sm text-gray-500">{item.selectedVariant.name}</p>
                      <p className="text-sm text-gray-500">${(item.selectedVariant.salePrice ?? item.selectedVariant.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isItemLoading ? (
                        <div className="w-[140px] flex justify-center items-center">
                            <Spinner className="h-6 w-6 text-brand-primary" />
                        </div>
                    ) : (
                        <>
                            <button onClick={() => handleQuantityChange(item, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><MinusIcon /></button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(item, item.quantity + 1)} 
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                disabled={item.quantity >= item.selectedVariant.stock}
                            >
                                <PlusIcon />
                            </button>
                            <button onClick={() => handleQuantityChange(item, 0)} className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors ml-2"><TrashIcon /></button>
                        </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <label htmlFor="promo-code" className="text-sm font-medium text-gray-700">Promo Code</label>
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

          <div className="mt-6 border-t pt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
             {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
             <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-brand-dark">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          {!isLoggedIn && items.length > 0 && <p className="text-center text-sm text-gray-500 mt-4">You can check out as a guest or log in.</p>}
          <a
            href={canCheckout ? "#/checkout" : undefined}
            onClick={canCheckout ? onClose : (e) => e.preventDefault()}
            className={`mt-4 block w-full text-center bg-brand-primary text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 ${
              !canCheckout || !!loadingState.type
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:bg-opacity-90 transform hover:scale-105'
            }`}
             aria-disabled={!canCheckout || !!loadingState.type}
          >
            Proceed to Checkout
          </a>
        </>
      )}
    </div>
  );
};

export default Cart;
