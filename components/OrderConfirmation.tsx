import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const OrderConfirmation: React.FC<{ order: Order }> = ({ order }) => {
  if (!order) return null;

  const estimatedDelivery = order.deliverySlot
    ? `${order.deliverySlot.date}, ${order.deliverySlot.time}`
    : '3–5 business days';

  return (
    <div className="min-h-screen bg-[#FAF6F2] py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Hero */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={0}
          className="relative overflow-hidden rounded-3xl text-center"
          style={{
            background: 'linear-gradient(135deg,#0F0704 0%,#2C1608 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#B38B59]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 px-8 py-12">
            <div
              className="w-20 h-20 rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,#22C55E20,#16A34A10)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <CheckCircle size={40} className="text-emerald-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-3">
              Order Confirmed!
            </h1>
            <p className="text-stone-400 text-base leading-relaxed max-w-sm mx-auto">
              Thank you for your order. A confirmation has been sent to your email.
            </p>
            <div
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(179,139,89,0.1)',
                border: '1px solid rgba(179,139,89,0.2)',
              }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B38B59]">
                Order #{String(order.id).slice(-8).toUpperCase()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-white rounded-3xl border border-stone-100 overflow-hidden"
        >
          <div className="p-7 grid grid-cols-3 gap-4 border-b border-stone-100">
            {[
              { icon: Package, label: 'Status', value: 'Confirmed', color: '#22C55E' },
              { icon: Truck, label: 'Delivery', value: estimatedDelivery, color: '#B38B59' },
              {
                icon: ShoppingBag,
                label: 'Payment',
                value: order.paymentMethod || 'Online',
                color: '#6366F1',
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <div
                  className="w-10 h-10 rounded-2xl mx-auto mb-2 flex items-center justify-center"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                  {label}
                </div>
                <div className="text-[11px] font-black text-stone-700 leading-tight">{value}</div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="p-7">
            <h3 className="font-display text-lg font-bold text-[#42210B] mb-5">Order Items</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {order.items?.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <OptimizedImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      type="thumbnail"
                      priority="high"
                      width={56}
                      height={56}
                      onError={imageErrorHandlers.thumb}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-stone-400">
                      {item.weight} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-[#42210B] text-sm shrink-0">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-stone-100">
              <span className="font-bold text-stone-500 text-sm uppercase tracking-widest">
                Total Paid
              </span>
              <span className="font-display text-2xl font-black text-[#42210B]">
                ₹{order.total.toFixed(0)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          custom={2}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
              boxShadow: '0 8px 30px rgba(179,139,89,0.35)',
            }}
          >
            <ShoppingBag size={15} />
            Continue Shopping
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/account/orders"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border-2 transition-all hover:scale-[1.02] active:scale-95"
            style={{ borderColor: '#E7E0D9', color: '#42210B' }}
          >
            <Package size={15} />
            Track My Order
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
