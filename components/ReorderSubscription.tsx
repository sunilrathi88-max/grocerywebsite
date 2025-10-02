import { useState } from 'react';
import { motion } from 'framer-motion';
import { Order, Subscription, SubscriptionItem } from '../types';
import { mockOrders, mockSubscription } from '../data/mockData';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface ReorderSubscriptionProps {
  onAddToCart: (productId: number, quantity: number) => void;
}

export function ReorderSubscription({ onAddToCart }: ReorderSubscriptionProps) {
  const [orders] = useState<Order[]>(mockOrders);
  const [subscription, setSubscription] = useState<Subscription | null>(mockSubscription);
  const [isEditingSubscription, setIsEditingSubscription] = useState(false);
  const [editedItems, setEditedItems] = useState<SubscriptionItem[]>([]);

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      onAddToCart(item.productId, item.quantity);
    });
  };

  const handleStartEditSubscription = () => {
    if (subscription) {
      setEditedItems([...subscription.items]);
      setIsEditingSubscription(true);
    }
  };

  const handleSaveSubscription = () => {
    if (subscription && editedItems.length > 0) {
      setSubscription({
        ...subscription,
        items: editedItems
      });
      setIsEditingSubscription(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingSubscription(false);
    setEditedItems([]);
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setEditedItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setEditedItems(items => items.filter(item => item.id !== itemId));
  };

  const handlePauseSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: 'paused'
      });
    }
  };

  const handleResumeSubscription = () => {
    if (subscription) {
      setSubscription({
        ...subscription,
        status: 'active'
      });
    }
  };

  const handleChangeFrequency = (frequency: 'weekly' | 'biweekly' | 'monthly') => {
    if (subscription) {
      setSubscription({
        ...subscription,
        frequency
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Smart Reorder & Subscriptions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Previous Orders</h2>
          <p className="text-gray-600 mb-6">Quickly reorder from your past purchases</p>

          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #{order.id.slice(-4)}</p>
                    <p className="text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map(item => (
                    <p key={item.id} className="text-sm text-gray-700">
                      Product #{item.productId} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <p className="font-bold">₹{order.totalAmount}</p>
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                  >
                    Reorder
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Active Subscription</h2>
          <p className="text-gray-600 mb-6">Manage your recurring deliveries</p>

          {subscription ? (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-lg">
                      {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)} Delivery
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Next delivery: {subscription.nextDeliveryDate.toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="font-medium mb-2">Delivery Address:</p>
                  <p className="text-sm text-gray-700">{subscription.deliveryAddress}</p>
                </div>

                <div className="mb-4">
                  <p className="font-medium mb-3">Items:</p>
                  <div className="space-y-2">
                    {(isEditingSubscription ? editedItems : subscription.items).map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white rounded p-2">
                        <span className="text-sm">Product #{item.productId}</span>
                        {isEditingSubscription ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -100)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium w-12 text-center">
                              {item.quantity}g
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 100)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="ml-2 text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-medium">{item.quantity}g</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {!isEditingSubscription && (
                  <div className="mb-4">
                    <p className="font-medium mb-2">Change Frequency:</p>
                    <div className="flex gap-2">
                      {(['weekly', 'biweekly', 'monthly'] as const).map(freq => (
                        <button
                          key={freq}
                          onClick={() => handleChangeFrequency(freq)}
                          className={`px-3 py-1 rounded-lg text-sm ${
                            subscription.frequency === freq
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {isEditingSubscription ? (
                    <>
                      <button
                        onClick={handleSaveSubscription}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleStartEditSubscription}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Edit Items
                      </button>
                      {subscription.status === 'active' ? (
                        <button
                          onClick={handlePauseSubscription}
                          className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={handleResumeSubscription}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Resume
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Subscription Benefits</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Never run out of essentials</li>
                  <li>✓ Automatic deliveries on schedule</li>
                  <li>✓ Pause or modify anytime</li>
                  <li>✓ Priority delivery slots</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active subscription</p>
              <button className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                Create Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
