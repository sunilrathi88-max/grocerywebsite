import React from 'react';
import { Order, OrderStatus } from '../types';
import { imageErrorHandlers } from '../utils/imageHelpers';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder?: () => void;
  onCancelOrder?: () => void;
  onInitiateReturn?: () => void;
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  message?: string;
  isCompleted: boolean;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onReorder,
  onCancelOrder,
  onInitiateReturn,
}) => {
  if (!order) return null;

  const getStatusSteps = (currentStatus: OrderStatus): StatusHistoryItem[] => {
    const steps: StatusHistoryItem[] = [
      {
        status: 'Processing',
        timestamp: order.date,
        message: 'Order confirmed',
        isCompleted: true,
      },
      { status: 'Shipped', timestamp: '', message: 'Package shipped', isCompleted: false },
      {
        status: 'Out for Delivery',
        timestamp: '',
        message: 'Out for delivery',
        isCompleted: false,
      },
      { status: 'Delivered', timestamp: '', message: 'Delivered successfully', isCompleted: false },
    ];

    const statusOrder = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    steps.forEach((step, index) => {
      if (index <= currentIndex) {
        step.isCompleted = true;
        if (index === currentIndex && !step.timestamp) {
          step.timestamp = new Date().toISOString();
        }
      }
    });

    if (currentStatus === 'Cancelled') {
      return [
        {
          status: 'Processing',
          timestamp: order.date,
          message: 'Order confirmed',
          isCompleted: true,
        },
        {
          status: 'Cancelled',
          timestamp: new Date().toISOString(),
          message: 'Order cancelled',
          isCompleted: true,
        },
      ];
    }

    return steps;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusSteps = getStatusSteps(order.status);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Order Details</h2>
              <p className="text-white text-opacity-90">Order #{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Order Status Timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="relative">
              {statusSteps.map((step, index) => (
                <div key={index} className="flex items-start mb-6 last:mb-0">
                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                      {step.isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-10 w-0.5 h-12 -ml-px ${step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                      />
                    )}
                  </div>

                  {/* Timeline Content */}
                  <div className="ml-4 flex-1">
                    <p
                      className={`font-semibold ${step.isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                    >
                      {step.status}
                    </p>
                    {step.message && <p className="text-sm text-gray-600 mt-1">{step.message}</p>}
                    {step.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">{formatDate(step.timestamp)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={imageErrorHandlers.thumb}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.selectedVariant.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.selectedVariant.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-medium">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Method:</span>
                  <span className="font-medium text-gray-900">{order.deliveryMethod}</span>
                </div>
                {order.deliverySlot && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Slot:</span>
                    <span className="font-medium text-gray-900">
                      {order.deliverySlot.date} at {order.deliverySlot.time}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>
                  ₹{(order.total - order.shippingCost + (order.discount || 0)).toFixed(2)}
                </span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>₹{order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-300">
                <span>Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
            >
              Close
            </button>
            {order.status === 'Processing' && onCancelOrder && (
              <button
                onClick={onCancelOrder}
                className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all font-medium"
              >
                Cancel Order
              </button>
            )}
            {order.status === 'Delivered' && (
              <>
                {onInitiateReturn && (
                  <button
                    onClick={onInitiateReturn}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
                  >
                    Return Items
                  </button>
                )}
                {onReorder && (
                  <button
                    onClick={onReorder}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
                  >
                    Reorder
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
