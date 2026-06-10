import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentService } from '../../../utils/paymentService';
import { CartItem } from '../../../types';
import { useCart } from '../../../hooks/useCart';
import {
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Zap,
  Lock,
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { cartItems: items, subtotal: totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1=contact, 2=address, 3=payment
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  const shipping = totalPrice >= 1000 ? 0 : 70;
  const grandTotal = totalPrice + shipping;

  useEffect(() => {
    if (orderId && step !== 5) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsProcessing(true);
      paymentService
        .verifyPayment(orderId)
        .then((success) => {
          setIsProcessing(false);
          if (success) {
            setStep(5);
          } else {
            alert('Payment verification failed. Please try again or contact support.');
          }
        })
        .catch((err) => {
          setIsProcessing(false);
          console.error(err);
          alert('Payment verification encountered an error.');
        });
    }
  }, [orderId, step]);

  useEffect(() => {
    const fetchPincodeData = async () => {
      if (form.pincode.length === 6 && /^\d+$/.test(form.pincode)) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setForm((prev) => ({
              ...prev,
              city: postOffice.District || postOffice.Block || postOffice.Region || prev.city,
              state: postOffice.State || prev.state,
            }));
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.city;
              return newErrors;
            });
          }
        } catch (error) {
          console.error('Failed to fetch pincode data', error);
        }
      }
    };
    const timeout = setTimeout(fetchPincodeData, 500);
    return () => clearTimeout(timeout);
  }, [form.pincode]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'name' && !value.trim()) error = 'Name is required';
    if (name === 'phone' && !/^\d{10}$/.test(value)) error = 'Enter valid 10-digit mobile';
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) error = 'Enter valid email';
    if (name === 'address' && !value.trim()) error = 'Address is required';
    if (name === 'pincode' && !/^\d{6}$/.test(value)) error = 'Enter 6-digit PIN';
    if (name === 'city' && !value.trim()) error = 'City is required';
    return error;
  };

  const handleBlur = (f: string) => {
    setTouched((prev) => ({ ...prev, [f]: true }));
    const err = validateField(f, (form as any)[f]);
    setErrors((prev) => ({ ...prev, [f]: err }));
  };

  const handleField = (f: string, v: string) => {
    setForm((prev) => ({ ...prev, [f]: v }));
    if (touched[f]) {
      const err = validateField(f, v);
      setErrors((prev) => ({ ...prev, [f]: err }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
    };
    const cleanErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v !== ''));
    setErrors(cleanErrors as Record<string, string>);
    setTouched({ name: true, email: true, phone: true });
    return Object.keys(cleanErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {
      address: validateField('address', form.address),
      pincode: validateField('pincode', form.pincode),
      city: validateField('city', form.city),
    };
    const cleanErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v !== ''));
    setErrors(cleanErrors as Record<string, string>);
    setTouched((prev) => ({ ...prev, address: true, pincode: true, city: true }));
    return Object.keys(cleanErrors).length === 0;
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-cream py-20 px-4 font-body">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 size={48} className="text-green-700" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-bark mb-6">
            Order Confirmed!
          </h1>
          <p className="text-sage text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            Thank you, <span className="text-bark font-bold">{form.name}</span>. Your order is being
            packed at our facility in Sangaria and will ship shortly.
          </p>
          <Link
            to="/shop"
            onClick={clearCart}
            className="inline-flex items-center justify-center gap-2 min-h-[56px] px-8 bg-gold hover:bg-[#8B5105] text-white rounded-md font-bold text-base shadow-sm hover:shadow-lg transition-all active:scale-95 tracking-wide uppercase"
          >
            CONTINUE SHOPPING
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-20 font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* Main Checkout Form - Max width optimized */}
          <div className="w-full lg:max-w-xl shrink-0">
            <h1 className="font-display text-4xl font-bold text-bark mb-8">Checkout</h1>

            {/* Express Checkout Button */}
            {step < 4 && (
              <div className="mb-8">
                <button
                  onClick={() => {
                    setForm({
                      name: form.name || 'Guest User',
                      phone: form.phone || '9999999999',
                      email: form.email || 'guest@rathinaturals.com',
                      address: form.address || 'Express Checkout Address',
                      pincode: form.pincode || '110001',
                      city: form.city || 'New Delhi',
                      state: form.state || 'DL',
                    });
                    setStep(3);
                  }}
                  className="w-full bg-forest text-cream py-4 rounded-md font-bold shadow-md hover:bg-forest/90 transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={18} className="text-gold" />
                  Express Checkout (Skip to Payment)
                </button>
              </div>
            )}

            {/* Accordion Steps */}
            <div className="space-y-4">
              {/* STEP 1: CONTACT */}
              <div
                className={`border border-border rounded-xl bg-ivory overflow-hidden transition-all ${step === 1 ? 'shadow-md' : 'opacity-80'}`}
              >
                <div
                  className="p-4 md:p-6 flex items-center gap-4 cursor-pointer"
                  onClick={() => setStep(1)}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > 1 ? 'bg-green-600 text-white' : step === 1 ? 'bg-forest text-white' : 'bg-border text-sage'}`}
                  >
                    {step > 1 ? <CheckCircle2 size={16} /> : '1'}
                  </div>
                  <h2 className="font-semibold text-lg text-bark flex-1">Contact</h2>
                  {step > 1 && (
                    <span className="text-xs font-bold text-sage uppercase tracking-wider">
                      {form.email}
                    </span>
                  )}
                </div>

                {step === 1 && (
                  <div className="px-4 md:px-6 pb-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block font-medium text-sm text-bark mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleField('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        autoComplete="name"
                        className={`w-full min-h-[48px] px-4 border ${errors.name ? 'border-red-500' : 'border-border'} rounded-md bg-white text-base text-bark focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block font-medium text-sm text-bark mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleField('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        autoComplete="email"
                        className={`w-full min-h-[48px] px-4 border ${errors.email ? 'border-red-500' : 'border-border'} rounded-md bg-white text-base text-bark focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block font-medium text-sm text-bark mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleField('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        autoComplete="tel"
                        className={`w-full min-h-[48px] px-4 border ${errors.phone ? 'border-red-500' : 'border-border'} rounded-md bg-white text-base text-bark focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <button
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="w-full min-h-[56px] flex items-center justify-center gap-2 bg-gold hover:bg-[#8B5105] text-white font-bold text-base uppercase tracking-wider rounded-md transition-all active:scale-98"
                    >
                      Continue to Address <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 2: ADDRESS */}
              <div
                className={`border border-border rounded-xl bg-ivory overflow-hidden transition-all ${step === 2 ? 'shadow-md' : 'opacity-80'}`}
              >
                <div
                  className="p-4 md:p-6 flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    if (step > 2) setStep(2);
                    else if (step === 1 && validateStep1()) setStep(2);
                  }}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > 2 ? 'bg-green-600 text-white' : step === 2 ? 'bg-forest text-white' : 'bg-border text-sage'}`}
                  >
                    {step > 2 ? <CheckCircle2 size={16} /> : '2'}
                  </div>
                  <h2 className="font-semibold text-lg text-bark flex-1">Delivery Address</h2>
                  {step > 2 && (
                    <span className="text-xs font-bold text-sage uppercase tracking-wider">
                      {form.pincode}
                    </span>
                  )}
                </div>

                {step === 2 && (
                  <div className="px-4 md:px-6 pb-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block font-medium text-sm text-bark mb-1.5">
                        Full Address
                      </label>
                      <textarea
                        rows={3}
                        value={form.address}
                        onChange={(e) => handleField('address', e.target.value)}
                        onBlur={() => handleBlur('address')}
                        autoComplete="street-address"
                        className={`w-full min-h-[48px] px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-border'} rounded-md bg-white text-base text-bark focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all resize-none`}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-sm text-bark mb-1.5">
                          Pin Code
                        </label>
                        <input
                          type="text"
                          value={form.pincode}
                          onChange={(e) => handleField('pincode', e.target.value)}
                          onBlur={() => handleBlur('pincode')}
                          autoComplete="postal-code"
                          className={`w-full min-h-[48px] px-4 border ${errors.pincode ? 'border-red-500' : 'border-border'} rounded-md bg-white text-base text-bark focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all`}
                        />
                        {errors.pincode && (
                          <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-medium text-sm text-bark mb-1.5">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => handleField('city', e.target.value)}
                          onBlur={() => handleBlur('city')}
                          autoComplete="address-level2"
                          className={`w-full min-h-[48px] px-4 border ${errors.city ? 'border-red-500' : 'border-border'} rounded-md bg-white text-base text-bark focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all`}
                        />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (validateStep2()) setStep(3);
                      }}
                      className="w-full min-h-[56px] flex items-center justify-center gap-2 bg-gold hover:bg-[#8B5105] text-white font-bold text-base uppercase tracking-wider rounded-md transition-all active:scale-98"
                    >
                      Continue to Payment <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 3: PAYMENT */}
              <div
                className={`border border-border rounded-xl bg-ivory overflow-hidden transition-all ${step === 3 ? 'shadow-md' : 'opacity-80'}`}
              >
                <div className="p-4 md:p-6 flex items-center gap-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 3 ? 'bg-forest text-white' : 'bg-border text-sage'}`}
                  >
                    3
                  </div>
                  <h2 className="font-semibold text-lg text-bark">Payment</h2>
                </div>

                {step === 3 && (
                  <div className="px-4 md:px-6 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4">
                      {[
                        {
                          id: 'upi',
                          label: 'UPI (GPay, PhonePe)',
                          desc: 'Pay instantly with any UPI app',
                          icon: <Smartphone className="text-gold" size={20} />,
                        },
                        {
                          id: 'card',
                          label: 'Credit / Debit Card',
                          desc: 'Visa, Mastercard, RuPay',
                          icon: <CreditCard className="text-gold" size={20} />,
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPayMethod(m.id)}
                          className={`w-full p-4 md:p-5 rounded-lg border-2 text-left transition-all flex items-center justify-between ${
                            payMethod === m.id
                              ? 'border-gold bg-gold/5'
                              : 'border-border bg-white hover:border-gold/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${payMethod === m.id ? 'bg-gold/20' : 'bg-border/30'}`}
                            >
                              {m.icon}
                            </div>
                            <div>
                              <div className="font-bold text-bark text-sm">{m.label}</div>
                              <div className="text-xs text-sage">{m.desc}</div>
                            </div>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === m.id ? 'border-gold' : 'border-border'}`}
                          >
                            {payMethod === m.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

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
                              phone: form.phone,
                            },
                            () => {},
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
                      className="w-full min-h-[56px] bg-gold hover:bg-[#8B5105] text-white rounded-md font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 uppercase tracking-widest"
                    >
                      {isProcessing ? 'Processing...' : `Pay ₹${grandTotal}`}
                    </button>
                    <p className="text-center text-xs text-sage font-medium flex items-center justify-center gap-1.5">
                      <ShieldCheck size={14} /> 256-bit SSL Secure Encrypted
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary - Sticky Right Column */}
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 mt-8 lg:mt-0">
            <div className="bg-ivory rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-bark uppercase tracking-widest text-sm mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-bark truncate leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-sage font-medium tracking-wide mt-1">
                        {item.weight} × {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-bark font-display whitespace-nowrap">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-5 border-t border-border/50 text-sm">
                <div className="flex justify-between text-bark">
                  <span>Subtotal</span>
                  <span className="font-bold font-display">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-bark">
                  <span>Shipping</span>
                  <span
                    className={`font-bold font-display ${shipping === 0 ? 'text-green-700' : ''}`}
                  >
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-border mt-2">
                  <span className="font-bold text-bark">Total</span>
                  <span className="text-2xl font-bold font-display text-bark">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sage text-xs">
              <span className="flex items-center gap-1">
                <Lock size={12} /> Secure
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} /> Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
