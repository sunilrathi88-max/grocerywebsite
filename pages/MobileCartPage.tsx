import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { productAPI, promoAPI } from '../utils/apiService';
import { Product, Variant } from '../types';
import { MobileHeader } from '../components/mobile';

import { Coupon } from '../types';

const MobileCartPage: React.FC = () => {
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
  const [searchQuery, setSearchQuery] = useState('');

  // Auth state from local storage token
  const [isLoggedIn] = useState(() => !!localStorage.getItem('auth_token'));

  useEffect(() => {
    if (discountCode) setPromoCode(discountCode);
  }, [discountCode]);

  useEffect(() => {
    // Fetch recommended products with error handling
    const fetchRecommendations = async () => {
      try {
        const products = await productAPI.getAll({ limit: 5 });
        setRecommendedProducts(products || []);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendedProducts([]);
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
    // Optional: Add toast here
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

      // 2. Validate
      if (!coupon) throw new Error('Invalid promo code');

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

      calculatedDiscount = Math.min(calculatedDiscount, subtotal);
      calculatedDiscount = Math.floor(calculatedDiscount);

      // 4. Apply to Store
      applyCoupon(coupon.code, calculatedDiscount);
      // Mobile handles alerts differently, usually toast. For now, simple console confirm or rely on UI update.
      console.log(`Code ${coupon.code} applied! Saved ₹${calculatedDiscount}`);
    } catch (error: any) {
      console.error('Promo error:', error);
      applyCoupon(null, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Mobile Header */}
      <MobileHeader
        brandName="My Cart"
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCartClick={() => { }} // Already on cart
      />

      <div className="p-4">
        <Cart
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onClose={() => navigate(-1)}
          isLoggedIn={isLoggedIn}
          promoCode={promoCode}
          onPromoCodeChange={setPromoCode}
          onApplyPromoCode={handleApplyPromoCode}
          discount={discountAmount}
          subtotal={subtotal}
          shippingCost={shippingCost}
          onCheckout={() => navigate('/checkout')}
          onAddToCart={handleAddToCart}
          recommendedProducts={recommendedProducts}
        />
      </div>
    </div>
  );
};

export default MobileCartPage;
