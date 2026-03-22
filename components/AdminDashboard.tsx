import React, { useState, useMemo, useEffect } from 'react';
import { Product, Order, OrderStatus, Review as BaseReview } from '../types';
import ProductFormModal from './ProductFormModal';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import OrderDetailModal from './OrderDetailModal';
import SettingsTab from './admin/SettingsTab';
import CustomersTab from './admin/CustomersTab';
import DiscountsTab from './admin/DiscountsTab';
import SubscriptionsTab from './admin/SubscriptionsTab';
import EmailTemplatesTab from './admin/EmailTemplatesTab';
import AffiliatesTab from './admin/AffiliatesTab';

type TabType =
  | 'products'
  | 'orders'
  | 'analytics'
  | 'reviews'
  | 'content'
  | 'discounts'
  | 'subscriptions'
  | 'customers'
  | 'emails'
  | 'affiliates'
  | 'settings';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  salesData: any[]; // Still using any here if I don't have types for these specific ones, but making progress
  topProducts: any[];
  recentOrders: any[];
}

interface ContentState {
  posts: any[];
  recipes: any[];
  testimonials: any[];
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<BaseReview[]>([]);
  const [content, setContent] = useState<ContentState>({ posts: [], recipes: [], testimonials: [] });
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    salesData: [],
    topProducts: [],
    recentOrders: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Mock data loader to fix build
  // Load initial data
  useEffect(() => {
    import('../data/products').then((mod) => setProducts(mod.MOCK_PRODUCTS));
    // Mock orders
    setOrders([
      {
        id: 'ORD-123456',
        date: '2023-10-25',
        total: 1250,
        status: 'Delivered',
        items: [],
        shippingAddress: {
          id: 'addr1',
          type: 'Home',
          street: '123 Spice Lane, Mumbai',
          city: 'Mumbai',
          state: 'MH',
          zip: '400001',
          country: 'India',
          isDefault: true,
        },
        billingAddress: {
          id: 'addr1',
          type: 'Home',
          street: '123 Spice Lane, Mumbai',
          city: 'Mumbai',
          state: 'MH',
          zip: '400001',
          country: 'India',
          isDefault: true,
        },
        paymentMethod: 'UPI',
        deliveryMethod: 'Standard',
        shippingCost: 50,
      },
      {
        id: 'ORD-789012',
        date: '2023-10-28',
        total: 850,
        status: 'Processing',
        items: [],
        shippingAddress: {
          id: 'addr2',
          type: 'Work',
          street: '45 Curry Road, Delhi',
          city: 'Delhi',
          state: 'DL',
          zip: '110001',
          country: 'India',
          isDefault: false,
        },
        billingAddress: {
          id: 'addr2',
          type: 'Work',
          street: '45 Curry Road, Delhi',
          city: 'Delhi',
          state: 'DL',
          zip: '110001',
          country: 'India',
          isDefault: false,
        },
        paymentMethod: 'Card',
        deliveryMethod: 'Express',
        shippingCost: 100,
      },
    ]);
    // Mock reviews for moderation
    // BaseReview usually doesn't have productId if it's nested in Product, but let's cast or adjust
    setReviews([
      {
        id: 1,
        author: 'Anita R.',
        rating: 5,
        comment: 'Excellent quality turmeric!',
        date: '2023-10-20',
        helpful: 12,
        verifiedPurchase: true,
      } as BaseReview,
      {
        id: 2,
        author: 'Rajesh K.',
        rating: 4,
        comment: 'Good aroma but packaging could be better.',
        date: '2023-10-22',
        helpful: 3,
        verifiedPurchase: true,
      } as BaseReview,
      {
        id: 3,
        author: 'Sneha P.',
        rating: 5,
        comment: 'Authentic Kashmiri chilli.',
        date: '2023-10-24',
        helpful: 8,
        verifiedPurchase: true,
      } as any,
    ]);
  }, []);

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    console.log('Delete', id);
  };

  const handleSave = async (product: Product) => {
    console.log('Save', product);
    setIsModalOpen(false);
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {};
  const fetchData = () => {};

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-8">
        Admin Dashboard
      </h2>
      <div className="border-b border-gray-200 overflow-x-auto">
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
            onClick={() => setActiveTab('affiliates')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'affiliates' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            🤝 Affiliates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Analytics
          </button>
          {/* ... other buttons ... */}
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
        {activeTab === 'affiliates' && <AffiliatesTab />}
        {activeTab === 'analytics' && <div>Analytics Dashboard (Coming Soon)</div>}
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

const ReviewModeration: React.FC<{ reviews: BaseReview[]; onUpdate: () => void }> = ({
  reviews,
  onUpdate,
}) => {
  return (
    <div>
      <h3 className="text-xl font-serif font-bold mb-6">Review Moderation</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {review.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                  {'★'.repeat(review.rating)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{review.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button className="text-green-600 hover:text-green-900 font-medium">
                    Approve
                  </button>
                  <button className="text-red-600 hover:text-red-900 font-medium">Reject</button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No pending reviews.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContentManagement: React.FC<{ content: ContentState; onUpdate: () => void }> = ({
  content,
  onUpdate,
}) => {
  return (
    <div>
      <h3 className="text-xl font-serif font-bold mb-6">Content Management</h3>
      <p className="text-gray-500">Coming Soon</p>
    </div>
  );
};

export default AdminDashboard;
