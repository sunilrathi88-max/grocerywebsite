import React from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';

interface DashboardStatProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

const DashboardStat: React.FC<DashboardStatProps> = ({ label, value, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {trend} {trendUp ? '↑' : '↓'}
        </span>
      )}
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  // Mock Data
  const recentActivity = [
    { id: 1, text: 'New order #1024 from Sarah M.', time: '5 mins ago', type: 'order' },
    {
      id: 2,
      text: 'Product "Kashmiri Chilli" stock low (5 left)',
      time: '1 hour ago',
      type: 'alert',
    },
    { id: 3, text: 'New review for "Garam Masala" (5 stars)', time: '2 hours ago', type: 'review' },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStat label="Total Revenue" value="₹1,24,500" trend="12%" trendUp />
        <DashboardStat label="Orders Today" value="45" trend="5%" trendUp />
        <DashboardStat label="Active Customers" value="1,240" trend="2%" trendUp />
        <DashboardStat label="Avg. Order Value" value="₹850" trend="3%" trendUp={false} />
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Overview</h3>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center text-gray-400">
            [Chart Visualization Placeholder]
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <div
                  className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                    item.type === 'order'
                      ? 'bg-blue-500'
                      : item.type === 'alert'
                        ? 'bg-red-500'
                        : 'bg-orange-500'
                  }`}
                />
                <div>
                  <p className="text-gray-800 font-medium">{item.text}</p>
                  <p className="text-gray-400 text-xs">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-brand-primary font-bold text-sm hover:underline">
            View All Activity
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
