/**
 * API Service Layer
 * Business logic for API calls with proper typing
 */

import { api, APIResponse } from './api';
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
    let query = supabase.from('products').select(`
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

    return (data as any[]).map((p) => ({
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
      qna: p.qna || [],
    }));
  },

  /**
   * Get single product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        variants (*),
        reviews (*),
        qna (*)
      `
      )
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
      qna: p.qna || [],
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
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<APIResponse<Order[]>> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      // Filter by user if authenticated
      if (user) {
        query = query.eq('user_id', user.id);
      }

      // Filter by status if provided
      if (params?.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to Order type
      const orders: Order[] = data.map((o: any) => ({
        id: o.id,
        date: o.created_at,
        status: o.status,
        total: parseFloat(o.total),
        shippingAddress: {
          id: 0,
          street: o.shipping_street,
          city: o.shipping_city,
          state: o.shipping_state,
          zip: o.shipping_zip,
          country: o.shipping_country || 'India',
          type: 'Shipping',
          isDefault: false,
        },
        billingAddress: o.billing_street
          ? {
              id: 0,
              street: o.billing_street,
              city: o.billing_city,
              state: o.billing_state,
              zip: o.billing_zip,
              country: o.billing_country || 'India',
              type: 'Billing',
              isDefault: false,
            }
          : {
              id: 0,
              street: o.shipping_street,
              city: o.shipping_city,
              state: o.shipping_state,
              zip: o.shipping_zip,
              country: o.shipping_country || 'India',
              type: 'Billing',
              isDefault: false,
            },
        deliveryMethod: (o.delivery_method as any) || 'Standard',
        paymentMethod: o.payment_method,
        shippingCost: parseFloat(o.shipping_cost) || 0,
        discount: parseFloat(o.discount) || 0,
        deliverySlot: o.delivery_date
          ? {
              date: o.delivery_date,
              time: o.delivery_time || '',
            }
          : undefined,
        trackingNumber: o.tracking_number,
        items: o.order_items.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product_name,
            images: [item.product_image],
            // Add minimal product data for display
          } as any,
          selectedVariant: {
            id: item.variant_id,
            name: item.variant_name,
            price: parseFloat(item.unit_price),
            salePrice: item.sale_price ? parseFloat(item.sale_price) : undefined,
          } as any,
          quantity: item.quantity,
        })),
      }));

      return {
        data: orders,
        message: 'Orders fetched successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get single order by ID
   */
  getById: async (id: string): Promise<APIResponse<Order>> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();

      if (error) throw error;

      const order: Order = {
        id: data.id,
        date: data.created_at,
        status: data.status,
        total: parseFloat(data.total),
        shippingAddress: {
          id: 0,
          street: data.shipping_street,
          city: data.shipping_city,
          state: data.shipping_state,
          zip: data.shipping_zip,
          country: data.shipping_country || 'India',
          type: 'Shipping',
          isDefault: false,
        },
        billingAddress: data.billing_street
          ? {
              id: 0,
              street: data.billing_street,
              city: data.billing_city,
              state: data.billing_state,
              zip: data.billing_zip,
              country: data.billing_country || 'India',
              type: 'Billing',
              isDefault: false,
            }
          : {
              id: 0,
              street: data.shipping_street,
              city: data.shipping_city,
              state: data.shipping_state,
              zip: data.shipping_zip,
              country: data.shipping_country || 'India',
              type: 'Billing',
              isDefault: false,
            },
        deliveryMethod: (data.delivery_method as any) || 'Standard',
        paymentMethod: data.payment_method,
        shippingCost: parseFloat(data.shipping_cost) || 0,
        discount: parseFloat(data.discount) || 0,
        deliverySlot: data.delivery_date
          ? {
              date: data.delivery_date,
              time: data.delivery_time || '',
            }
          : undefined,
        trackingNumber: data.tracking_number,
        items: data.order_items.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product_name,
            images: [item.product_image],
          } as any,
          selectedVariant: {
            id: item.variant_id,
            name: item.variant_name,
            price: parseFloat(item.unit_price),
            salePrice: item.sale_price ? parseFloat(item.sale_price) : undefined,
          } as any,
          quantity: item.quantity,
        })),
      };

      return {
        data: order,
        message: 'Order fetched successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Create new order
   */
  create: async (
    orderData: Omit<Order, 'id' | 'date' | 'status'> & {
      userId?: string;
      guestEmail?: string;
      guestPhone?: string;
      paymentId?: string;
    }
  ): Promise<APIResponse<Order>> => {
    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate tax (8%)
      const tax = (orderData.total - orderData.discount) * 0.08;

      // 1. Insert Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: orderData.userId || null,
          guest_email: orderData.guestEmail || null,
          guest_phone: orderData.guestPhone || null,
          status: 'Processing',
          total: orderData.total,
          subtotal:
            orderData.total - (orderData.shippingCost || 0) - tax + (orderData.discount || 0),
          shipping_cost: orderData.shippingCost || 0,
          tax,
          discount: orderData.discount || 0,
          payment_method: orderData.paymentMethod,
          payment_id: orderData.paymentId || null,
          delivery_method: orderData.deliveryMethod || 'Standard',
          promo_code: null,
          shipping_street: orderData.shippingAddress.street,
          shipping_city: orderData.shippingAddress.city,
          shipping_state: orderData.shippingAddress.state,
          shipping_zip: orderData.shippingAddress.zip,
          shipping_country: orderData.shippingAddress.country || 'India',
          billing_street: orderData.billingAddress.street,
          billing_city: orderData.billingAddress.city,
          billing_state: orderData.billingAddress.state,
          billing_zip: orderData.billingAddress.zip,
          billing_country: orderData.billingAddress.country || 'India',
          delivery_date: orderData.deliverySlot?.date || null,
          delivery_time: orderData.deliverySlot?.time || null,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw orderError;
      }

      // 2. Insert Order Items
      const itemsToInsert = orderData.items.map((item) => ({
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0] || null,
        variant_id: item.selectedVariant.id,
        variant_name: item.selectedVariant.name,
        quantity: item.quantity,
        unit_price: item.selectedVariant.price,
        sale_price: item.selectedVariant.salePrice || null,
        total: (item.selectedVariant.salePrice || item.selectedVariant.price) * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        // Rollback order if items fail
        await supabase.from('orders').delete().eq('id', orderId);
        throw itemsError;
      }

      // 3. Return created order
      const createdOrder: Order = {
        id: orderId,
        date: order.created_at,
        status: 'Processing',
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        deliveryMethod: orderData.deliveryMethod || 'Standard',
        paymentMethod: orderData.paymentMethod,
        shippingCost: orderData.shippingCost || 0,
        discount: orderData.discount || 0,
        deliverySlot: orderData.deliverySlot,
        items: orderData.items,
      };

      return {
        data: createdOrder,
        message: 'Order created successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Update order status
   */
  updateStatus: async (orderId: string, status: Order['status']): Promise<APIResponse<Order>> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select('*, order_items(*)')
        .single();

      if (error) throw error;

      // Transform to Order type (reuse logic from getById)
      const order: Order = {
        id: data.id,
        date: data.created_at,
        status: data.status,
        total: parseFloat(data.total),
        shippingAddress: {
          id: 0,
          street: data.shipping_street,
          city: data.shipping_city,
          state: data.shipping_state,
          zip: data.shipping_zip,
          country: data.shipping_country || 'India',
          type: 'Shipping',
          isDefault: false,
        },
        billingAddress: {
          id: 0,
          street: data.billing_street || data.shipping_street,
          city: data.billing_city || data.shipping_city,
          state: data.billing_state || data.shipping_state,
          zip: data.billing_zip || data.shipping_zip,
          country: data.billing_country || data.shipping_country || 'India',
          type: 'Billing',
          isDefault: false,
        },
        deliveryMethod: (data.delivery_method as any) || 'Standard',
        paymentMethod: data.payment_method,
        shippingCost: parseFloat(data.shipping_cost) || 0,
        discount: parseFloat(data.discount) || 0,
        items: data.order_items.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product_name,
            images: [item.product_image],
          } as any,
          selectedVariant: {
            id: item.variant_id,
            name: item.variant_name,
            price: parseFloat(item.unit_price),
            salePrice: item.sale_price ? parseFloat(item.sale_price) : undefined,
          } as any,
          quantity: item.quantity,
        })),
      };

      return {
        data: order,
        message: 'Order status updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Cancel order
   */
  cancel: async (orderId: string): Promise<APIResponse<void>> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('status', 'Processing'); // Can only cancel if still processing

      if (error) throw error;

      return {
        data: undefined,
        message: 'Order cancelled successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
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
