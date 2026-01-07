import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { productAPI, promoAPI } from '../utils/apiService';
import { Product, Variant } from '../types';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addItem = useCartStore((state) => state.addItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoggedIn] = useState(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  });

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

  const shippingCost = subtotal > 1000 ? 0 : 50;

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
    try {
      if (!code) return;
      // Using the new Edge Function via apiService
      const response = await promoAPI.apply(code, subtotal);
      if (response.success) {
        setDiscount(response.data.discount);
        alert(response.message || 'Promo code applied!');
      } else {
        setDiscount(0);
        alert(response.message || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Promo apply error:', error);
      alert('Failed to apply promo code');
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
          discount={discount}
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
