import React from 'react';
import { CartItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-serif font-bold text-brand-dark border-b pb-4 mb-4">Shopping Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <p className="font-bold text-brand-dark">{item.name}</p>
                    <p className="text-sm text-gray-500">${(item.salePrice ?? item.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><MinusIcon /></button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><PlusIcon /></button>
                  <button onClick={() => onUpdateQuantity(item.id, 0)} className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors ml-2"><TrashIcon /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-6 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
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
          <button className="mt-6 w-full bg-brand-primary text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;