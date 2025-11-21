/**
 * API Service Layer
 * Business logic for API calls with proper typing
 */

import { api, APIResponse, PaginatedResponse } from './api';
import { Product, Order, User, Review, QnA } from '../types';

/**
 * Product API endpoints
 */
import { supabase } from '../supabaseClient';

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
    let query = supabase
      .from('products')
      .select(`
        *,
        variants (*),
        reviews (*),
        qna (*)
      `);

    if (params?.category && params.category !== 'All') {
      query = query.eq('category', params.category);
    }

    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    if (params?.tags && params.tags.length > 0) {
      query = query.contains('tags', params.tags);
    }

    // Note: Price filtering would require joining variants or filtering in memory if complex
    // For MVP, we'll fetch and let the frontend filter for price if needed, or add simple filters

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    // Transform data to match Product interface (Supabase returns snake_case, we need camelCase if not auto-mapped)
    // Assuming we mapped columns in SQL or will map here. 
    // For simplicity, let's assume we need to map snake_case to camelCase manually if they differ.
    // Our SQL used snake_case for some fields (harvest_date, purity_test, shelf_life).

    return (data as any[]).map(p => ({
      ...p,
      harvestDate: p.harvest_date,
      purityTest: p.purity_test,
      shelfLife: p.shelf_life,
      // Ensure arrays are arrays
      images: p.images || [],
      videos: p.videos || [],
      tags: p.tags || [],
      variants: p.variants || [],
      reviews: p.reviews || [],
      qna: p.qna || []
    }));
  },

  /**
   * Get single product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variants (*),
        reviews (*),
        qna (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    const p = data as any;
    return {
      ...p,
      harvestDate: p.harvest_date,
      purityTest: p.purity_test,
      shelfLife: p.shelf_life,
      images: p.images || [],
      videos: p.videos || [],
      tags: p.tags || [],
      variants: p.variants || [],
      reviews: p.reviews || [],
      qna: p.qna || []
    };
  },

  /**
   * Create new product (admin only)
   */
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    // This is complex because we need to insert into multiple tables.
    // For MVP, we'll just insert the main product.
    // In a real app, we'd use a transaction or multiple calls.

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        category: product.category,
        images: product.images,
        videos: product.videos,
        nutrition: product.nutrition,
        origin: product.origin,
        harvest_date: product.harvestDate,
        grade: product.grade,
        purity_test: product.purityTest,
        storage: product.storage,
        shelf_life: product.shelfLife,
        grind: product.grind,
        tags: product.tags,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any; // simplified
  },

  /**
   * Update existing product (admin only)
   */
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...product,
        harvest_date: product.harvestDate,
        purity_test: product.purityTest,
        shelf_life: product.shelfLife,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any;
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Add review to product
   */
  addReview: async (productId: number, review: Omit<Review, 'id'>): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        verified_purchase: review.verifiedPurchase,
        date: review.date || new Date().toISOString(),
        images: review.images,
        helpful: review.helpful || 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any;
  },

  /**
   * Add question to product
   */
  addQuestion: async (productId: number, question: Omit<QnA, 'id'>): Promise<QnA> => {
    const { data, error } = await supabase
      .from('qna')
      .insert({
        product_id: productId,
        author: question.author,
        question: question.question,
        answer: question.answer,
        date: question.date || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as any;
  },
};

/**
 * Order API endpoints
 */
export const orderAPI = {
  /**
   * Get all orders for current user
   */
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*), variant:variants(*))')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Transform snake_case to camelCase if needed, or rely on frontend to handle it.
    // For consistency with types, we should map it.
    return {
      data: data.map(o => ({
        ...o,
        shippingAddress: o.shipping_address,
        billingAddress: o.billing_address,
        paymentMethod: o.payment_provider,
        shippingCost: 0, // stored in total usually
        items: o.items.map((i: any) => ({
          product: i.product,
          selectedVariant: i.variant,
          quantity: i.quantity
        }))
      })),
      total: data.length
    };
  },

  /**
   * Get single order by ID
   */
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*), variant:variants(*))')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return {
      data: {
        ...data,
        shippingAddress: data.shipping_address,
        billingAddress: data.billing_address,
        paymentMethod: data.payment_provider,
        items: data.items.map((i: any) => ({
          product: i.product,
          selectedVariant: i.variant,
          quantity: i.quantity
        }))
      }
    };
  },

  /**
   * Create new order
   */
  create: async (order: Omit<Order, 'id' | 'date' | 'status'> & { userId?: string; guestEmail?: string; paymentId?: string }) => {
    // 1. Insert Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: order.userId,
        guest_email: order.guestEmail,
        total: order.total,
        status: 'paid', // Assuming success if we are here
        payment_id: order.paymentId,
        payment_provider: 'razorpay',
        shipping_address: order.shippingAddress,
        billing_address: order.billingAddress,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Insert Order Items
    const itemsToInsert = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      variant_id: item.selectedVariant.id,
      quantity: item.quantity,
      price_at_purchase: item.selectedVariant.salePrice ?? item.selectedVariant.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw new Error(itemsError.message);

    return {
      ...orderData,
      id: orderData.id,
      items: order.items,
      date: orderData.created_at,
      status: orderData.status
    };
  },

  /**
   * Update order status (admin only)
   */
  updateStatus: async (id: string, status: Order['status']) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data };
  },

  /**
   * Cancel order
   */
  cancel: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { data };
  },
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
  register: (userData: { name: string; email: string; password: string; phone?: string }) =>
    api.post<APIResponse<{ user: User; token: string }>>('/auth/register', userData),

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
  updateProfile: (userData: Partial<User>) => api.put<APIResponse<User>>('/users/me', userData),

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
  add: (productId: number) => api.post<APIResponse<void>>('/wishlist', { productId }),

  /**
   * Remove product from wishlist
   */
  remove: (productId: number) => api.delete<APIResponse<void>>(`/wishlist/${productId}`),

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
