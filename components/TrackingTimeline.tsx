/**
 * TrackingTimeline Component
 * Visual timeline showing shipment progress and activities
 */

import React from 'react';
import { TrackingActivity } from '../types/shipping';

interface TrackingTimelineProps {
  activities: TrackingActivity[];
  currentStatus: string;
  edd?: string | null;
}

const statusIcons: Record<string, string> = {
  'PICKED UP': '📦',
  'IN TRANSIT': '🚚',
  'OUT FOR DELIVERY': '🛵',
  DELIVERED: '✅',
  PENDING: '⏳',
  RTO: '↩️',
  CANCELLED: '❌',
  DISPATCHED: '📤',
  ARRIVED: '📍',
};

const getStatusIcon = (status: string): string => {
  const upperStatus = status.toUpperCase();
  for (const [key, icon] of Object.entries(statusIcons)) {
    if (upperStatus.includes(key)) return icon;
  }
  return '📍';
};

const getStatusColor = (status: string): string => {
  const upperStatus = status.toUpperCase();
  if (upperStatus.includes('DELIVERED')) return 'bg-green-500';
  if (upperStatus.includes('OUT FOR DELIVERY')) return 'bg-blue-500';
  if (upperStatus.includes('TRANSIT') || upperStatus.includes('DISPATCHED')) return 'bg-amber-500';
  if (upperStatus.includes('PICKED')) return 'bg-purple-500';
  if (upperStatus.includes('RTO') || upperStatus.includes('CANCELLED')) return 'bg-red-500';
  return 'bg-gray-400';
};

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ activities, currentStatus, edd }) => {
  const isDelivered = currentStatus.toUpperCase().includes('DELIVERED');

  return (
    <div className="space-y-6">
      {/* Current Status Header */}
      <div
        className={`p-4 rounded-xl ${isDelivered ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} border`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <p className={`text-xl font-bold ${isDelivered ? 'text-green-700' : 'text-blue-700'}`}>
              {getStatusIcon(currentStatus)} {currentStatus}
            </p>
          </div>
          {edd && !isDelivered && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="text-lg font-bold text-gray-800">{edd}</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between items-center">
          {['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'].map((step, index) => {
            const stepUpper = step.toUpperCase();
            const isActive =
              activities.some((a) => a.status.toUpperCase().includes(stepUpper.replace(' ', ''))) ||
              currentStatus.toUpperCase().includes(stepUpper.replace(' ', ''));

            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 ${
                    isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  {isActive ? '✓' : index + 1}
                </div>
                <span
                  className={`text-xs mt-2 text-center ${isActive ? 'text-green-700 font-medium' : 'text-gray-500'}`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: isDelivered
                ? '100%'
                : currentStatus.includes('OUT FOR DELIVERY')
                  ? '75%'
                  : currentStatus.includes('TRANSIT')
                    ? '50%'
                    : currentStatus.includes('PICKED')
                      ? '25%'
                      : '0%',
            }}
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-8">
        <h3 className="text-lg font-serif font-bold mb-4">Shipment Activity</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Timeline dot */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-lg z-10 ${
                    index === 0 ? getStatusColor(activity.status) : 'bg-gray-100'
                  }`}
                >
                  {index === 0 ? (
                    <span className="text-white text-sm">{getStatusIcon(activity.status)}</span>
                  ) : (
                    <span className="text-gray-400">•</span>
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-4 ${index === 0 ? '' : 'opacity-75'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className={`font-medium ${index === 0 ? 'text-gray-900' : 'text-gray-600'}`}
                      >
                        {activity.activity}
                      </p>
                      <p className="text-sm text-gray-500">{activity.location}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>
                        {new Date(activity.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p>
                        {new Date(activity.date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingTimeline;
