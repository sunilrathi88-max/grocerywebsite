import { useState, useCallback, useMemo } from 'react';
import { CartItem, Product, Variant } from '../types';

export interface UseCartReturn {
  cartItems: CartItem[];
  cartItemCount: number;
  subtotal: number;
  addToCart: (product: Product, variant: Variant, quantity?: number) => void;
  removeFromCart: (productId: number, variantId: number) => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number, variantId: number) => boolean;
  getCartItemQuantity: (productId: number, variantId: number) => number;
}

/**
 * Custom hook for managing shopping cart state and operations
 * 
 * @returns {UseCartReturn} Cart state and methods
 * 
 * @example
 * const { cartItems, addToCart, subtotal } = useCart();
 * addToCart(product, variant, 2);
 */
export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /**
   * Calculate total number of items in cart
   */
  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  /**
   * Calculate cart subtotal
   */
  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => {
      const price = item.selectedVariant.salePrice ?? item.selectedVariant.price;
      return total + price * item.quantity;
    }, 0),
    [cartItems]
  );

  /**
   * Add product to cart or update quantity if already exists
   */
  const addToCart = useCallback((product: Product, variant: Variant, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && item.selectedVariant.id === variant.id
      );
      
      if (existingItem) {
        // Update quantity, respecting stock limits
        return prevItems.map(item =>
          item.product.id === product.id && item.selectedVariant.id === variant.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, variant.stock) }
            : item
        );
      }
      
      // Add new item
      return [...prevItems, { product, selectedVariant: variant, quantity }];
    });
  }, []);

  /**
   * Remove product from cart completely
   */
  const removeFromCart = useCallback((productId: number, variantId: number) => {
    setCartItems(prev => 
      prev.filter(item => !(item.product.id === productId && item.selectedVariant.id === variantId))
    );
  }, []);

  /**
   * Update quantity of a cart item (or remove if quantity <= 0)
   */
  const updateQuantity = useCallback((productId: number, variantId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      setCartItems(prev => prev.map(item =>
        item.product.id === productId && item.selectedVariant.id === variantId
          ? { ...item, quantity: Math.min(quantity, item.selectedVariant.stock) }
          : item
      ));
    }
  }, [removeFromCart]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /**
   * Check if a product variant is in the cart
   */
  const isInCart = useCallback((productId: number, variantId: number): boolean => {
    return cartItems.some(
      item => item.product.id === productId && item.selectedVariant.id === variantId
    );
  }, [cartItems]);

  /**
   * Get quantity of a specific product variant in cart
   */
  const getCartItemQuantity = useCallback((productId: number, variantId: number): number => {
    const item = cartItems.find(
      item => item.product.id === productId && item.selectedVariant.id === variantId
    );
    return item?.quantity ?? 0;
  }, [cartItems]);

  return {
    cartItems,
    cartItemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity
  };
};
