import React from 'react';
import { CartItem } from '../types';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface MiniCartProps {
  items: CartItem[];
  subtotal: number;
}

const MiniCart: React.FC<MiniCartProps> = ({ items, subtotal }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border z-50 p-4">
      {items.length === 0 ? (
        <div className="text-center py-4">
          <ShoppingCartIcon className="h-12 w-12 text-gray-300 mx-auto" />
          <p className="mt-2 text-gray-500">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <h4 className="font-bold text-brand-dark mb-3">Your Cart</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 -mr-2">
            {items.map(item => (
              <div key={`${item.product.id}-${item.selectedVariant.id}`} className="flex items-center gap-3">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x ${(item.selectedVariant.salePrice ?? item.selectedVariant.price).toFixed(2)}</p>
                </div>
                <p className="text-sm font-bold flex-shrink-0">${(item.quantity * (item.selectedVariant.salePrice ?? item.selectedVariant.price)).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between font-bold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <a 
              href="#/checkout" 
              className="mt-3 block w-full text-center bg-brand-primary text-white font-bold py-2 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-sm"
            >
              Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniCart;
