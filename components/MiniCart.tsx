import React from 'react';
import { OptimizedImage } from './OptimizedImage';
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
  const FREE_SHIPPING_THRESHOLD = 250;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50; // Example fallback shipping cost if not free
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Mock Upsell Items (could be passed in or fetched)
  const upsellItems: MiniCartItem[] = [
    {
      id: 'upsell-1',
      name: 'Premium Saffron',
      image: 'https://placehold.co/100x100?text=Saffron',
      price: 450,
      quantity: 1,
      weight: '1g',
    },
    {
      id: 'upsell-2',
      name: 'Cardamom Pods',
      image: 'https://placehold.co/100x100?text=Cardamom',
      price: 120,
      quantity: 1,
      weight: '50g',
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-100 bg-white">
          <h3 className="text-xl font-serif font-bold text-neutral-900">
            Your Cart ({items.length})
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-100">
            {amountToFreeShipping > 0 ? (
              <p className="text-sm text-neutral-600 mb-2">
                Add <span className="font-bold text-brand-primary">₹{amountToFreeShipping}</span>{' '}
                more for <span className="font-bold text-neutral-900">Free Shipping</span>
              </p>
            ) : (
              <p className="text-sm text-success font-medium mb-2 flex items-center gap-2">
                <span className="bg-success text-white rounded-full p-0.5">✓</span> You&apos;ve
                unlocked Free Shipping!
              </p>
            )}
            <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-6xl">🛒</div>
              <div>
                <p className="text-lg font-medium text-neutral-900">Your cart is empty</p>
                <p className="text-neutral-500">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  onContinueShopping();
                  onClose();
                }}
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      type="thumbnail"
                      className="w-full h-full object-cover"
                      width={80}
                      height={96}
                      priority="high"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-neutral-900 line-clamp-2">{item.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-neutral-500">{item.weight}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-neutral-200 rounded-md">
                        <button className="px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-50">
                          -
                        </button>
                        <span className="px-2 text-sm font-medium text-neutral-900">
                          {item.quantity}
                        </span>
                        <button className="px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-50">
                          +
                        </button>
                      </div>
                      <p className="font-bold text-neutral-900">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Upsell Mockup (Only if cart not empty) */}
          {items.length > 0 && (
            <div className="pt-6 border-t border-neutral-100">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-3">
                You might also like
              </h4>
              <div className="space-y-3">
                {upsellItems.map((upsell) => (
                  <div
                    key={upsell.id}
                    className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
                  >
                    <div className="w-12 h-12 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                      <OptimizedImage
                        src={upsell.image}
                        alt={upsell.name}
                        type="thumbnail"
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-neutral-900">{upsell.name}</h5>
                      <p className="text-xs text-neutral-500">₹{upsell.price}</p>
                    </div>
                    <button className="text-xs font-bold text-brand-primary border border-brand-primary px-2 py-1 rounded hover:bg-brand-primary hover:text-white transition-colors">
                      ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-6 bg-white space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success font-medium">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span>₹{subtotal + shipping}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onCheckout}
              className="shadow-button group"
            >
              <span className="group-hover:translate-x-1 transition-transform inline-block">
                Proceed to Checkout →
              </span>
            </Button>

            <p className="text-xs text-center text-neutral-500">
              Secure Payment • 100% Satisfaction Guarantee
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
