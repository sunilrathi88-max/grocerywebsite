/**
 * API Service Layer
 * Business logic for API calls with proper typing
 */

import { api, APIResponse, PaginatedResponse } from './api';
import { Product, Order, User, Review, QnA } from '../types';

/**
 * Product API endpoints
 */
export const productAPI = {
  /**
   * Get all products with optional filters
   */
  getAll: async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<Product[]> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', params as Record<string, string | number>);
    return response.data;
  },

  /**
   * Get single product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const response = await api.get<APIResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create new product (admin only)
   */
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post<APIResponse<Product>>('/products', product);
    return response.data;
  },

  /**
   * Update existing product (admin only)
   */
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<APIResponse<Product>>(`/products/${id}`, product);
    return response.data;
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete<APIResponse<void>>(`/products/${id}`);
  },

  /**
   * Add review to product
   */
  addReview: async (productId: number, review: Omit<Review, 'id'>): Promise<Review> => {
    const response = await api.post<APIResponse<Review>>(`/products/${productId}/reviews`, review);
    return response.data;
  },

  /**
   * Add question to product
   */
  addQuestion: async (productId: number, question: Omit<QnA, 'id'>): Promise<QnA> => {
    const response = await api.post<APIResponse<QnA>>(`/products/${productId}/questions`, question);
    return response.data;
  },
};

/**
 * Order API endpoints
 */
export const orderAPI = {
  /**
   * Get all orders for current user
   */
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Order>>('/orders', params as Record<string, string | number>),

  /**
   * Get single order by ID
   */
  getById: (id: string) => api.get<APIResponse<Order>>(`/orders/${id}`),

  /**
   * Create new order
   */
  create: (order: Omit<Order, 'id' | 'date' | 'status'>) =>
    api.post<APIResponse<Order>>('/orders', order),

  /**
   * Update order status (admin only)
   */
  updateStatus: (id: string, status: Order['status']) =>
    api.patch<APIResponse<Order>>(`/orders/${id}/status`, { status }),

  /**
   * Cancel order
   */
  cancel: (id: string) => api.post<APIResponse<Order>>(`/orders/${id}/cancel`),
};

/**
 * User/Auth API endpoints
 */
export const userAPI = {
  /**
   * Login user
   */
  login: (credentials: { email: string; password: string }) =>
    api.post<APIResponse<{ user: User; token: string }>>('/auth/login', credentials),

  /**
   * Register new user
   */
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => api.post<APIResponse<{ user: User; token: string }>>('/auth/register', userData),

  /**
   * Logout user
   */
  logout: () => api.post<APIResponse<void>>('/auth/logout'),

  /**
   * Get current user profile
   */
  getProfile: () => api.get<APIResponse<User>>('/users/me'),

  /**
   * Update user profile
   */
  updateProfile: (userData: Partial<User>) =>
    api.put<APIResponse<User>>('/users/me', userData),

  /**
   * Change password
   */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<APIResponse<void>>('/users/me/password', data),

  /**
   * Request password reset
   */
  requestPasswordReset: (email: string) =>
    api.post<APIResponse<void>>('/auth/forgot-password', { email }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, newPassword: string) =>
    api.post<APIResponse<void>>('/auth/reset-password', { token, newPassword }),
};

/**
 * Promo code API endpoints
 */
export const promoAPI = {
  /**
   * Validate promo code
   */
  validate: (code: string) =>
    api.post<APIResponse<{ valid: boolean; discount: number; message?: string }>>(
      '/promo/validate',
      { code }
    ),

  /**
   * Apply promo code to cart
   */
  apply: (code: string, cartTotal: number) =>
    api.post<APIResponse<{ discount: number; finalTotal: number }>>('/promo/apply', {
      code,
      cartTotal,
    }),
};

/**
 * Analytics API endpoints
 */
export const analyticsAPI = {
  /**
   * Track page view
   */
  trackPageView: (path: string, title?: string) =>
    api.post<APIResponse<void>>('/analytics/pageview', { path, title }),

  /**
   * Track custom event
   */
  trackEvent: (eventName: string, properties?: Record<string, unknown>) =>
    api.post<APIResponse<void>>('/analytics/event', { eventName, properties }),

  /**
   * Track conversion
   */
  trackConversion: (orderId: string, value: number) =>
    api.post<APIResponse<void>>('/analytics/conversion', { orderId, value }),
};

/**
 * Wishlist API endpoints
 */
export const wishlistAPI = {
  /**
   * Get user's wishlist
   */
  get: () => api.get<APIResponse<Product[]>>('/wishlist'),

  /**
   * Add product to wishlist
   */
  add: (productId: number) =>
    api.post<APIResponse<void>>('/wishlist', { productId }),

  /**
   * Remove product from wishlist
   */
  remove: (productId: number) =>
    api.delete<APIResponse<void>>(`/wishlist/${productId}`),

  /**
   * Clear entire wishlist
   */
  clear: () => api.delete<APIResponse<void>>('/wishlist'),
};

/**
 * Cart API endpoints (for server-side cart sync)
 */
export const cartAPI = {
  /**
   * Get user's cart
   */
  get: () =>
    api.get<
      APIResponse<{
        items: Array<{
          productId: number;
          variantId: number;
          quantity: number;
        }>;
      }>
    >('/cart'),

  /**
   * Sync local cart with server
   */
  sync: (items: Array<{ productId: number; variantId: number; quantity: number }>) =>
    api.post<APIResponse<void>>('/cart/sync', { items }),

  /**
   * Clear cart
   */
  clear: () => api.delete<APIResponse<void>>('/cart'),
};
