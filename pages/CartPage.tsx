import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { productAPI, promoAPI } from '../utils/apiService';
import { Product, Variant } from '../types';

import { Coupon } from '../types';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addItem = useCartStore((state) => state.addItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  // New Store Actions
  const discountAmount = useCartStore((state) => state.discountAmount);
  const discountCode = useCartStore((state) => state.discountCode);
  const applyCoupon = useCartStore((state) => state.applyCoupon);

  const [promoCode, setPromoCode] = useState(discountCode || '');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoggedIn] = useState(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  });

  useEffect(() => {
    if (discountCode) setPromoCode(discountCode);
  }, [discountCode]);

  useEffect(() => {
    // Fetch recommended products
    const fetchRecommendations = async () => {
      try {
        const products = await productAPI.getAll({ limit: 5 });
        setRecommendedProducts(products);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);

  const shippingCost = subtotal >= 600 ? 0 : 50;

  const handleAddToCart = (product: Product, variant: Variant) => {
    addItem({
      id: `${product.id}-${variant.name}`,
      name: product.name,
      price: variant.salePrice || variant.price,
      quantity: 1,
      weight: variant.name,
      image: product.images[0],
      stock: variant.stock || 50,
    });
    alert('Added to cart!');
  };

  const handleApplyPromoCode = async (code: string) => {
    if (!code.trim()) {
      applyCoupon(null, 0);
      return;
    }

    try {
      // 1. Fetch generic coupons from localStorage (Admin Panel)
      const savedCoupons = localStorage.getItem('tattva_coupons');
      let coupon: Coupon | undefined;

      if (savedCoupons) {
        const coupons: Coupon[] = JSON.parse(savedCoupons);
        coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
      }

      // If not found in generic coupons, check for simple hardcoded ones (legacy support)
      if (!coupon) {
        // Fallback or just fail
        throw new Error('Invalid promo code');
      }

      // 2. Validate
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      if (!coupon.isActive) throw new Error('Coupon is inactive');
      if (now < validFrom) throw new Error(`Coupon starts on ${validFrom.toLocaleDateString()}`);
      if (now > validUntil) throw new Error(`Coupon expired on ${validUntil.toLocaleDateString()}`);
      if (subtotal < coupon.minOrderValue) {
        throw new Error(`Minimum order of ₹${coupon.minOrderValue} required`);
      }
      if (coupon.usedCount >= coupon.maxUses) throw new Error('Coupon usage limit reached');

      // 3. Calculate Discount
      let calculatedDiscount = 0;
      if (coupon.discountType === 'percentage') {
        calculatedDiscount = (subtotal * coupon.discountValue) / 100;
      } else {
        calculatedDiscount = coupon.discountValue;
      }

      // Cap discount at subtotal (formatted to 2 decimal places if needed, but number is fine)
      calculatedDiscount = Math.min(calculatedDiscount, subtotal);
      calculatedDiscount = Math.floor(calculatedDiscount); // Round down for clean numbers

      // 4. Apply to Store
      applyCoupon(coupon.code, calculatedDiscount);
      alert(`Code ${coupon.code} applied! Saved ₹${calculatedDiscount}`);
    } catch (error: any) {
      console.error('Promo error:', error);
      alert(error.message || 'Failed to apply promo code');
      applyCoupon(null, 0); // Clear on error
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold text-brand-dark mb-8 text-center">
        Your Shopping Cart
      </h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[600px] border border-gray-100">
        <Cart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onClose={() => navigate('/')} // Redirect to home or back
          isLoggedIn={isLoggedIn}
          promoCode={promoCode}
          onPromoCodeChange={setPromoCode}
          onApplyPromoCode={handleApplyPromoCode}
          discount={discountAmount}
          subtotal={subtotal}
          shippingCost={shippingCost}
          onCheckout={handleCheckout}
          onAddToCart={handleAddToCart}
          recommendedProducts={recommendedProducts}
        />
      </div>
    </div>
  );
};

export default CartPage;
