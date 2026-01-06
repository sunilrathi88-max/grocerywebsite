import React, { useState } from 'react';
import ProductGrid from '../ProductGrid';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Product, Variant, ToastMessage } from '../../types';
import { ToastContainer } from '../ui/ToastContainer';

const AccountWishlist: React.FC = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type']) => {
    setToasts((prev) => [...prev, { id: Date.now(), message, type }]);
  };

  const handleAddToCart = (product: Product, variant: Variant, quantity: number = 1) => {
    addToCart(product, variant, quantity);
    addToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div>
      <h3 className="text-2xl font-serif font-bold mb-6">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <ProductGrid
          products={wishlistItems}
          onAddToCart={handleAddToCart}
          onToggleWishlist={toggleWishlist}
          comparisonIds={new Set()}
          isLoading={false}
          onNotifyMe={() => {}}
          onClearFilters={() => {}}
        />
      )}
      <ToastContainer
        toasts={toasts}
        onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};

export default AccountWishlist;
