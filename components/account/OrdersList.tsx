import React, { useState } from 'react';
import { Order } from '../../types';
import OrderDetailModal from '../OrderDetailModal';
import { useUserOrders } from '../../hooks/useUserOrders';
import { Button } from '../../components/ui/Button';

// No props needed now
// interface OrdersListProps {
//     orders: Order[];
// }

const OrdersList: React.FC = () => {
  const { orders, isLoading, error } = useUserOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load orders.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-serif font-bold mb-6 text-brand-dark border-b pb-4">
        Order History
      </h3>
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
          <Button onClick={() => (window.location.href = '/shop')}>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-bold text-gray-900">#{order.id}</span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>
                    {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
                <button
                  className="flex-1 md:flex-none px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-dark transition-colors"
                  onClick={() => {
                    /* Mock reorder navigation */
                  }}
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrdersList;
