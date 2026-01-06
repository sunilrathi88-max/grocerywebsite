import React from 'react';
import { Button } from './Button';
import clsx from 'clsx';

export interface MiniCartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  weight: string;
}

export interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: MiniCartItem[];
  onCheckout: () => void;
  onContinueShopping: () => void;
  onRemoveItem: (id: string) => void;
}

export const MiniCart: React.FC<MiniCartProps> = ({
  isOpen,
  onClose,
  items,
  onCheckout,
  onContinueShopping,
  onRemoveItem,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 250 ? 0 : 0; // Free shipping above ₹250

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-96 max-w-full bg-white shadow-lg z-50 flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-bold text-[#1F2121]">Your Cart</h3>
          <button onClick={onClose} className="text-2xl text-[#6F7577] hover:text-[#1F2121]">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-[#6F7577]">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 pb-4 border-b">
                <img
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1F2121]">{item.name}</h4>
                  <p className="text-sm text-[#6F7577]">{item.weight}</p>
                  <p className="text-sm text-[#6F7577]">Qty: {item.quantity}</p>
                  <p className="font-bold text-[#1F2121]">₹{item.price * item.quantity}</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[#6F7577] hover:text-[#1F2121]"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{subtotal + shipping}</span>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={onCheckout}>
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => {
                onContinueShopping();
                onClose();
              }}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
