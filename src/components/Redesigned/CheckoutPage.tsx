import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentService } from '../../../utils/paymentService';
import { CartItem } from '../../../types';
import { useCart } from '../../../hooks/useCart';
import {
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Smartphone,
  Mail,
  User,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const {
    cartItems: items,
    subtotal: totalPrice,
    cartItemCount: totalItems,
    clearCart,
  } = useCart();
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=confirm
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payMethod, setPayMethod] = useState('upi');

  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const shipping = totalPrice >= 1000 ? 0 : 70;
  const grandTotal = totalPrice + shipping;

  useEffect(() => {
    if (orderId && step !== 3) {
      setIsProcessing(true);
      paymentService.verifyPayment(orderId).then((success) => {
        setIsProcessing(false);
        if (success) {
          setStep(3);
        } else {
          alert('Payment verification failed. Please try again or contact support.');
        }
      }).catch((err) => {
        setIsProcessing(false);
        console.error(err);
        alert('Payment verification encountered an error.');
      });
    }
  }, [orderId, step]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter valid 10-digit mobile';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter valid email';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter 6-digit PIN';
    if (!form.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep(2);
  };

  const handleField = (f: string, v: string) => {
    setForm((prev) => ({ ...prev, [f]: v }));
    if (errors[f])
      setErrors((prev) => {
        const { [f]: _, ...rest } = prev;
        return rest;
      });
  };

  if (step === 3)
    return (
      <div className="min-h-screen bg-[#FAF6F2] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#42210B] mb-6">
            Order Confirmed!
          </h1>
          <p className="text-stone-500 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Thank you, <span className="text-[#42210B] font-bold">{form.name}</span>. Your spices
            are being packed at our facility in Sangaria and will ship within 24 hours.
          </p>

          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 md:p-12 text-left mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B38B59]/5 rounded-full blur-2xl -mr-16 -mt-16" />

            <h2 className="text-xs font-black text-stone-300 uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-[#B38B59] rounded-full" />
              Order Details
            </h2>

            <div className="space-y-4 mb-10">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-stone-600 font-medium">
                    {item.name}{' '}
                    <span className="text-stone-300 ml-1">
                      ({item.weight} × {item.quantity})
                    </span>
                  </span>
                  <span className="font-bold text-[#42210B]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-dashed border-stone-200 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">
                  Total Paid
                </div>
                <div className="text-3xl font-bold text-[#42210B]">₹{grandTotal}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">
                  Status
                </div>
                <div className="text-sm font-bold text-green-600 uppercase tracking-widest">
                  Processing
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/shop"
            onClick={clearCart}
            className="inline-flex items-center gap-3 bg-[#42210B] hover:bg-[#5D3D28] text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            CONTINUE SHOPPING
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );

  return (
    <div className="bg-[#FAF6F2] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Progress Tracker */}
        <div className="flex justify-between items-center max-w-3xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
          {[
            { id: 1, label: 'Delivery Details', icon: <MapPin size={16} /> },
            { id: 2, label: 'Secure Payment', icon: <CreditCard size={16} /> },
            { id: 3, label: 'Order Summary', icon: <CheckCircle2 size={16} /> },
          ].map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  step >= s.id
                    ? 'bg-[#42210B] text-white border-[#42210B] shadow-lg shadow-[#42210B]/20'
                    : 'bg-white text-stone-300 border-stone-100'
                }`}
              >
                {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  step >= s.id ? 'text-[#42210B]' : 'text-stone-300'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#B38B59]/5 rounded-full blur-3xl -mr-24 -mt-24" />

              {step === 1 && (
                <div className="space-y-10 relative z-10">
                  <h2 className="font-display text-3xl font-bold text-[#42210B]">
                    Delivery Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={12} className="text-[#B38B59]" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleField('name', e.target.value)}
                        className={`w-full bg-[#FAF6F2] border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#B38B59] transition-all ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="e.g. Rahul Sharma"
                      />
                      {errors.name && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 ml-2">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={12} className="text-[#B38B59]" /> Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleField('phone', e.target.value)}
                        className={`w-full bg-[#FAF6F2] border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#B38B59] transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="10-digit mobile"
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 ml-2">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={12} className="text-[#B38B59]" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleField('email', e.target.value)}
                        className={`w-full bg-[#FAF6F2] border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#B38B59] transition-all ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="rahul@example.com"
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 ml-2">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} className="text-[#B38B59]" /> Full Address
                      </label>
                      <textarea
                        rows={3}
                        value={form.address}
                        onChange={(e) => handleField('address', e.target.value)}
                        className={`w-full bg-[#FAF6F2] border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#B38B59] transition-all resize-none ${errors.address ? 'ring-2 ring-red-500' : ''}`}
                        placeholder="House no, Building, Street, Area"
                      />
                      {errors.address && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 ml-2">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        Pin Code
                      </label>
                      <input
                        type="text"
                        value={form.pincode}
                        onChange={(e) => handleField('pincode', e.target.value)}
                        className={`w-full bg-[#FAF6F2] border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#B38B59] ${errors.pincode ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {errors.pincode && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 ml-2">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        City
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => handleField('city', e.target.value)}
                        className={`w-full bg-[#FAF6F2] border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#B38B59] ${errors.city ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {errors.city && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 ml-2">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full bg-[#B38B59] hover:bg-[#8C6D45] text-white py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    CONTINUE TO PAYMENT
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 relative z-10">
                  <div className="flex items-center gap-4 mb-2">
                    <button
                      onClick={() => setStep(1)}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-400"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h2 className="font-display text-3xl font-bold text-[#42210B]">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        id: 'upi',
                        label: 'UPI (GPay, PhonePe, Paytm)',
                        desc: 'Pay instantly with any UPI app',
                        icon: <Smartphone className="text-[#B38B59]" size={20} />,
                        trust: 'Zero Transaction Fee',
                      },
                      {
                        id: 'card',
                        label: 'Credit / Debit Card',
                        desc: 'Visa, Mastercard, RuPay & more',
                        icon: <CreditCard className="text-[#B38B59]" size={20} />,
                        trust: '100% Secure via Razorpay',
                      },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayMethod(m.id)}
                        className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden flex flex-col gap-4 ${
                          payMethod === m.id
                            ? 'border-[#B38B59] bg-[#B38B59]/5 shadow-inner'
                            : 'border-stone-100 bg-[#FAF6F2] hover:border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${payMethod === m.id ? 'bg-[#B38B59] text-white' : 'bg-white text-stone-300 shadow-sm'}`}
                            >
                              {m.icon}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#42210B]">{m.label}</div>
                              <div className="text-xs text-stone-400 font-medium">
                                {m.desc.replace('grandTotal', grandTotal.toString())}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payMethod === m.id ? 'border-[#B38B59] bg-[#B38B59]' : 'border-stone-200'}`}
                          >
                            {payMethod === m.id && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-dashed border-stone-200">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-[#B38B59] uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            {m.trust}
                          </div>
                          {m.id === 'upi' && (
                            <div className="flex gap-2 opacity-30 grayscale saturate-0 contrast-150">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
                                alt="UPI"
                                className="h-3"
                              />
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                                alt="GPay"
                                className="h-3"
                              />
                            </div>
                          )}
                          {m.id === 'card' && (
                            <div className="flex gap-2 opacity-30 grayscale saturate-0 contrast-150">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                alt="Visa"
                                className="h-3"
                              />
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                                alt="MC"
                                className="h-3"
                              />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-8 space-y-4">
                    <button
                      disabled={isProcessing}
                      onClick={async () => {
                        setIsProcessing(true);
                        try {
                          await paymentService.initializePayment(
                            grandTotal,
                            { 
                              id: (form.email || `guest_${Date.now()}`).replace(/[@.]/g, '_'), 
                              name: form.name, 
                              email: form.email, 
                              phone: form.phone 
                            },
                            () => { /* handled by redirect */ },
                            (err) => {
                              setIsProcessing(false);
                              alert(err);
                            }
                          );
                        } catch (err) {
                          console.error(err);
                          setIsProcessing(false);
                        }
                      }}
                      className="w-full bg-[#42210B] hover:bg-[#5D3D28] text-white py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing ? 'PROCESSING...' : `PLACE ORDER · ₹${grandTotal}`}
                    </button>
                    <p className="text-center text-[10px] font-black text-stone-300 uppercase tracking-widest flex items-center justify-center gap-4">
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={12} /> 256-bit SSL
                      </span>
                      <span className="flex items-center gap-1 font-bold text-green-600">
                        <CheckCircle2 size={12} /> ISO Certified
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-8">
                Items in Cart ({totalItems})
              </h3>

              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 no-scrollbar">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#FAF6F2] rounded-xl flex items-center justify-center shrink-0 border border-stone-50 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#42210B] truncate mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                        {item.weight} × {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#42210B]">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-dashed border-stone-100">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-stone-600'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-[#B38B59]">
                    Grand Total
                  </span>
                  <span className="text-3xl font-bold text-[#42210B]">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#B38B59]/5 border border-[#B38B59]/10 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <Truck className="text-[#B38B59]" size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black text-[#B38B59] uppercase tracking-widest mb-1">
                  Estimated Delivery
                </div>
                <div className="text-xs font-bold text-[#42210B]">
                  Expected within 3-5 business days
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
