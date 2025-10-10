
import React from 'react';
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
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onClose, isLoggedIn, promoCode, onPromoCodeChange, onApplyPromoCode, discount }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.selectedVariant.salePrice ?? item.selectedVariant.price;
    return sum + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal - discount + tax;

  const canCheckout = isLoggedIn && items.length > 0;

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
            {items.map(item => (
              <div key={`${item.product.id}-${item.selectedVariant.id}`} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-md bg-gray-200" 
                    loading="lazy"
                  />
                  <div>
                    <p className="font-bold text-brand-dark leading-tight">{item.product.name}</p>
                    <p className="text-sm text-gray-500">{item.selectedVariant.name}</p>
                    <p className="text-sm text-gray-500">${(item.selectedVariant.salePrice ?? item.selectedVariant.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><MinusIcon /></button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)} 
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    disabled={item.quantity >= item.selectedVariant.stock}
                  >
                    <PlusIcon />
                  </button>
                  <button onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant.id, 0)} className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors ml-2"><TrashIcon /></button>
                </div>
              </div>
            ))}
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
                />
                <button
                    type="button"
                    onClick={() => onApplyPromoCode(promoCode)}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    Apply
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
              <span>Taxes (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-brand-dark">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          {!isLoggedIn && items.length > 0 && <p className="text-center text-sm text-red-500 mt-4">Please log in to proceed to checkout.</p>}
          <a
            href={canCheckout ? "#/checkout" : undefined}
            onClick={canCheckout ? onClose : (e) => e.preventDefault()}
            className={`mt-4 block w-full text-center bg-brand-primary text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 ${
              !canCheckout
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:bg-opacity-90 transform hover:scale-105'
            }`}
             aria-disabled={!canCheckout}
          >
            Proceed to Checkout
          </a>
        </>
      )}
    </div>
  );
};

export default React.memo(Cart);