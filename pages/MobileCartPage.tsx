import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cart from '../components/Cart';
import { useCartStore } from '../store/cartStore';
import { productAPI, promoAPI } from '../utils/apiService';
import { Product, Variant } from '../types';
import { MobileHeader } from '../components/mobile';

const MobileCartPage: React.FC = () => {
    const navigate = useNavigate();
    const cartItems = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const addItem = useCartStore((state) => state.addItem);
    const subtotal = useCartStore((state) => state.getSubtotal());

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Auth state from local storage token
    const [isLoggedIn] = useState(() => !!localStorage.getItem('auth_token'));

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
        // Optional: Add toast here
    };

    const handleApplyPromoCode = async (code: string) => {
        try {
            if (!code) return;
            const response = await promoAPI.apply(code, subtotal);
            if (response.success) {
                setDiscount(response.data.discount);
            } else {
                setDiscount(0);
                // Alert handled by Cart component or handle here
            }
        } catch (error) {
            console.error('Promo apply error:', error);
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
                    discount={discount}
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
