import React, { useState, useMemo } from 'react';
import { User, Address, Order, ToastMessage, Product, CartItem } from '../types';
import { CartItem as StoreCartItem } from '../store/cartStore';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { XIcon } from './icons/XIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { orderAPI } from '../utils/apiService';
import { paymentService } from '../utils/paymentService';
import { APIErrorDisplay } from './APIErrorDisplay';
import CheckoutStepper from './CheckoutStepper';

// Helper to map flat store items to nested Order items
const mapToOrderItems = (items: StoreCartItem[]): CartItem[] => {
  return items.map((item) => {
    const [productId] = item.id.includes('-') ? item.id.split('-') : [item.id];
    return {
      product: {
        id: parseInt(productId) || 0, // Ensure number if Product expects number, checking types again... Product.id is number. CartItem.id is string? StoreCartItem.id is string.
        name: item.name,
        images: [item.image],
        variants: [], // Required by Product
        reviews: [], // Required by Product
        description: '', // Required by Product
        category: '', // Required by Product
      } as unknown as Product,
      selectedVariant: {
        id: 0,
        name: item.weight,
        price: item.price,
        stock: item.stock,
      } as any, // Variant also has required props
      quantity: item.quantity,
    };
  });
};

interface CheckoutPageProps {
  cartItems: StoreCartItem[];
  user: User | null;
  onPlaceOrder: (order: Order) => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
  discount: number;
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
  onRemovePromoCode: () => void;
  subtotal: number;
  shippingCost: number;
}

const OrderConfirmation: React.FC<{ order: Order }> = ({ order }) => {
  const estimatedDeliveryDate = order.deliverySlot
    ? `${order.deliverySlot.date}, between ${order.deliverySlot.time}`
    : 'in 3-5 business days';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-serif font-bold text-brand-dark">Thank you for your order!</h2>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully. A confirmation email has been sent.
        </p>

        <div className="mt-6 text-left bg-brand-accent/50 p-4 rounded-lg space-y-1">
          <p>
            <strong>Order ID:</strong> <span className="font-mono">{order.id}</span>
          </p>
          <p>
            <strong>Estimated Delivery:</strong> {estimatedDeliveryDate}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-serif font-bold text-left mb-4">Order Summary</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto text-left pr-2">
            {order.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant.id}`}
                className="flex justify-between items-start gap-4"
              >
                <OptimizedImage
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  type="thumbnail"
                  priority="high"
                  width={64}
                  height={64}
                  onError={imageErrorHandlers.thumb}
                />
                <div className="flex-grow">
                  <p className="font-bold text-sm leading-tight">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.selectedVariant.name} x {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold flex-shrink-0">
                  ₹
                  {(
                    (item.selectedVariant.salePrice ?? item.selectedVariant.price) * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg text-brand-dark mt-4 pt-4 border-t">
            <span>Total Paid</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#/"
            className="bg-brand-primary text-brand-dark font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Continue Shopping
          </a>
          <a
            href="#/profile"
            className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            View My Orders
          </a>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const DeliverySlotPicker: React.FC<{
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}> = ({ selectedDate, selectedTime, onSelectDate, onSelectTime }) => {
  const deliveryDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
      });
    }
    return dates;
  }, []);

  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const day = new Date(selectedDate).getDay();
    if (day % 2 === 0) {
      return [
        { time: '09:00 AM - 11:00 AM', available: true },
        { time: '11:00 AM - 01:00 PM', available: true },
        { time: '01:00 PM - 03:00 PM', available: false },
        { time: '03:00 PM - 05:00 PM', available: true },
      ];
    }
    return [
      { time: '10:00 AM - 12:00 PM', available: true },
      { time: '12:00 PM - 02:00 PM', available: false },
      { time: '02:00 PM - 04:00 PM', available: true },
      { time: '04:00 PM - 06:00 PM', available: true },
    ];
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-bold flex items-center gap-2">
        <CalendarIcon /> Delivery Slot
      </h3>
      <div>
        <h4 className="font-bold text-sm text-gray-600 mb-2">Select a Date:</h4>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {deliveryDates.map((date) => (
            <button
              key={date.value}
              type="button"
              onClick={() => onSelectDate(date.value)}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 border text-center ${selectedDate === date.value ? 'bg-brand-primary text-brand-dark border-brand-primary shadow-md' : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'}`}
            >
              <span className="block">{date.label}</span>
              <span className="block text-lg">{date.day}</span>
            </button>
          ))}
        </div>
      </div>
      {selectedDate && (
        <div>
          <h4 className="font-bold text-sm text-gray-600 mb-2">Select a Time:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => onSelectTime(slot.time)}
                disabled={!slot.available}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 border text-center ${selectedTime === slot.time ? 'bg-brand-primary text-brand-dark border-brand-primary shadow-md' : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'} ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : ''}`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Move AddressForm outside to avoid creating component during render
const AddressForm: React.FC<{
  address: Omit<Address, 'id' | 'type' | 'isDefault'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
  title: string;
  userName?: string;
}> = ({ address, onChange, onBlur, errors = {}, title, userName }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-serif font-bold">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={userName || ''}
          className="mt-1 input-field"
          required
        />
      </div>
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          name="street"
          value={address.street}
          onChange={onChange}
          onBlur={onBlur}
          className={`mt-1 input-field ${errors.street ? 'border-red-500' : ''}`}
          required
        />
        {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          name="city"
          value={address.city}
          onChange={onChange}
          onBlur={onBlur}
          className={`mt-1 input-field ${errors.city ? 'border-red-500' : ''}`}
          required
        />
        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State / Province
        </label>
        <input
          type="text"
          name="state"
          value={address.state}
          onChange={onChange}
          onBlur={onBlur}
          className={`mt-1 input-field ${errors.state ? 'border-red-500' : ''}`}
          required
        />
        {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
      </div>
      <div>
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
          PIN Code
        </label>
        <input
          type="text"
          name="zip"
          value={address.zip}
          onChange={onChange}
          onBlur={onBlur}
          className={`mt-1 input-field ${errors.zip ? 'border-red-500' : ''}`}
          required
        />
        {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          name="country"
          value={address.country}
          onChange={onChange}
          onBlur={onBlur}
          className="mt-1 input-field"
          required
        />
      </div>
    </div>
  </div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  user,
  onPlaceOrder,
  addToast,
  discount,
  promoCode,
  onApplyPromoCode,
  onRemovePromoCode,
  subtotal,
  shippingCost,
}) => {
  const defaultShipping = user?.addresses.find((a) => a.isDefault && a.type === 'Shipping') ||
    user?.addresses[0] || { street: '', city: '', state: '', zip: '', country: '' };

  const [shippingAddress, setShippingAddress] =
    useState<Omit<Address, 'id' | 'type' | 'isDefault'>>(defaultShipping);
  const [billingAddress, setBillingAddress] =
    useState<Omit<Address, 'id' | 'type' | 'isDefault'>>(defaultShipping);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [localPromoCode, setLocalPromoCode] = useState('');

  const tax = useMemo(() => (subtotal - discount) * 0.08, [subtotal, discount]);
  const total = useMemo(
    () => subtotal + shippingCost + tax - discount,
    [subtotal, shippingCost, tax, discount]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value && name !== 'address2') {
      error = 'This field is required';
    } else if (name === 'guestEmail' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email address';
    } else if (name === 'guestPhone' && !/^\+?[\d\s-]{10,}$/.test(value)) {
      error = 'Invalid phone number';
    } else if (name === 'zip' && !/^\d{6}$/.test(value)) {
      error = 'Invalid PIN code';
    }
    return error;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setter((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    if (!user) {
      if (!guestEmail) newErrors.guestEmail = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(guestEmail)) newErrors.guestEmail = 'Invalid email';

      if (!guestPhone) newErrors.guestPhone = 'Phone is required';
      else if (!/^\+?[\d\s-]{10,}$/.test(guestPhone)) newErrors.guestPhone = 'Invalid phone';
    }

    // Basic address validation (simplified for brevity)
    if (!shippingAddress.street) newErrors.street = 'Street is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State is required';
    if (!shippingAddress.zip) newErrors.zip = 'ZIP is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please fix the errors in the form.', 'error');
      return;
    }

    if (cartItems.length === 0) {
      addToast('Your cart is empty.', 'error');
      return;
    }
    if (!user && (!guestEmail || !guestPhone)) {
      addToast('Please provide your contact information.', 'error');
      return;
    }
    if (!selectedDate || !selectedTime) {
      addToast('Please select a delivery slot.', 'error');
      return;
    }
    if (!paymentMethod) {
      addToast('Please select a payment method.', 'error');
      return;
    }
    if (paymentMethod === 'UPI' && !upiId) {
      addToast('Please enter your UPI ID.', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const processOrder = async (paymentId?: string) => {
      try {
        const orderData = {
          items: mapToOrderItems(cartItems),
          total: total,
          shippingAddress: { ...shippingAddress, id: '', type: 'Shipping' as const },
          billingAddress: useSameAddress
            ? { ...shippingAddress, id: '', type: 'Billing' as const }
            : { ...billingAddress, id: '', type: 'Billing' as const },
          deliveryMethod: 'Standard' as const,
          paymentMethod: paymentMethod,
          shippingCost: shippingCost,
          discount,
          deliverySlot: {
            date: new Date(selectedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            time: selectedTime,
          },
          guestEmail: !user ? guestEmail : undefined,
          guestPhone: !user ? guestPhone : undefined,
          paymentId: paymentId,
          userId: user?.id.toString(), // Pass user ID if logged in
        };

        // Try API first
        const confirmedOrder = await orderAPI.create(orderData);
        setOrderConfirmation(confirmedOrder.data);
        onPlaceOrder(confirmedOrder.data);
        addToast('Order placed successfully!', 'success');
      } catch (_error) {
        console.error('Order creation failed:', _error);
        setSubmitError(_error instanceof Error ? _error.message : 'Failed to create order');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (paymentMethod === 'Cash on Delivery') {
      processOrder();
    } else {
      // Save state before redirecting
      localStorage.setItem(
        'checkout_state',
        JSON.stringify({
          shippingAddress,
          billingAddress,
          useSameAddress,
          guestEmail,
          guestPhone,
          selectedDate,
          selectedTime,
          paymentMethod,
        })
      );

      // Initialize Payment (Cashfree)
      paymentService.initializePayment(
        total,
        {
          id: user?.id.toString() || 'guest',
          name: user?.name || 'Guest',
          email: user?.email || guestEmail,
          phone: user?.phone || guestPhone,
        },
        (orderId) => {
          // Payment Success (this callback might not fire if redirected, handled by useEffect below)
          processOrder(orderId);
        },
        (error) => {
          // Payment Failed
          addToast(typeof error === 'string' ? error : 'Payment failed', 'error');
          setIsSubmitting(false);
        }
      );
    }
  };

  // Payment Verification & State Restoration
  React.useEffect(() => {
    const savedState = localStorage.getItem('checkout_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore if we are not already submitting (avoid overwrite loops)
        if (!user) {
          // Only restore contact info for guests
          if (parsed.guestEmail) setGuestEmail(parsed.guestEmail);
          if (parsed.guestPhone) setGuestPhone(parsed.guestPhone);
        }
        if (parsed.shippingAddress && (!shippingAddress.street || !shippingAddress.zip))
          setShippingAddress(parsed.shippingAddress);
        if (parsed.billingAddress && !useSameAddress) setBillingAddress(parsed.billingAddress);
        if (typeof parsed.useSameAddress === 'boolean') setUseSameAddress(parsed.useSameAddress);
        if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
        if (parsed.selectedTime) setSelectedTime(parsed.selectedTime);
        if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
      } catch (e) {
        console.error('Failed to restore checkout state', e);
      }
    }

    const verifyAsync = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('order_id');

      if (orderId && !orderConfirmation && !isSubmitting) {
        setIsSubmitting(true);
        addToast('Verifying payment...', 'info');
        try {
          const isSuccess = await paymentService.verifyPayment(orderId);
          if (isSuccess) {
            // Need to ensure state is ready before processing
            // Use savedState if available to ensure we satisfy requirements

            // We need to re-construct orderData. Ideally processOrder shouldn't depend on closure state if called here?
            // Actually processOrder uses current state. If we just restored it, we should be fine?
            // React state updates are async. We might need to wait or pass data directly.
            // For safety, let's call processOrder with specific override or just hope state settled.
            // Better: call a modified processOrder that accepts data, or rely on restored state being fast enough (it runs on mount).

            // Important: Clear query param to avoid re-verification on reload
            window.history.replaceState({}, '', window.location.pathname);

            // Wait a tick for state to settle?
            setTimeout(() => {
              // We can assume state is restored by now since we did it synchronously above (except setStates are async)
              // But we can trigger it.

              // Re-running validation might flag empty fields if restore failed.
              // Let's rely on the user having filled it before redirect.

              // Call create directly to avoid validation check fail if partial?
              // processOrder does logic.

              // Let's try calling it.
              // But processOrder uses 'cartItems'.

              const processOrderAfterVerify = async () => {
                try {
                  const saved = savedState ? JSON.parse(savedState) : {};
                  const finalOrderData = {
                    items: mapToOrderItems(cartItems), // cartItems comes from useCart which is persistent
                    total: total,
                    shippingAddress: {
                      ...shippingAddress,
                      ...saved.shippingAddress,
                      id: '',
                      type: 'Shipping' as const,
                    },
                    billingAddress:
                      (saved.useSameAddress ?? useSameAddress)
                        ? {
                            ...shippingAddress,
                            ...saved.shippingAddress,
                            id: '',
                            type: 'Billing' as const,
                          }
                        : {
                            ...billingAddress,
                            ...saved.billingAddress,
                            id: '',
                            type: 'Billing' as const,
                          },
                    deliveryMethod: 'Standard' as const,
                    paymentMethod: saved.paymentMethod || paymentMethod || 'Online Payment',
                    shippingCost: shippingCost, // shippingCost is calculated from cart items
                    discount,
                    deliverySlot: {
                      date: new Date(saved.selectedDate || selectedDate).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      ),
                      time: saved.selectedTime || selectedTime,
                    },
                    guestEmail: !user ? saved.guestEmail || guestEmail : undefined,
                    guestPhone: !user ? saved.guestPhone || guestPhone : undefined,
                    paymentId: orderId,
                    userId: user?.id.toString(),
                  };

                  const confirmedOrder = await orderAPI.create(finalOrderData);
                  setOrderConfirmation(confirmedOrder.data);
                  onPlaceOrder(confirmedOrder.data);
                  addToast('Payment verified & Order placed!', 'success');
                  localStorage.removeItem('checkout_state');
                } catch (err) {
                  console.error(err);
                  setSubmitError(
                    'Failed to create order after payment: ' +
                      (err instanceof Error ? err.message : 'Unknown error')
                  );
                } finally {
                  setIsSubmitting(false);
                }
              };
              processOrderAfterVerify();
            }, 500);
          } else {
            setSubmitError('Payment verification failed.');
            setIsSubmitting(false);
          }
        } catch {
          setSubmitError('Error verifying payment.');
          setIsSubmitting(false);
        }
      }
    };

    verifyAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Run on mount (and user load)

  if (orderConfirmation) {
    return <OrderConfirmation order={orderConfirmation} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CheckoutStepper currentStep={paymentMethod ? 'payment' : 'shipping'} />

      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-12 mt-8">
        Checkout
      </h2>

      {submitError && (
        <div className="mb-6 max-w-4xl mx-auto">
          <APIErrorDisplay
            error={{ message: submitError }}
            onRetry={() => setSubmitError(null)}
            onDismiss={() => setSubmitError(null)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Guest Checkout Contact Info */}
          {!user && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="guestEmail"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="mt-1 input-field"
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="guestPhone"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="mt-1 input-field"
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>
          )}

          <AddressForm
            address={shippingAddress}
            onChange={handleInputChange(setShippingAddress)}
            onBlur={handleBlur}
            errors={errors}
            title="Shipping Address"
            userName={user?.name}
          />

          <div className="flex items-center">
            <input
              id="same-address"
              name="same-address"
              type="checkbox"
              checked={useSameAddress}
              onChange={() => setUseSameAddress(!useSameAddress)}
              className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
            />
            <label htmlFor="same-address" className="ml-2 block text-sm text-gray-900">
              Billing address is the same as my shipping address
            </label>
          </div>

          {!useSameAddress && (
            <AddressForm
              address={billingAddress}
              onChange={handleInputChange(setBillingAddress)}
              onBlur={handleBlur}
              errors={errors}
              title="Billing Address"
              userName={user?.name}
            />
          )}

          <DeliverySlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            onSelectTime={setSelectedTime}
          />

          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['UPI', 'Credit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-3 font-bold rounded-lg transition-all duration-300 border-2 text-center ${paymentMethod === method ? 'bg-brand-primary text-brand-dark border-brand-primary shadow-lg' : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'}`}
                >
                  {method}
                </button>
              ))}
            </div>
            {paymentMethod === 'UPI' && (
              <div className="mt-4 animate-fade-in">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                  UPI ID / VPA
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1 input-field"
                  placeholder="username@upi"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your UPI ID (e.g., mobile@upi, name@bank)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right/Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="bg-brand-accent/50 p-6 rounded-lg sticky top-28">
            <h3 className="text-xl font-serif font-bold mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <OptimizedImage
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    type="thumbnail"
                    priority="high"
                    width={64}
                    height={64}
                    onError={imageErrorHandlers.thumb}
                  />
                  <div className="flex-grow">
                    <p className="font-bold text-sm leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.weight} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({promoCode})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-bold' : ''}>
                  {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-brand-dark mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4">
              {promoCode ? (
                <div className="flex justify-between items-center bg-green-100 text-green-800 text-sm p-2 rounded-md">
                  <span>Code &quot;{promoCode}&quot; applied!</span>
                  <button
                    type="button"
                    onClick={onRemovePromoCode}
                    className="p-1 rounded-full hover:bg-green-200"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={localPromoCode}
                    onChange={(e) => setLocalPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => onApplyPromoCode(localPromoCode)}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-green-50 p-2 rounded-md">
                <ShieldCheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="font-bold">Secure SSL Checkout</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50 p-2 rounded-md">
                <span className="h-5 w-5 flex items-center justify-center text-blue-600 font-bold">
                  ↺
                </span>
                <span className="font-bold">30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 bg-yellow-50 p-2 rounded-md">
                <span className="h-5 w-5 flex items-center justify-center text-yellow-600 font-bold">
                  🚚
                </span>
                <span className="font-bold">Fast & Free Shipping over ₹250</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || !paymentMethod || isSubmitting}
                className="w-full bg-brand-dark text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <style>{`
          .input-field {
            display: block;
            width: 100%;
            padding: 0.75rem;
            font-size: 16px; /* Prevent iOS zoom */
            border: 1px solid #D1D5DB;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          .input-field:focus {
            outline: none;
            --tw-ring-color: #FFB7C1;
            box-shadow: 0 0 0 2px var(--tw-ring-color);
            border-color: #FFB7C1;
          }
        `}</style>
    </div>
  );
};

export default CheckoutPage;
