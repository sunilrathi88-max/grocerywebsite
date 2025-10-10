
import React, { useState, useMemo } from 'react';
import { CartItem, User, Address, Order, ToastMessage } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { XIcon } from './icons/XIcon';

interface CheckoutPageProps {
  cartItems: CartItem[];
  user: User;
  onPlaceOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  addToast: (message: string, type: ToastMessage['type']) => void;
  discount: number;
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
  onRemovePromoCode: () => void;
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
        <p className="mt-2 text-gray-600">Your order has been placed successfully. A confirmation email has been sent.</p>
        
        <div className="mt-6 text-left bg-brand-accent/50 p-4 rounded-lg">
          <p><strong>Order ID:</strong> <span className="font-mono">{order.id}</span></p>
          <p><strong>Estimated Delivery:</strong> {estimatedDeliveryDate}</p>
        </div>

        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-serif font-bold text-left mb-4">Order Summary</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto text-left pr-2">
            {order.items.map(item => (
              <div key={`${item.product.id}-${item.selectedVariant.id}`} className="flex justify-between items-start gap-4">
                <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-bold text-sm leading-tight">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.selectedVariant.name} x {item.quantity}</p>
                </div>
                <p className="text-sm font-bold flex-shrink-0">${((item.selectedVariant.salePrice ?? item.selectedVariant.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
           <div className="flex justify-between font-bold text-lg text-brand-dark mt-4 pt-4 border-t">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a href="#/" className="bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
            Continue Shopping
          </a>
          <a href="#/profile" className="bg-brand-dark text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
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
            label: date.toLocaleDateString('en-US', { weekday: 'short'}),
            day: date.getDate()
        });
    }
    return dates;
  }, []);

  const timeSlots = useMemo(() => {
      if (!selectedDate) return [];
      // Mock different slots for different days
      const day = new Date(selectedDate).getDay();
      if (day % 2 === 0) { // Even days
          return [
              { time: '09:00 AM - 11:00 AM', available: true },
              { time: '11:00 AM - 01:00 PM', available: true },
              { time: '01:00 PM - 03:00 PM', available: false },
              { time: '03:00 PM - 05:00 PM', available: true },
          ];
      }
      return [ // Odd days
          { time: '10:00 AM - 12:00 PM', available: true },
          { time: '12:00 PM - 02:00 PM', available: false },
          { time: '02:00 PM - 04:00 PM', available: true },
          { time: '04:00 PM - 06:00 PM', available: true },
      ];
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-bold flex items-center gap-2"><CalendarIcon /> Delivery Slot</h3>
      <div>
        <h4 className="font-bold text-sm text-gray-600 mb-2">Select a Date:</h4>
        <div className="flex flex-wrap gap-2">
          {deliveryDates.map(date => (
            <button
              key={date.value}
              type="button"
              onClick={() => onSelectDate(date.value)}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 border text-center ${selectedDate === date.value ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'}`}
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
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map(slot => (
              <button
                key={slot.time}
                type="button"
                onClick={() => onSelectTime(slot.time)}
                disabled={!slot.available}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 border text-center ${selectedTime === slot.time ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'} ${!slot.available ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : ''}`}
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


const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, user, onPlaceOrder, addToast, discount, promoCode, onApplyPromoCode, onRemovePromoCode }) => {
  const defaultShipping = user.addresses.find(a => a.isDefault && a.type === 'Shipping') || user.addresses[0];

  const [shippingAddress, setShippingAddress] = useState<Omit<Address, 'id' | 'type'>>(defaultShipping);
  const [billingAddress, setBillingAddress] = useState<Omit<Address, 'id' | 'type'>>(defaultShipping);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);
  const [localPromoCode, setLocalPromoCode] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => {
    const price = item.selectedVariant.salePrice ?? item.selectedVariant.price;
    return sum + price * item.quantity;
  }, 0), [cartItems]);

  const deliveryCost = useMemo(() => {
    if (subtotal > 50) return 0;
    return deliveryMethod === 'express' ? 14.99 : 4.99;
  }, [subtotal, deliveryMethod]);
  
  const tax = useMemo(() => (subtotal - discount) * 0.08, [subtotal, discount]);
  const total = useMemo(() => subtotal + deliveryCost + tax - discount, [subtotal, deliveryCost, tax, discount]);
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast('Your cart is empty.', 'error');
      return;
    }
    if (!selectedDate || !selectedTime) {
      addToast('Please select a delivery slot.', 'error');
      return;
    }
    
    const confirmedOrder = onPlaceOrder({
      items: cartItems,
      total: total,
      shippingAddress: { ...shippingAddress, id: 0, type: 'Shipping'},
      billingAddress: useSameAddress ? { ...shippingAddress, id: 0, type: 'Billing' } : { ...billingAddress, id: 0, type: 'Billing'},
      deliveryMethod,
      discount,
      deliverySlot: { date: new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), time: selectedTime },
    });
    setOrderConfirmation(confirmedOrder);
  };

  const AddressForm: React.FC<{ address: Omit<Address, 'id' | 'type'>, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, title: string }> = ({ address, onChange, title }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-serif font-bold">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" defaultValue={user.name} className="mt-1 input-field" required />
        </div>
        <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
            <input type="text" name="street" value={address.street} onChange={onChange} className="mt-1 input-field" required />
        </div>
        <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" name="city" value={address.city} onChange={onChange} className="mt-1 input-field" required />
        </div>
        <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
            <input type="text" name="state" value={address.state} onChange={onChange} className="mt-1 input-field" required />
        </div>
        <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <input type="text" name="zip" value={address.zip} onChange={onChange} className="mt-1 input-field" required />
        </div>
        <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input type="text" name="country" value={address.country} onChange={onChange} className="mt-1 input-field" required />
        </div>
      </div>
    </div>
  );

  if (orderConfirmation) {
    return <OrderConfirmation order={orderConfirmation} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-12">Checkout</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <AddressForm address={shippingAddress} onChange={handleInputChange(setShippingAddress)} title="Shipping Address" />
            
            <div className="flex items-center">
              <input id="same-address" name="same-address" type="checkbox" checked={useSameAddress} onChange={() => setUseSameAddress(!useSameAddress)} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
              <label htmlFor="same-address" className="ml-2 block text-sm text-gray-900">Billing address is the same as my shipping address</label>
            </div>
            
            {!useSameAddress && <AddressForm address={billingAddress} onChange={handleInputChange(setBillingAddress)} title="Billing Address" />}

            <DeliverySlotPicker 
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectDate={(date) => { setSelectedDate(date); setSelectedTime(null); }}
              onSelectTime={setSelectedTime}
            />
          </div>
          
          {/* Right/Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="bg-brand-accent/50 p-6 rounded-lg sticky top-28">
              <h3 className="text-xl font-serif font-bold mb-4">Order Summary</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={`${item.product.id}-${item.selectedVariant.id}`} className="flex justify-between items-start gap-4">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-bold text-sm leading-tight">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.selectedVariant.name} x {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold flex-shrink-0">${((item.selectedVariant.salePrice ?? item.selectedVariant.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({promoCode})</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>${deliveryCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Taxes (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg text-brand-dark mt-2 pt-2 border-t"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>

              <div className="mt-4">
                {promoCode ? (
                    <div className="flex justify-between items-center bg-green-100 text-green-800 text-sm p-2 rounded-md">
                        <span>Code "{promoCode}" applied!</span>
                        <button type="button" onClick={onRemovePromoCode} className="p-1 rounded-full hover:bg-green-200"><XIcon className="h-4 w-4"/></button>
                    </div>
                ) : (
                    <div className="flex rounded-md shadow-sm">
                        <input type="text" value={localPromoCode} onChange={(e) => setLocalPromoCode(e.target.value)} placeholder="Promo code" className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                        <button type="button" onClick={() => onApplyPromoCode(localPromoCode)} className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100">Apply</button>
                    </div>
                )}
              </div>
              
              <div className="mt-6">
                <button 
                  type="submit" 
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-brand-dark text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
         <style>{`
          .input-field {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
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