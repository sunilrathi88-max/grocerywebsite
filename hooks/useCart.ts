import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

const CART_STORAGE_KEY = 'tattva_cart';

/**
 * Custom hook for managing shopping cart state and operations using React Query
 */
export const useCart = (): UseCartReturn => {
  const queryClient = useQueryClient();

  // --- Query ---

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return [];
      }
    },
    staleTime: Infinity, // Local state, effectively
    initialData: [],
  });

  // --- Mutations ---

  const addToCartMutation = useMutation({
    mutationFn: async ({
      product,
      variant,
      quantity,
    }: {
      product: Product;
      variant: Variant;
      quantity: number;
    }) => {
      const currentCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      const existingItemIndex = currentCart.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      let newCart: CartItem[];
      if (existingItemIndex > -1) {
        newCart = [...currentCart];
        const item = newCart[existingItemIndex];
        newCart[existingItemIndex] = {
          ...item,
          quantity: Math.min(item.quantity + quantity, variant.stock),
        };
      } else {
        newCart = [
          ...currentCart,
          {
            id: `${product.id}-${variant.name}`,
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            price: variant.salePrice || variant.price,
            quantity,
            weight: variant.name,
            image: product.images[0],
            stock: variant.stock,
          },
        ];
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({ productId, variantId }: { productId: number; variantId: number }) => {
      const currentCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];
      const newCart = currentCart.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity,
    }: {
      productId: number;
      variantId: number;
      quantity: number;
    }) => {
      const currentCart = queryClient.getQueryData<CartItem[]>(['cart']) || [];

      if (quantity <= 0) {
        const newCart = currentCart.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        );
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      }

      const newCart = currentCart.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    },
    onSuccess: (newCart) => {
      queryClient.setQueryData(['cart'], newCart);
    },
  });

  // --- Computed Values ---

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0),
    [cartItems]
  );

  // --- Handlers ---

  const addToCart = useCallback(
    (product: Product, variant: Variant, quantity: number = 1) => {
      addToCartMutation.mutate({ product, variant, quantity });
    },
    [addToCartMutation]
  );

  const removeFromCart = useCallback(
    (productId: number, variantId: number) => {
      removeFromCartMutation.mutate({ productId, variantId });
    },
    [removeFromCartMutation]
  );

  const updateQuantity = useCallback(
    (productId: number, variantId: number, quantity: number) => {
      updateQuantityMutation.mutate({ productId, variantId, quantity });
    },
    [updateQuantityMutation]
  );

  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  const isInCart = useCallback(
    (productId: number, variantId: number): boolean => {
      return cartItems.some(
        (item) => item.productId === productId && item.variantId === variantId
      );
    },
    [cartItems]
  );

  const getCartItemQuantity = useCallback(
    (productId: number, variantId: number): number => {
      const item = cartItems.find(
        (item) => item.productId === productId && item.variantId === variantId
      );
      return item?.quantity ?? 0;
    },
    [cartItems]
  );

  return {
    cartItems,
    cartItemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
  };
};
