import React, { useState, useMemo } from 'react';
import { Order } from '../../types';

interface CustomerData {
  id: string;
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Active' | 'Inactive';
}

interface CustomersTabProps {
  orders: Order[];
}

const CustomersTab: React.FC<CustomersTabProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'orders' | 'spent' | 'recent'>('recent');

  // Aggregate customers from orders
  const customers = useMemo(() => {
    const customerMap = new Map<string, CustomerData>();

    orders.forEach((order) => {
      const email = order.guestEmail || order.userId || 'Unknown';
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        if (new Date(order.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.date;
        }
      } else {
        customerMap.set(email, {
          id: email,
          email: email,
          name: order.shippingAddress?.street?.split(',')[0] || 'Customer',
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.date,
          status: 'Active',
        });
      }
    });

    // Mark inactive if no order in 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    customerMap.forEach((customer) => {
      if (new Date(customer.lastOrderDate) < ninetyDaysAgo) {
        customer.status = 'Inactive';
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  // Filter and sort
  const filteredCustomers = useMemo(() => {
    let result = customers.filter(
      (c) =>
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case 'orders':
        result.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'spent':
        result.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'recent':
        result.sort(
          (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
        );
        break;
    }

    return result;
  }, [customers, searchTerm, sortBy]);

  // Stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'Active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div>
      <h3 className="text-xl font-serif font-bold mb-6">Customer Management</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold text-brand-dark">{totalCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Active (90 days)</p>
          <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-brand-primary">₹{totalRevenue.toFixed(0)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold text-brand-dark">₹{avgOrderValue.toFixed(0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'orders' | 'spent' | 'recent')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
        >
          <option value="recent">Most Recent</option>
          <option value="orders">Most Orders</option>
          <option value="spent">Highest Spent</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-brand-dark font-bold">
                        {customer.email[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                        <p className="text-xs text-gray-500">{customer.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-primary font-bold">
                    ₹{customer.totalSpent.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {orders.length === 0
                      ? 'No customers yet. Customers will appear once orders are placed.'
                      : 'No customers found matching your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;
