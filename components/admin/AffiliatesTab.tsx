import React, { useState } from 'react';

interface AffiliateApplication {
  id: number;
  name: string;
  email: string;
  instagram: string;
  website: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const MOCK_APPLICATIONS: AffiliateApplication[] = [
  {
    id: 1,
    name: 'Aditi Sharma',
    email: 'aditi@foodblog.com',
    instagram: '@aditi_cooks',
    website: 'aditicooks.com',
    status: 'pending',
    date: '2025-01-25',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    email: 'rahul.v@gmail.com',
    instagram: '@rahul_eats',
    website: 'youtube.com/rahuleats',
    status: 'pending',
    date: '2025-01-24',
  },
  {
    id: 3,
    name: 'Priya Kitchen',
    email: 'contact@priyakitchen.in',
    instagram: '@priyakitchen',
    website: 'priyakitchen.in',
    status: 'approved',
    date: '2025-01-20',
  },
];

const AffiliatesTab: React.FC = () => {
  const [applications, setApplications] = useState<AffiliateApplication[]>(MOCK_APPLICATIONS);

  const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Affiliate Applications</h3>
        <div className="bg-brand-secondary/20 text-brand-secondary px-4 py-2 rounded-lg text-sm font-bold">
          {applications.filter((a) => a.status === 'pending').length} Pending Requests
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Social
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0">
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{app.instagram}</div>
                  <div className="text-xs text-blue-500 truncate max-w-xs">{app.website}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      app.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {app.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(app.id, 'approved')}
                        className="text-green-600 hover:text-green-900 font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === 'approved' && (
                    <button className="text-gray-400 cursor-not-allowed">Email Sent</button>
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

export default AffiliatesTab;
