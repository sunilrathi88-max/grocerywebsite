import React, { useState, useMemo, useEffect } from 'react';
import { Product, Order, OrderStatus, Review as BaseReview } from '../types';
import ProductFormModal from './ProductFormModal';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { UsersIcon } from './icons/UsersIcon';
import { orderAPI, productAPI, reviewAPI, contentAPI } from '../utils/apiService';
import OrderDetailModal from './OrderDetailModal';
import { analyticsHelpers, ProductPerformance, InventoryAlert } from '../utils/analyticsHelpers';
import SettingsTab from './admin/SettingsTab';
import CustomersTab from './admin/CustomersTab';
import DiscountsTab from './admin/DiscountsTab';
import SubscriptionsTab from './admin/SubscriptionsTab';
import EmailTemplatesTab from './admin/EmailTemplatesTab';

interface AdminReview extends BaseReview {
  productName: string;
}

interface AdminContent {
  id: number;
  type: 'blog' | 'recipe' | string;
  title?: string;
  status: string;
  image?: string;
  author?: string;
  date?: string;
}

interface AnalyticsProps {
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  salesData: { name: string; sales: number }[];
  bestSellers: ProductPerformance[];
  inventoryHealth: InventoryAlert[];
  momGrowth: number;
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
                title={`₹${item.sales.toFixed(2)}`}
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
    {analytics.totalOrders === 0 && (
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <span className="text-blue-500 text-xl">ℹ️</span>
        <div>
          <p className="font-bold text-blue-800">No orders yet</p>
          <p className="text-sm text-blue-700">
            Analytics will populate once customers place orders. All systems are connected and
            ready!
          </p>
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Revenue"
        value={`₹${analytics.totalRevenue.toFixed(2)}`}
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Best Sellers */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
          <span className="text-yellow-500">★</span> Top Performing Products
        </h4>
        <div className="space-y-4">
          {analytics.bestSellers.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-2 last:pb-0"
            >
              <div>
                <p className="font-bold text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
              </div>
              <span className="font-bold text-brand-primary">₹{product.revenue.toFixed(0)}</span>
            </div>
          ))}
          {analytics.bestSellers.length === 0 && (
            <p className="text-gray-400">No sales data yet.</p>
          )}
        </div>
      </div>

      {/* Inventory Health */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
          <span className="text-red-500">⚠</span> Inventory Alerts
        </h4>
        <div className="space-y-3">
          {analytics.inventoryHealth.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-red-50 p-3 rounded-lg"
            >
              <span className="font-medium text-gray-800 truncate pr-4">{item.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Out' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}
              >
                {item.status === 'Out' ? 'Out of Stock' : `Low: ${item.stock}`}
              </span>
            </div>
          ))}
          {analytics.inventoryHealth.length === 0 && (
            <div className="text-center py-8 text-green-600">
              <p>✓ All stock levels healthy</p>
            </div>
          )}
        </div>
      </div>
    </div>
    <SalesChart data={analytics.salesData} />
  </div>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'products'
    | 'orders'
    | 'analytics'
    | 'reviews'
    | 'content'
    | 'discounts'
    | 'subscriptions'
    | 'customers'
    | 'emails'
    | 'settings'
  >('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // State for data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [content, setContent] = useState<AdminContent[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsProps>({
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCustomers: 0,
    salesData: [],
    bestSellers: [],
    inventoryHealth: [],
    momGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, reviewsData, blogsData, recipesData] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAll({ adminMode: true }),
        reviewAPI.getAll(),
        contentAPI.getBlogs(),
        contentAPI.getRecipes(),
      ]);

      setProducts(productsData);
      setOrders(ordersData.data);
      setReviews(reviewsData as AdminReview[]);
      setContent([...blogsData, ...recipesData] as AdminContent[]);

      // Calculate Analytics
      const totalRevenue = ordersData.data.reduce((sum, o) => sum + o.total, 0);
      const uniqueCustomers = new Set(ordersData.data.map((o) => o.userId || o.guestEmail)).size;

      // Simple monthly sales aggregation
      const salesByMonth = ordersData.data.reduce(
        (acc, order) => {
          const month = new Date(order.date).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + order.total;
          return acc;
        },
        {} as Record<string, number>
      );

      const salesData = Object.entries(salesByMonth).map(([name, sales]) => ({
        name,
        sales: Number(sales),
      }));

      const bestSellers = analyticsHelpers.calculateBestSellers(ordersData.data, productsData);
      const inventoryHealth = analyticsHelpers.getInventoryHealth(productsData);
      const momGrowth = analyticsHelpers.calculateMoMGrowth(ordersData.data);

      setAnalytics({
        totalRevenue,
        totalOrders: ordersData.data.length,
        uniqueCustomers,
        salesData,
        bestSellers,
        inventoryHealth,
        momGrowth,
      });
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = async (product: Product) => {
    try {
      if (product.id) {
        await productAPI.update(product.id, product);
      } else {
        await productAPI.create(product);
      }
      fetchData(); // Refresh data
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(productId);
      fetchData();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      fetchData();
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading Dashboard...</div>;
  }

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
          <button
            onClick={() => setActiveTab('reviews')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'discounts' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            🎟️ Discounts
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscriptions' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            📦 Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'customers' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'emails' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            📧 Emails
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            ⚙️ Settings
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'products' && (
          <ProductManagement
            products={products}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'orders' && (
          <OrderManagement orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
        )}
        {activeTab === 'analytics' && <AnalyticsDashboard analytics={analytics} />}
        {activeTab === 'reviews' && <ReviewModeration reviews={reviews} onUpdate={fetchData} />}
        {activeTab === 'content' && <ContentManagement content={content} onUpdate={fetchData} />}
        {activeTab === 'discounts' && <DiscountsTab />}
        {activeTab === 'subscriptions' && <SubscriptionsTab />}
        {activeTab === 'customers' && <CustomersTab orders={orders} />}
        {activeTab === 'emails' && <EmailTemplatesTab />}
        {activeTab === 'settings' && <SettingsTab />}
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
}> = ({ products, onAddNew, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-serif font-bold">Manage Products</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={onAddNew}
            className="flex items-center justify-center gap-2 bg-brand-dark text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transition-colors whitespace-nowrap"
          >
            <PlusIcon /> Add New
          </button>
        </div>
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
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.variants && p.variants.length > 0 && p.variants[0]?.price != null ? (
                      `₹${p.variants[0].price.toFixed(2)}`
                    ) : (
                      <span className="text-red-500">No price set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.variants && p.variants.length > 0 ? (
                      p.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
                    ) : (
                      <span className="text-red-500">0</span>
                    )}
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
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No products found matching your filters.
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

const OrderManagement: React.FC<{
  orders: Order[];
  onUpdateStatus: (id: string, s: OrderStatus) => void;
}> = ({ orders, onUpdateStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress?.street || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-serif font-bold">Manage Orders</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search Order ID or Address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.shippingAddress?.street || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-brand-primary hover:text-brand-dark font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

const ReviewModeration: React.FC<{ reviews: AdminReview[]; onUpdate: () => void }> = ({
  reviews,
  onUpdate,
}) => {
  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    await reviewAPI.updateStatus(id, status);
    onUpdate();
  };

  return (
    <div>
      <h3 className="text-xl font-serif font-bold mb-6">Review Moderation</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reviewer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {review.productName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{review.author}</div>
                  <div className="text-xs">{review.date}</div>
                </td>
                <td className="px-6 py-4 text-sm text-yellow-500">{'★'.repeat(review.rating)}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {review.comment}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : review.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {review.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContentManagement: React.FC<{ content: AdminContent[]; onUpdate: () => void }> = ({
  content,
  onUpdate,
}) => {
  const handleDelete = async (id: number, type: 'blog' | 'recipe') => {
    if (window.confirm(`Delete this ${type}?`)) {
      await contentAPI.delete(id, type);
      onUpdate();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Content Management</h3>
        <button className="bg-brand-dark text-white px-4 py-2 rounded-full font-bold shadow-md hover:bg-opacity-90">
          <PlusIcon className="w-5 h-5 inline mr-1" /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
          >
            <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400">
              {/* Placeholder for real image */}
              <span className="text-4xl">📷</span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${item.type === 'blog' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}
                >
                  {item.type.toUpperCase()}
                </span>
                <span
                  className={`text-xs ${item.status === 'published' ? 'text-green-600' : 'text-gray-500'}`}
                >
                  ● {item.status}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                By {item.author} • {item.date}
              </p>

              <div className="flex justify-end pt-3 border-t border-gray-100 space-x-3">
                <button className="text-gray-400 hover:text-brand-primary">
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.type as 'blog' | 'recipe')}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
