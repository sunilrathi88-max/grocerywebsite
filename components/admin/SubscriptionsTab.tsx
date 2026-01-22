import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Subscription {
    id: string;
    customerEmail: string;
    customerName: string;
    plan: 'weekly' | 'biweekly' | 'monthly';
    products: { name: string; quantity: number }[];
    status: 'active' | 'paused' | 'cancelled';
    nextDelivery: string;
    totalValue: number;
    startedAt: string;
    paidMonths: number;
}

const SAMPLE_SUBSCRIPTIONS: Subscription[] = [
    {
        id: '1',
        customerEmail: 'priya.sharma@gmail.com',
        customerName: 'Priya Sharma',
        plan: 'monthly',
        products: [
            { name: 'Organic Turmeric Powder (200g)', quantity: 2 },
            { name: 'Malabar Black Pepper (250g)', quantity: 1 },
        ],
        status: 'active',
        nextDelivery: '2025-02-01',
        totalValue: 599,
        startedAt: '2024-10-15',
        paidMonths: 4,
    },
    {
        id: '2',
        customerEmail: 'vikram.mehta@yahoo.com',
        customerName: 'Vikram Mehta',
        plan: 'biweekly',
        products: [
            { name: 'Premium Garam Masala (100g)', quantity: 1 },
            { name: 'Kashmiri Red Chilli (200g)', quantity: 1 },
        ],
        status: 'active',
        nextDelivery: '2025-01-28',
        totalValue: 449,
        startedAt: '2024-11-01',
        paidMonths: 3,
    },
    {
        id: '3',
        customerEmail: 'anita.desai@outlook.com',
        customerName: 'Anita Desai',
        plan: 'monthly',
        products: [
            { name: 'Organic Cumin Seeds (250g)', quantity: 1 },
            { name: 'Coriander Powder (200g)', quantity: 2 },
            { name: 'Mustard Seeds (100g)', quantity: 1 },
        ],
        status: 'active',
        nextDelivery: '2025-02-05',
        totalValue: 750,
        startedAt: '2024-09-01',
        paidMonths: 5,
    },
    {
        id: '4',
        customerEmail: 'rahul.krishnan@gmail.com',
        customerName: 'Rahul Krishnan',
        plan: 'weekly',
        products: [
            { name: 'Kerala Cardamom (50g)', quantity: 1 },
        ],
        status: 'paused',
        nextDelivery: '-',
        totalValue: 399,
        startedAt: '2024-12-01',
        paidMonths: 2,
    },
    {
        id: '5',
        customerEmail: 'neha.joshi@hotmail.com',
        customerName: 'Neha Joshi',
        plan: 'monthly',
        products: [
            { name: 'Sambar Powder (200g)', quantity: 2 },
            { name: 'Rasam Powder (150g)', quantity: 1 },
        ],
        status: 'active',
        nextDelivery: '2025-02-10',
        totalValue: 499,
        startedAt: '2024-11-15',
        paidMonths: 3,
    },
    {
        id: '6',
        customerEmail: 'amit.verma@gmail.com',
        customerName: 'Amit Verma',
        plan: 'biweekly',
        products: [
            { name: 'Chaat Masala (100g)', quantity: 2 },
        ],
        status: 'cancelled',
        nextDelivery: '-',
        totalValue: 250,
        startedAt: '2024-08-01',
        paidMonths: 2,
    },
    {
        id: '7',
        customerEmail: 'kavitha.raman@yahoo.com',
        customerName: 'Kavitha Raman',
        plan: 'monthly',
        products: [
            { name: 'Premium Saffron (1g)', quantity: 1 },
        ],
        status: 'active',
        nextDelivery: '2025-02-15',
        totalValue: 550,
        startedAt: '2024-10-01',
        paidMonths: 4,
    },
];

const SubscriptionsTab: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('tattva_subscriptions');
        if (saved) {
            setSubscriptions(JSON.parse(saved));
        } else {
            setSubscriptions(SAMPLE_SUBSCRIPTIONS);
            localStorage.setItem('tattva_subscriptions', JSON.stringify(SAMPLE_SUBSCRIPTIONS));
        }
    }, []);

    const saveSubscriptions = (updated: Subscription[]) => {
        setSubscriptions(updated);
        localStorage.setItem('tattva_subscriptions', JSON.stringify(updated));
    };

    const handleStatusChange = (id: string, newStatus: 'active' | 'paused' | 'cancelled') => {
        const updated = subscriptions.map((s) =>
            s.id === id
                ? {
                    ...s,
                    status: newStatus,
                    nextDelivery: newStatus === 'active'
                        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        : '-',
                }
                : s
        );
        saveSubscriptions(updated);
        toast.success(`Subscription ${newStatus}`);
    };

    const filteredSubscriptions = subscriptions.filter((s) => {
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesSearch =
            s.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Stats
    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const pausedCount = subscriptions.filter((s) => s.status === 'paused').length;
    const cancelledCount = subscriptions.filter((s) => s.status === 'cancelled').length;
    const monthlyRecurring = subscriptions
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => sum + s.totalValue, 0);

    const getPlanBadgeColor = (plan: string) => {
        switch (plan) {
            case 'weekly':
                return 'bg-purple-100 text-purple-800';
            case 'biweekly':
                return 'bg-blue-100 text-blue-800';
            case 'monthly':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'paused':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-serif font-bold">Subscription Management</h3>
                <p className="text-sm text-gray-500">Manage recurring orders and subscriptions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-500">Total Subscriptions</p>
                    <p className="text-2xl font-bold text-brand-dark">{subscriptions.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-500">Paused</p>
                    <p className="text-2xl font-bold text-yellow-600">{pausedCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-500">Monthly Recurring</p>
                    <p className="text-2xl font-bold text-brand-primary">₹{monthlyRecurring}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                />
                <div className="flex gap-2">
                    {(['all', 'active', 'paused', 'cancelled'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                ? 'bg-brand-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Delivery</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-brand-dark font-bold">
                                                {sub.customerName.charAt(0)}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{sub.customerName}</p>
                                                <p className="text-xs text-gray-500">{sub.customerEmail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPlanBadgeColor(sub.plan)}`}>
                                            {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            {sub.products.map((p, i) => (
                                                <span key={i}>
                                                    {p.name} ×{p.quantity}
                                                    {i < sub.products.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-primary">
                                        ₹{sub.totalValue}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {sub.nextDelivery !== '-' ? new Date(sub.nextDelivery).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(sub.status)}`}>
                                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                        {sub.status === 'active' && (
                                            <button
                                                onClick={() => handleStatusChange(sub.id, 'paused')}
                                                className="text-yellow-600 hover:text-yellow-800 font-medium"
                                            >
                                                Pause
                                            </button>
                                        )}
                                        {sub.status === 'paused' && (
                                            <button
                                                onClick={() => handleStatusChange(sub.id, 'active')}
                                                className="text-green-600 hover:text-green-800 font-medium"
                                            >
                                                Resume
                                            </button>
                                        )}
                                        {sub.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleStatusChange(sub.id, 'cancelled')}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredSubscriptions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No subscriptions found.
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

export default SubscriptionsTab;
