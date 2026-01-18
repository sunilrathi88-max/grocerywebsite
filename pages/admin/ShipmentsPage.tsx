/**
 * Admin Shipments Dashboard
 * Manage all shipments, generate AWB, print labels
 */

import React, { useState } from 'react';
import { OrderShipmentData, ShippingOption } from '../../types/shipping';
import {
  generateAWB,
  generateLabel,
  requestPickup,
  getShippingRates,
} from '../../utils/shiprocketService';

// Mock data for demonstration - in production, fetch from database
const mockShipments: OrderShipmentData[] = [
  {
    orderId: 'ORD-2024-001',
    shipmentId: 12345,
    awbCode: 'AWB123456789',
    courierId: 1,
    courierName: 'Delhivery',
    status: 'shipped',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
  },
  {
    orderId: 'ORD-2024-002',
    shipmentId: 12346,
    awbCode: null,
    courierId: null,
    courierName: null,
    status: 'pending',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
  },
  {
    orderId: 'ORD-2024-003',
    shipmentId: 12347,
    awbCode: 'AWB987654321',
    courierId: 2,
    courierName: 'BlueDart',
    status: 'in_transit',
    createdAt: '2024-01-14T15:00:00Z',
    updatedAt: '2024-01-16T11:30:00Z',
  },
  {
    orderId: 'ORD-2024-004',
    shipmentId: 12348,
    awbCode: 'AWB456789123',
    courierId: 1,
    courierName: 'Delhivery',
    status: 'delivered',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
  },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  rto: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  rto: 'RTO',
  cancelled: 'Cancelled',
};

const ShipmentsPage: React.FC = () => {
  const [shipments, setShipments] = useState<OrderShipmentData[]>(mockShipments);
  const [filter, setFilter] = useState<string>('all');
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [showCourierModal, setShowCourierModal] = useState<{
    shipmentId: number;
    orderId: string;
  } | null>(null);
  const [courierOptions, setCourierOptions] = useState<ShippingOption[]>([]);

  const filteredShipments =
    filter === 'all' ? shipments : shipments.filter((s) => s.status === filter);

  const handleSelectAll = () => {
    if (selectedShipments.size === filteredShipments.length) {
      setSelectedShipments(new Set());
    } else {
      setSelectedShipments(new Set(filteredShipments.map((s) => s.orderId)));
    }
  };

  const handleSelectShipment = (orderId: string) => {
    const newSelected = new Set(selectedShipments);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedShipments(newSelected);
  };

  const handleGenerateAWB = async (shipment: OrderShipmentData) => {
    if (shipment.awbCode) return;

    setLoading(shipment.orderId);

    try {
      // Fetch courier options first
      const options = await getShippingRates('400001', '560001', 0.5);
      setCourierOptions(options);
      setShowCourierModal({ shipmentId: shipment.shipmentId, orderId: shipment.orderId });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch courier options');
    } finally {
      setLoading(null);
    }
  };

  const handleConfirmCourier = async (courierId: number, courierName: string) => {
    if (!showCourierModal) return;

    setLoading(showCourierModal.orderId);

    try {
      const result = await generateAWB(showCourierModal.shipmentId, courierId);

      // Update shipment in state
      setShipments((prev) =>
        prev.map((s) =>
          s.orderId === showCourierModal.orderId
            ? {
                ...s,
                awbCode: result.response.data.awb_code,
                courierId,
                courierName,
                status: 'processing' as const,
              }
            : s
        )
      );

      setShowCourierModal(null);
      alert(`AWB Generated: ${result.response.data.awb_code}`);
    } catch (error) {
      console.error('Error generating AWB:', error);
      alert('Failed to generate AWB');
    } finally {
      setLoading(null);
    }
  };

  const handlePrintLabel = async (shipment: OrderShipmentData) => {
    if (!shipment.awbCode) return;

    setLoading(shipment.orderId);

    try {
      const labelUrl = await generateLabel(shipment.shipmentId);
      window.open(labelUrl, '_blank');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate label');
    } finally {
      setLoading(null);
    }
  };

  const handleRequestPickup = async (shipment: OrderShipmentData) => {
    setLoading(shipment.orderId);

    try {
      await requestPickup(shipment.shipmentId);
      alert('Pickup requested successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to request pickup');
    } finally {
      setLoading(null);
    }
  };

  const handleBulkPrintLabels = async () => {
    const selectedWithAWB = shipments.filter((s) => selectedShipments.has(s.orderId) && s.awbCode);

    if (selectedWithAWB.length === 0) {
      alert('No shipments with AWB selected');
      return;
    }

    // In production, implement bulk label generation
    alert(`Printing labels for ${selectedWithAWB.length} shipments`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">📦 Shipments</h1>
            <p className="text-gray-600">Manage orders and generate shipping labels</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBulkPrintLabels}
              disabled={selectedShipments.size === 0}
              className="px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🖨️ Print Labels ({selectedShipments.size})
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            {
              status: 'pending',
              count: shipments.filter((s) => s.status === 'pending').length,
              icon: '⏳',
            },
            {
              status: 'processing',
              count: shipments.filter((s) => s.status === 'processing').length,
              icon: '🔄',
            },
            {
              status: 'shipped',
              count: shipments.filter((s) => ['shipped', 'in_transit'].includes(s.status)).length,
              icon: '🚚',
            },
            {
              status: 'delivered',
              count: shipments.filter((s) => s.status === 'delivered').length,
              icon: '✅',
            },
            {
              status: 'rto',
              count: shipments.filter((s) => s.status === 'rto').length,
              icon: '↩️',
            },
          ].map((stat) => (
            <button
              key={stat.status}
              onClick={() => setFilter(stat.status === filter ? 'all' : stat.status)}
              className={`p-4 rounded-xl border-2 transition-all ${
                filter === stat.status
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-2xl">{stat.icon}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-500 capitalize">{stat.status}</p>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedShipments.size === filteredShipments.length &&
                      filteredShipments.length > 0
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Order ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">AWB</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Courier</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((shipment) => (
                <tr key={shipment.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedShipments.has(shipment.orderId)}
                      onChange={() => handleSelectShipment(shipment.orderId)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-gray-900">{shipment.orderId}</span>
                  </td>
                  <td className="p-4">
                    {shipment.awbCode ? (
                      <span className="font-mono text-sm text-gray-700">{shipment.awbCode}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-gray-700">{shipment.courierName || '—'}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}
                    >
                      {statusLabels[shipment.status]}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(shipment.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!shipment.awbCode && (
                        <button
                          onClick={() => handleGenerateAWB(shipment)}
                          disabled={loading === shipment.orderId}
                          className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                        >
                          {loading === shipment.orderId ? '...' : 'Generate AWB'}
                        </button>
                      )}
                      {shipment.awbCode && (
                        <>
                          <button
                            onClick={() => handlePrintLabel(shipment)}
                            disabled={loading === shipment.orderId}
                            className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
                          >
                            🏷️ Label
                          </button>
                          <button
                            onClick={() => handleRequestPickup(shipment)}
                            disabled={
                              loading === shipment.orderId || shipment.status !== 'processing'
                            }
                            className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                          >
                            📦 Pickup
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Courier Selection Modal */}
        {showCourierModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Select Courier</h2>
                <p className="text-sm text-gray-500">
                  Choose a courier for {showCourierModal.orderId}
                </p>
              </div>
              <div className="p-6 space-y-3">
                {courierOptions.map((option) => (
                  <button
                    key={option.courierId}
                    onClick={() => handleConfirmCourier(option.courierId, option.courierName)}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-brand-primary transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{option.courierName}</p>
                        <p className="text-sm text-gray-500">
                          {option.estimatedDays} days delivery
                        </p>
                      </div>
                      <span className="text-lg font-bold text-brand-primary">₹{option.price}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCourierModal(null)}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentsPage;
