import React, { useState } from 'react';
import { orderAPI } from '../utils/apiService';
import { Order } from '../types';
import OrderDetailModal from '../components/OrderDetailModal';
import { Helmet } from 'react-helmet-async';

const OrderTrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      setError('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await orderAPI.trackOrder(orderId, email);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError('Order not found under these details.');
      }
    } catch (err: unknown) {
      console.error('Tracking failed', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to find order. Please check the details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order | Tattva</title>
        <meta name="description" content="Track your order status securely." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">Track Your Order</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your Order ID (and Email for verification)
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleTrack}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="order-id" className="sr-only">
                  Order ID
                </label>
                <input
                  id="order-id"
                  name="order-id"
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                  placeholder="Order ID (e.g. 123e4...)"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address (Optional)
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                  placeholder="Email Address (Optional)"
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brand-dark bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {order && <OrderDetailModal order={order} onClose={() => setOrder(null)} />}
    </>
  );
};

export default OrderTrackingPage;
