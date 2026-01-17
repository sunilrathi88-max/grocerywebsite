import React, { useState, useMemo } from 'react';
import { TrustBadges } from './TrustBadges';
import { User, Address, Order, ToastMessage, Product, CartItem, Variant } from '../types';
import { CartItem as StoreCartItem } from '../store/cartStore';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CalendarIcon } from './icons/CalendarIcon';
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
      } as unknown as Variant, // Variant also has required props
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

      {/* Estimated Delivery Confirmation */}
      {selectedDate && selectedTime && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
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
          </div>
          <div>
            <p className="font-bold text-green-800">Estimated Delivery</p>
            <p className="text-sm text-green-700">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}{' '}
              between <span className="font-bold">{selectedTime}</span>
            </p>
            <p className="text-xs text-green-600 mt-1">🚚 Free delivery on orders above ₹1000</p>
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
          id="name"
          autoComplete="name"
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
          id="street"
          autoComplete="street-address"
          value={address.street}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="123 Main Street, Apt 4B"
          className={`mt-1 input-field transition-all ${errors.street ? 'border-red-500 ring-2 ring-red-200' : ''}`}
          required
        />
        {errors.street && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>⚠</span> {errors.street}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          name="city"
          id="city"
          autoComplete="address-level2"
          value={address.city}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Mumbai"
          className={`mt-1 input-field transition-all ${errors.city ? 'border-red-500 ring-2 ring-red-200' : ''}`}
          required
        />
        {errors.city && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>⚠</span> {errors.city}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State / Province
        </label>
        <input
          type="text"
          name="state"
          id="state"
          autoComplete="address-level1"
          value={address.state}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Maharashtra"
          className={`mt-1 input-field transition-all ${errors.state ? 'border-red-500 ring-2 ring-red-200' : ''}`}
          required
        />
        {errors.state && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>⚠</span> {errors.state}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
          PIN Code
        </label>
        <input
          type="text"
          name="zip"
          id="zip"
          autoComplete="postal-code"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={address.zip}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="400001"
          className={`mt-1 input-field transition-all ${errors.zip ? 'border-red-500 ring-2 ring-red-200' : ''}`}
          required
        />
        {errors.zip && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>⚠</span> {errors.zip}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          name="country"
          id="country"
          autoComplete="country-name"
          value={address.country}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="India"
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
  const FREE_SHIPPING_THRESHOLD = 1000;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

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
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Enhanced Checkout Features
  const [orderNotes, setOrderNotes] = useState('');
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [wantGiftWrap, setWantGiftWrap] = useState(false);
  const [wantSmsUpdates, setWantSmsUpdates] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');

  const GIFT_WRAP_FEE = 49;

  // Checkout Flow State
  const [currentStep, setCurrentStep] = useState<'auth' | 'shipping' | 'payment'>(
    user ? 'shipping' : 'auth'
  );

  // Update step if user logs in mid-session
  React.useEffect(() => {
    if (user && currentStep === 'auth') {
      setCurrentStep('shipping');
    }
  }, [user, currentStep]);

  const handleGuestContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail || !/\S+@\S+\.\S+/.test(guestEmail)) {
      setErrors({ ...errors, guestEmail: 'Valid email is required' });
      return;
    }
    // Optional: Validate phone if needed
    setCurrentStep('shipping');
  };

  const tax = useMemo(() => (subtotal - discount) * 0.05, [subtotal, discount]);
  const giftWrapCost = wantGiftWrap ? GIFT_WRAP_FEE : 0;
  const total = useMemo(
    () => subtotal + shippingCost + tax - discount + giftWrapCost,
    [subtotal, shippingCost, tax, discount, giftWrapCost]
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
    if (paymentMethod === 'UPI') {
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiId) {
        addToast('Please enter your UPI ID.', 'error');
        return;
      }
      if (!upiRegex.test(upiId)) {
        addToast('Please enter a valid UPI ID (e.g., name@bank).', 'error');
        return;
      }
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
      sessionStorage.setItem(
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
    const savedState = sessionStorage.getItem('checkout_state');
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
                  sessionStorage.removeItem('checkout_state');
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
      <CheckoutStepper currentStep={currentStep === 'auth' ? 'auth' : 'shipping'} />

      {currentStep === 'auth' ? (
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Login Column */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold mb-6 text-brand-dark">
              Returning Customer?
            </h3>
            <p className="text-gray-600 mb-8">
              Login to access your saved addresses and loyalty points.
            </p>
            <button
              onClick={() => document.getElementById('login-btn')?.click()} // Hacky but works if Header has login
              className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Login to Account
            </button>
          </div>

          {/* Guest Column */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold mb-6 text-brand-dark">Guest Checkout</h3>
            <p className="text-gray-600 mb-6">No account? No problem. Proceed with your email.</p>
            <form onSubmit={handleGuestContinue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full input-field"
                  placeholder="john@example.com"
                  required
                />
                {errors.guestEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.guestEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full input-field"
                  placeholder="+91..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-lg hover:bg-brand-secondary/20 border border-brand-primary transition-all"
              >
                Continue as Guest
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
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
              {/* Guest Contact Info (Read Only or Hidden in Shipping Step) */}
              {!user && (
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-gray-700">Contact:</span>{' '}
                    <span className="text-gray-600">{guestEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('auth')}
                    className="text-brand-primary hover:underline text-xs"
                  >
                    Change
                  </button>
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

              {/* Order Notes */}
              <div className="space-y-3">
                <h3 className="text-lg font-serif font-bold flex items-center gap-2">
                  📝 Order Notes
                  <span className="text-xs font-normal text-gray-500">(Optional)</span>
                </h3>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions? (e.g., Leave at door, Call before delivery)"
                  className="w-full input-field min-h-[80px] resize-none"
                  maxLength={200}
                />
                <p className="text-xs text-gray-400 text-right">{orderNotes.length}/200</p>
              </div>

              {/* Gift Options */}
              <div className="space-y-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎁</span>
                    <span className="font-bold text-gray-800">This is a gift order</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGiftOrder(!isGiftOrder)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isGiftOrder ? 'bg-brand-primary' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isGiftOrder ? 'translate-x-6' : ''}`}
                    />
                  </button>
                </div>

                {isGiftOrder && (
                  <div className="space-y-3 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gift Message
                      </label>
                      <textarea
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Write a heartfelt message for your recipient..."
                        className="w-full input-field min-h-[60px] resize-none"
                        maxLength={150}
                      />
                      <p className="text-xs text-gray-400 text-right">{giftMessage.length}/150</p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-pink-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="giftWrap"
                          checked={wantGiftWrap}
                          onChange={(e) => setWantGiftWrap(e.target.checked)}
                          className="h-4 w-4 text-brand-primary rounded focus:ring-brand-primary"
                        />
                        <label htmlFor="giftWrap" className="text-sm font-medium text-gray-700">
                          Add premium gift wrapping
                        </label>
                      </div>
                      <span className="text-sm font-bold text-brand-primary">
                        +₹{GIFT_WRAP_FEE}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* SMS/WhatsApp Updates */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="smsUpdates"
                    checked={wantSmsUpdates}
                    onChange={(e) => setWantSmsUpdates(e.target.checked)}
                    className="h-4 w-4 mt-1 text-brand-primary rounded focus:ring-brand-primary"
                  />
                  <div className="flex-1">
                    <label htmlFor="smsUpdates" className="font-bold text-gray-800 block">
                      📲 Get order updates via SMS/WhatsApp
                    </label>
                    <p className="text-xs text-gray-500">
                      Receive real-time tracking and delivery notifications
                    </p>

                    {wantSmsUpdates && (
                      <input
                        type="tel"
                        value={smsPhone}
                        onChange={(e) => setSmsPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="mt-2 input-field text-sm"
                        pattern="[0-9]{10}"
                        maxLength={10}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Trust & Security Signals */}
              <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-t border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-600">🔒</span>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-600">✓</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-amber-600">★</span>
                  <span>Money Back Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right/Sidebar Column */}
            <div className="lg:col-span-1">
              {/* Collapsible Mobile Summary Header */}
              <button
                type="button"
                onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                className="lg:hidden w-full flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-200 shadow-sm mb-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-neutral-900">Order Summary</span>
                  <span className="bg-brand-primary text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItems.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-neutral-900">₹{total.toFixed(2)}</span>
                  <svg
                    className={`w-5 h-5 text-neutral-500 transition-transform ${isMobileSummaryOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-sm sticky top-24 ${isMobileSummaryOpen ? 'block' : 'hidden lg:block'}`}
              >
                <h3 className="text-xl font-serif font-bold text-neutral-900 mb-6 hidden lg:block">
                  Order Summary
                </h3>

                {/* Free Shipping Progress */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-neutral-100 shadow-sm">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-600">
                      {remainingForFreeShipping > 0
                        ? `Add ₹${remainingForFreeShipping.toFixed(0)} for Free Shipping`
                        : '🎉 Free Shipping Unlocked!'}
                    </span>
                    <span
                      className={
                        remainingForFreeShipping > 0 ? 'text-brand-primary' : 'text-green-600'
                      }
                    >
                      {Math.round(shippingProgress)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-out ${
                        remainingForFreeShipping > 0 ? 'bg-brand-primary' : 'bg-green-500'
                      }`}
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <OptimizedImage
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded bg-white"
                        type="thumbnail"
                        width={64}
                        height={64}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-neutral-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {item.weight} x {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-neutral-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-2 text-neutral-600 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-success font-bold">Free</span>
                      ) : (
                        `₹${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success font-medium">
                      <span>Discount ({promoCode})</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Taxes (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {giftWrapCost > 0 && (
                    <div className="flex justify-between text-sm text-neutral-600">
                      <span className="flex items-center gap-1">🎁 Gift Wrap</span>
                      <span>₹{giftWrapCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl text-neutral-900 pt-3 border-t border-neutral-200 mt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mt-6">
                  {promoCode ? (
                    <div className="flex items-center justify-between text-brand-dark bg-brand-primary/10 px-3 py-2 rounded-lg border border-brand-primary/20">
                      <span className="font-bold text-sm">Used: {promoCode}</span>
                      <button
                        type="button"
                        onClick={onRemovePromoCode}
                        className="text-xs text-red-600 hover:text-red-800 font-bold"
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code"
                        value={localPromoCode}
                        onChange={(e) => setLocalPromoCode(e.target.value)}
                        className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2 border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!localPromoCode) {
                            addToast('Please enter a promo code.', 'error');
                            return;
                          }
                          if (
                            ['TATTVA10', 'WELCOME15', 'QUIZMASTER15'].includes(
                              localPromoCode.toUpperCase()
                            )
                          ) {
                            onApplyPromoCode(localPromoCode);
                            addToast(
                              `Promo code ${localPromoCode} applied successfully!`,
                              'success'
                            );
                            setLocalPromoCode('');
                          } else {
                            addToast('Invalid promo code.', 'error');
                          }
                        }}
                        className="bg-brand-dark text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl shadow-button hover:shadow-button-hover transform hover:-translate-y-0.5 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay ₹{total.toFixed(2)}</span>
                  )}
                </button>

                <div className="mt-6">
                  <TrustBadges
                    variant="vertical"
                    size="sm"
                    badges={[
                      { icon: '🔒', text: 'Secure SSL Checkout' },
                      { icon: '✅', text: 'Satisfaction Guaranteed' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </form>
        </>
      )}
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
