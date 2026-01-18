/**
 * TrackingPage
 * Customer-facing order tracking page
 */

import React, { useState } from 'react';
import { ShipmentStatus } from '../types/shipping';
import { trackShipment, trackByOrderId } from '../utils/shiprocketService';
import TrackingTimeline from '../components/TrackingTimeline';

const TrackingPage: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [searchType, setSearchType] = useState<'awb' | 'order'>('order');
  const [shipmentStatus, setShipmentStatus] = useState<ShipmentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingInput.trim()) {
      setError('Please enter a tracking number or order ID');
      return;
    }

    setLoading(true);
    setError(null);
    setShipmentStatus(null);

    try {
      const status =
        searchType === 'awb'
          ? await trackShipment(trackingInput.trim())
          : await trackByOrderId(trackingInput.trim());

      setShipmentStatus(status);
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Unable to find shipment. Please check your tracking number and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-accent/30 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-brand-dark mb-4">
            📦 Track Your Order
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Enter your Order ID or AWB number to get real-time updates on your shipment status.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleTrack} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Search Type Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setSearchType('order')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  searchType === 'order'
                    ? 'bg-brand-primary text-brand-dark'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🛒 Order ID
              </button>
              <button
                type="button"
                onClick={() => setSearchType('awb')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  searchType === 'awb'
                    ? 'bg-brand-primary text-brand-dark'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📄 AWB Number
              </button>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder={
                  searchType === 'order' ? 'Enter Order ID (e.g., ORD-12345)' : 'Enter AWB Number'
                }
                className="w-full px-4 py-4 pr-32 text-lg border-2 border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Tracking...
                  </span>
                ) : (
                  'Track'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              </div>
            )}
          </form>

          {/* Tracking Results */}
          {shipmentStatus && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in">
              {/* Shipment Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">AWB Number</p>
                  <p className="text-xl font-mono font-bold text-brand-dark">
                    {shipmentStatus.awbCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Courier</p>
                  <p className="font-bold text-gray-800">{shipmentStatus.courierName}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-6">
                <TrackingTimeline
                  activities={shipmentStatus.activities}
                  currentStatus={shipmentStatus.currentStatus}
                  edd={shipmentStatus.edd}
                />
              </div>

              {/* Delivered Badge */}
              {shipmentStatus.deliveredDate && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                  <p className="text-green-700 font-bold text-lg">
                    ✅ Delivered on{' '}
                    {new Date(shipmentStatus.deliveredDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Need Help?</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="mailto:support@tattvaco.in"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                📧 support@tattvaco.in
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                💬 WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
