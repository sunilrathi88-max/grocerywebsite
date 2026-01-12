import React, { useState } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Button } from '../../components/Button';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
}

const OrderList: React.FC = () => {
  // Mock Data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#1024',
      customer: 'Sarah M.',
      date: 'Oct 24, 2023',
      total: 1250,
      status: 'Pending',
      paymentMethod: 'UPI',
    },
    {
      id: '#1023',
      customer: 'Rahul K.',
      date: 'Oct 24, 2023',
      total: 4500,
      status: 'Shipped',
      paymentMethod: 'Credit Card',
    },
    {
      id: '#1022',
      customer: 'Priya S.',
      date: 'Oct 23, 2023',
      total: 850,
      status: 'Delivered',
      paymentMethod: 'COD',
    },
    {
      id: '#1021',
      customer: 'Amit B.',
      date: 'Oct 23, 2023',
      total: 2100,
      status: 'Cancelled',
      paymentMethod: 'UPI',
    },
  ]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search orders..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
            />
            <Button size="sm" variant="outline">
              Filter
            </Button>
            <Button size="sm">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-primary">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">₹{order.total}</td>
                  <td className="px-6 py-4">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'Shipped')}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase"
                      >
                        Mark Shipped
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-center">
          <button className="text-sm font-medium text-gray-500 hover:text-brand-primary">
            Show more orders
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderList;
