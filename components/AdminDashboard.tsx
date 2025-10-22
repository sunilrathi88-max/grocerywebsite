import React, { useState, useMemo } from 'react';
import { Product, Order, OrderStatus } from '../types';
import ProductFormModal from './ProductFormModal';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { UsersIcon } from './icons/UsersIcon';

interface AnalyticsProps {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  salesData: { name: string; sales: number }[];
}

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  analytics: AnalyticsProps;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-brand-secondary/50 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold font-sans text-brand-dark">{value}</p>
    </div>
  </div>
);

const SalesChart: React.FC<{ data: { name: string; sales: number }[] }> = ({ data }) => {
  const maxSales = useMemo(() => Math.max(...data.map((d) => d.sales), 0), [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-serif font-bold mb-4">Monthly Sales</h4>
      {data.length > 0 ? (
        <div className="flex items-end space-x-4 h-64 border-l border-b border-gray-200 pl-4 pb-4">
          {data.map((item) => (
            <div key={item.name} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-3/4 bg-brand-primary hover:bg-brand-primary/80 rounded-t-md transition-all"
                style={{ height: `${maxSales > 0 ? (item.sales / maxSales) * 100 : 0}%` }}
                title={`$${item.sales.toFixed(2)}`}
              />
              <p className="text-xs text-gray-500 mt-2">{item.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No sales data to display.</p>
      )}
    </div>
  );
};

const AnalyticsDashboard: React.FC<{ analytics: AnalyticsProps }> = ({ analytics }) => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Revenue"
        value={`$${analytics.totalRevenue.toFixed(2)}`}
        icon={<CurrencyDollarIcon className="h-8 w-8 text-brand-primary" />}
      />
      <StatCard
        title="Total Orders"
        value={analytics.totalOrders}
        icon={<ShoppingBagIcon className="h-8 w-8 text-brand-primary" />}
      />
      <StatCard
        title="Unique Customers"
        value={analytics.uniqueCustomers}
        icon={<UsersIcon className="h-8 w-8 text-brand-primary" />}
      />
    </div>
    <SalesChart data={analytics.salesData} />
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (product: Product) => {
    props.onSaveProduct(product);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-8">
        Admin Dashboard
      </h2>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Analytics
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'products' && (
          <ProductManagement
            products={props.products}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={props.onDeleteProduct}
          />
        )}
        {activeTab === 'orders' && (
          <OrderManagement orders={props.orders} onUpdateStatus={props.onUpdateOrderStatus} />
        )}
        {activeTab === 'analytics' && <AnalyticsDashboard analytics={props.analytics} />}
      </div>

      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

const ProductManagement: React.FC<{
  products: Product[];
  onAddNew: () => void;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
}> = ({ products, onAddNew, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-serif font-bold">Manage Products</h3>
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 bg-brand-dark text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transition-colors"
      >
        <PlusIcon /> Add New
      </button>
    </div>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${p.variants[0].price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.variants.reduce((sum, v) => sum + v.stock, 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-brand-primary hover:text-brand-dark"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const OrderManagement: React.FC<{
  orders: Order[];
  onUpdateStatus: (id: string, s: OrderStatus) => void;
}> = ({ orders, onUpdateStatus }) => (
  <div>
    <h3 className="text-xl font-serif font-bold mb-4">Manage Orders</h3>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.shippingAddress.street}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
