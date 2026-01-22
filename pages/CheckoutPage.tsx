import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { User, Order, CartItem, ToastMessage } from '../types';
import { Helmet } from 'react-helmet-async';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';

interface CheckoutPageProps {
  cartItems?: CartItem[];
  user?: User | null;
  onPlaceOrder?: (order: Order) => void;
  addToast?: (message: string, type: ToastMessage['type']) => void;
  discount?: number;
  promoCode?: string;
  onApplyPromoCode?: (code: string) => void;
  onRemovePromoCode?: () => void;
  subtotal?: number;
  shippingCost?: number;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems: propCartItems,
  user,
  onPlaceOrder,
  addToast,
  discount: propDiscount,
  // promoCode,
  // onApplyPromoCode,
  // onRemovePromoCode,
  subtotal: propSubtotal,
  shippingCost: propShippingCost,
}) => {
  const navigate = useNavigate();
  const storeCartItems = useCartStore((state) => state.items);
  const storeSubtotal = useCartStore((state) => state.getSubtotal());
  const storeDiscount = useCartStore((state) => state.discountAmount);
  const clearCart = useCartStore((state) => state.clearCart);

  const finalCartItems = propCartItems || storeCartItems;
  const finalSubtotal = propSubtotal || storeSubtotal;
  const finalDiscount = propDiscount || storeDiscount;
  const finalShippingCost =
    propShippingCost !== undefined ? propShippingCost : finalSubtotal >= 600 ? 0 : 50;

  const total = finalSubtotal - finalDiscount + finalShippingCost;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Contact, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zip: user?.addresses?.[0]?.zipCode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (finalCartItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [finalCartItems, navigate, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalizeOrder = async () => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const orderId = `ORD-${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString(),
        status: 'Processing',
        total: total,
        items: finalCartItems.map((item) => ({
          product: { ...item, id: parseInt(item.id) },
          quantity: item.quantity,
        })),
        trackingNumber: `TRK-${Math.floor(Math.random() * 10000)}`,
      };

      if (onPlaceOrder) {
        onPlaceOrder(newOrder);
      } else {
        // Fallback if no prop handler
        clearCart();
      }

      if (addToast) addToast(`Order ${orderId} placed successfully!`, 'success');
      setIsProcessing(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Checkout | Rathi Naturals</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 text-neutral-900">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div
                className={`flex flex-col items-center ${step >= 1 ? 'text-brand-primary' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}
                >
                  1
                </div>
                <span className="text-sm font-bold">Shipping</span>
              </div>
              <div
                className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-brand-primary' : 'bg-gray-200'}`}
              />
              <div
                className={`flex flex-col items-center ${step >= 2 ? 'text-brand-primary' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}
                >
                  2
                </div>
                <span className="text-sm font-bold">Payment</span>
              </div>
            </div>

            {/* Step 1: Shipping Form */}
            {step === 1 && (
              <form
                id="shipping-form"
                onSubmit={handleNextStep}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-brand-primary">📍</span> Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      required
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 mb-4 hover:underline"
                >
                  ← Back to Shipping
                </button>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-brand-primary">💳</span> Payment Method
                </h2>

                <div className="space-y-4 mb-8">
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-brand-primary bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-brand-primary' : 'border-gray-400'}`}
                    >
                      {paymentMethod === 'cod' && (
                        <div className="w-3 h-3 rounded-full bg-brand-primary" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold block text-gray-900">Cash on Delivery (COD)</span>
                      <span className="text-sm text-gray-500">Pay when your order arrives</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'upi' ? 'border-brand-primary bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-brand-primary' : 'border-gray-400'}`}
                    >
                      {paymentMethod === 'upi' && (
                        <div className="w-3 h-3 rounded-full bg-brand-primary" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold block text-gray-900">UPI / Online Payment</span>
                      <span className="text-sm text-gray-500">
                        Google Pay, PhonePe, Paytm, Cards
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinalizeOrder}
                  disabled={isProcessing}
                  className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <span>Place Order (₹{total})</span>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                  <span>Secure SSL Encypted Transaction</span>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-2">
                {finalCartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-md overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-md">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.weight}</p>
                    </div>
                    <div className="text-sm font-bold">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{finalSubtotal}</span>
                </div>
                {finalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{finalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{finalShippingCost === 0 ? 'Free' : `₹${finalShippingCost}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-dashed border-gray-200 pt-3 mt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
