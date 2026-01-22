import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

const DEFAULT_COUPON: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'> = {
  code: '',
  discountType: 'percentage',
  discountValue: 10,
  minOrderValue: 0,
  maxUses: 100,
  validFrom: new Date().toISOString().split('T')[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  isActive: true,
};

const DiscountsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('tattva_coupons');
    if (saved) {
      return JSON.parse(saved);
    }
    // Set realistic Tattva Co. promotional coupons
    const sampleCoupons: Coupon[] = [
      {
        id: '1',
        code: 'WELCOME15',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 499,
        maxUses: 1000,
        usedCount: 127,
        validFrom: '2025-01-01',
        validUntil: '2025-12-31',
        isActive: true,
        createdAt: '2025-01-01',
      },
      {
        id: '2',
        code: 'SPICEFEST100',
        discountType: 'fixed',
        discountValue: 100,
        minOrderValue: 799,
        maxUses: 500,
        usedCount: 89,
        validFrom: '2025-01-15',
        validUntil: '2025-03-31',
        isActive: true,
        createdAt: '2025-01-15',
      },
      {
        id: '3',
        code: 'REPUBLIC25',
        discountType: 'percentage',
        discountValue: 25,
        minOrderValue: 999,
        maxUses: 200,
        usedCount: 67,
        validFrom: '2025-01-20',
        validUntil: '2025-01-31',
        isActive: true,
        createdAt: '2025-01-20',
      },
      {
        id: '4',
        code: 'FREESHIP',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 499,
        maxUses: 1000,
        usedCount: 234,
        validFrom: '2025-01-01',
        validUntil: '2025-06-30',
        isActive: true,
        createdAt: '2025-01-01',
      },
      {
        id: '5',
        code: 'BULK20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 2000,
        maxUses: 100,
        usedCount: 23,
        validFrom: '2025-01-01',
        validUntil: '2025-12-31',
        isActive: true,
        createdAt: '2025-01-05',
      },
      {
        id: '6',
        code: 'HOLI50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderValue: 599,
        maxUses: 300,
        usedCount: 0,
        validFrom: '2025-03-01',
        validUntil: '2025-03-15',
        isActive: false,
        createdAt: '2025-01-22',
      },
    ];
    localStorage.setItem('tattva_coupons', JSON.stringify(sampleCoupons));
    return sampleCoupons;
  });
  const [isCreating, setIsCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState(DEFAULT_COUPON);
  const [searchTerm, setSearchTerm] = useState('');

  const saveCoupons = (updatedCoupons: Coupon[]) => {
    setCoupons(updatedCoupons);
    localStorage.setItem('tattva_coupons', JSON.stringify(updatedCoupons));
  };

  const handleCreateCoupon = () => {
    if (!newCoupon.code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (coupons.some((c) => c.code.toUpperCase() === newCoupon.code.toUpperCase())) {
      toast.error('Coupon code already exists');
      return;
    }

    const coupon: Coupon = {
      ...newCoupon,
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };

    saveCoupons([coupon, ...coupons]);
    setNewCoupon(DEFAULT_COUPON);
    setIsCreating(false);
    toast.success(`Coupon ${coupon.code} created!`);
  };

  const handleToggleActive = (id: string) => {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    saveCoupons(updated);
    toast.success('Coupon status updated');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    const updated = coupons.filter((c) => c.id !== id);
    saveCoupons(updated);
    toast.success('Coupon deleted');
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-serif font-bold">Discounts & Coupons</h3>
          <p className="text-sm text-gray-500">Create and manage promotional codes</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90"
        >
          <PlusIcon className="w-5 h-5" /> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Coupons</p>
          <p className="text-2xl font-bold text-brand-dark">{coupons.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeCoupons}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Redemptions</p>
          <p className="text-2xl font-bold text-brand-primary">{totalRedemptions}</p>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h4 className="text-lg font-bold mb-4">Create New Coupon</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary uppercase"
                  placeholder="e.g. SUMMER20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newCoupon.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                  </label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={newCoupon.maxUses}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, maxUses: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valid Until
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
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-brand-primary">{coupon.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} OFF`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : 'No minimum'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        coupon.usedCount >= coupon.maxUses ? 'text-red-500' : 'text-gray-600'
                      }
                    >
                      {coupon.usedCount} / {coupon.maxUses}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(coupon.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(coupon.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No coupons found. Create your first coupon to get started!
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

export default DiscountsTab;
