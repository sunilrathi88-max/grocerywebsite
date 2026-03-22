import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';

export const OrderConfirmation: React.FC<{ order: Order }> = ({ order }) => {
  if (!order) return null;

  const estimatedDeliveryDate = order.deliverySlot
    ? `${order.deliverySlot.date}, between ${order.deliverySlot.time}`
    : 'in 3-5 business days';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-serif font-bold text-brand-dark">Thank you for your order!</h2>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully. A confirmation email has been sent.
        </p>

        <div className="mt-6 text-left bg-brand-accent/50 p-4 rounded-lg space-y-1">
          <p>
            <strong>Order ID:</strong> <span className="font-mono">{order.id}</span>
          </p>
          <p>
            <strong>Estimated Delivery:</strong> {estimatedDeliveryDate}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-serif font-bold text-left mb-4">Order Summary</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto text-left pr-2">
            {order.items?.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex justify-between items-start gap-4"
              >
                <OptimizedImage
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  type="thumbnail"
                  priority="high"
                  width={64}
                  height={64}
                  onError={imageErrorHandlers.thumb}
                />
                <div className="flex-grow">
                  <p className="font-bold text-sm leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.weight} x {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold flex-shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg text-brand-dark mt-4 pt-4 border-t">
            <span>Total Paid</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="bg-brand-primary text-brand-dark font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/profile"
            className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            View My Orders
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
