import React, { useEffect, useState } from 'react';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { XIcon } from './icons/XIcon';

interface PurchaseNotification {
  id: number;
  productName: string;
  location: string;
  timeAgo: string;
}

// Mock data - in production, this would come from real purchase events
const MOCK_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Kochi',
];

const PRODUCT_NAMES = [
  'Premium Saffron',
  'Kashmiri Chili',
  'Turmeric Powder',
  'Cardamom',
  'Black Pepper',
  'Cinnamon Sticks',
  'Cloves',
  'Bay Leaves',
  'Cashews',
  'Almonds',
  'Pistachios',
  'Dried Figs',
];

export const SocialProofNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialDelay = setTimeout(() => {
      showNotification();
    }, 3000);

    // Then show notifications every 10-15 seconds
    const interval = setInterval(
      () => {
        showNotification();
      },
      Math.random() * 5000 + 10000
    ); // 10-15 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const showNotification = () => {
    const notification: PurchaseNotification = {
      id: nextId,
      productName: PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)],
      location: MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)],
      timeAgo: Math.floor(Math.random() * 30 + 1) + ' minutes ago',
    };

    setNotifications((prev) => [...prev, notification]);
    setNextId((prev) => prev + 1);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(notification.id);
    }, 5000);
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm animate-slide-in-left"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <CheckBadgeIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Someone in{' '}
                <span className="font-bold text-brand-primary">{notification.location}</span>
              </p>
              <p className="text-sm text-gray-600 truncate">
                purchased <span className="font-semibold">{notification.productName}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{notification.timeAgo}</p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SocialProofNotifications;
