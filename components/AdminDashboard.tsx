
import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';
import ProductFormModal from './ProductFormModal';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
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
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-8">Admin Dashboard</h2>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('products')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Orders</button>
        </nav>
      </div>
      
      <div className="mt-8">
        {activeTab === 'products' && <ProductManagement products={props.products} onAddNew={handleAddNew} onEdit={handleEdit} onDelete={props.onDeleteProduct} />}
        {activeTab === 'orders' && <OrderManagement orders={props.orders} onUpdateStatus={props.onUpdateOrderStatus} />}
      </div>
      
      {isModalOpen && <ProductFormModal product={editingProduct} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const ProductManagement: React.FC<{products: Product[], onAddNew: () => void, onEdit: (p: Product) => void, onDelete: (id: number) => void}> = ({ products, onAddNew, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-serif font-bold">Manage Products</h3>
      <button onClick={onAddNew} className="flex items-center gap-2 bg-brand-dark text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transition-colors"><PlusIcon /> Add New</button>
    </div>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.variants[0].price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.variants.reduce((sum, v) => sum + v.stock, 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                  <button onClick={() => onEdit(p)} className="text-brand-primary hover:text-brand-dark"><PencilIcon/></button>
                  <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900"><TrashIcon/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const OrderManagement: React.FC<{orders: Order[], onUpdateStatus: (id: string, s: OrderStatus) => void}> = ({ orders, onUpdateStatus }) => (
   <div>
    <h3 className="text-xl font-serif font-bold mb-4">Manage Orders</h3>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
       <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingAddress.street}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
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
