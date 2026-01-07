/**
 * API Service Layer
 * Business logic for API calls with proper typing
 */

import { api, APIResponse } from './api';
import { Product, Order, User, Review, QnA, Variant, OrderStatus, Address } from '../types';

/**
 * Product API endpoints
 */
/**
 * Lazy load Supabase client to avoid eager bundle loading
 */
const getSupabase = async () => {
  const { supabase } = await import('../supabaseClient');
  return supabase;
};

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
    let query = (await getSupabase()).from('products').select(`
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

    return (data as Record<string, unknown>[]).map(
      (p) =>
        ({
          ...p,
          harvestDate: p.harvest_date as string | null,
          purityTest: p.purity_test as string | null,
          shelfLife: p.shelf_life as number | null,
          // Ensure arrays are arrays
          images: p.images || [],
          videos: p.videos || [],
          tags: p.tags || [],
          variants: p.variants || [],
          reviews: p.reviews || [],
          qna: p.qna || [],
        }) as unknown as Product
    );
  },

  /**
   * Get single product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const { data, error } = await (
      await getSupabase()
    )
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

    const p = data as Record<string, unknown>;
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
    } as Product;
  },

  /**
   * Create new product (admin only)
   */
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    // This is complex because we need to insert into multiple tables.
    // For MVP, we'll just insert the main product.
    // In a real app, we'd use a transaction or multiple calls.

    const { data, error } = await (
      await getSupabase()
    )
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
    return data as Product; // simplified
  },

  /**
   * Update existing product (admin only)
   */
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const { data, error } = await (
      await getSupabase()
    )
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
    return data as Product;
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id: number): Promise<void> => {
    const { error } = await (await getSupabase()).from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Add review to product
   */
  addReview: async (productId: number, review: Omit<Review, 'id'>): Promise<Review> => {
    const { data, error } = await (
      await getSupabase()
    )
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
    return data as Review;
  },

  /**
   * Add question to product
   */
  addQuestion: async (productId: number, question: Omit<QnA, 'id'>): Promise<QnA> => {
    const { data, error } = await (
      await getSupabase()
    )
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
    return data as QnA;
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
    adminMode?: boolean;
  }): Promise<APIResponse<Order[]>> => {
    try {
      const {
        data: { user },
      } = await (await getSupabase()).auth.getUser();

      let query = (await getSupabase())
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      // Filter by user if authenticated and NOT in admin mode
      if (user && !params?.adminMode) {
        query = query.eq('user_id', user.id);
      }

      // Filter by status if provided
      if (params?.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform to Order type
      const orders: Order[] = data.map((o: Record<string, unknown>) => ({
        id: o.id as string,
        date: o.created_at as string,
        status: o.status as OrderStatus,
        total: parseFloat(o.total as string),
        shippingAddress: {
          id: '',
          street: o.shipping_street as string,
          city: o.shipping_city as string,
          state: o.shipping_state as string,
          zip: o.shipping_zip as string,
          country: (o.shipping_country as string) || 'India',
          type: 'Shipping',
          isDefault: false,
        },
        billingAddress: o.billing_street
          ? {
              id: '',
              street: o.billing_street as string,
              city: o.billing_city as string,
              state: o.billing_state as string,
              zip: o.billing_zip as string,
              country: (o.billing_country as string) || 'India',
              type: 'Billing',
              isDefault: false,
            }
          : {
              id: '',
              street: o.shipping_street as string,
              city: o.shipping_city as string,
              state: o.shipping_state as string,
              zip: o.shipping_zip as string,
              country: (o.shipping_country as string) || 'India',
              type: 'Billing',
              isDefault: false,
            },
        deliveryMethod: (o.delivery_method as Order['deliveryMethod']) || 'Standard',
        paymentMethod: o.payment_method as string,
        shippingCost: parseFloat(o.shipping_cost as string) || 0,
        discount: parseFloat(o.discount as string) || 0,
        deliverySlot: o.delivery_date
          ? {
              date: o.delivery_date as string,
              time: (o.delivery_time as string) || '',
            }
          : undefined,
        trackingNumber: o.tracking_number as string,
        items: (o.order_items as Record<string, unknown>[]).map(
          (item: Record<string, unknown>) => ({
            product: {
              id: item.product_id as string,
              name: item.product_name as string,
              images: [item.product_image as string],
              // Add minimal product data for display
            } as unknown as Product,
            selectedVariant: {
              id: item.variant_id as string,
              name: item.variant_name as string,
              price: parseFloat(item.unit_price as string),
              salePrice: item.sale_price ? parseFloat(item.sale_price as string) : undefined,
            } as unknown as Variant,
            quantity: item.quantity as number,
          })
        ),
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
      const { data, error } = await (await getSupabase())
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
          id: '',
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
              id: '',
              street: data.billing_street,
              city: data.billing_city,
              state: data.billing_state,
              zip: data.billing_zip,
              country: data.billing_country || 'India',
              type: 'Billing',
              isDefault: false,
            }
          : {
              id: '',
              street: data.shipping_street,
              city: data.shipping_city,
              state: data.shipping_state,
              zip: data.shipping_zip,
              country: data.shipping_country || 'India',
              type: 'Billing',
              isDefault: false,
            },
        deliveryMethod: (data.delivery_method as Order['deliveryMethod']) || 'Standard',
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
        items: (data.order_items as Record<string, unknown>[]).map(
          (item: Record<string, unknown>) => ({
            product: {
              id: item.product_id as string,
              name: item.product_name as string,
              images: [item.product_image as string],
            } as unknown as Product,
            selectedVariant: {
              id: item.variant_id as string,
              name: item.variant_name as string,
              price: parseFloat(item.unit_price as string),
              salePrice: item.sale_price ? parseFloat(item.sale_price as string) : undefined,
            } as unknown as Variant,
            quantity: item.quantity as number,
          })
        ),
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
      const {
        data: { user },
      } = await (await getSupabase()).auth.getUser();

      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate tax (8%)
      const tax = (orderData.total - orderData.discount) * 0.08;

      // 1. Insert Order
      const { data: order, error: orderError } = await (
        await getSupabase()
      )
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

      const { error: itemsError } = await (await getSupabase())
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        // Rollback order if items fail
        await (await getSupabase()).from('orders').delete().eq('id', orderId);
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

      // 3. Trigger Email Notification (Fire and forget, or log error)
      try {
        const customerEmail = user?.email || orderData.guestEmail;
        const customerName = user?.user_metadata?.name || 'Valued Customer';

        if (customerEmail) {
          (await getSupabase()).functions
            .invoke('send-order-email', {
              body: {
                order_id: orderId,
                customer_name: customerName,
                customer_email: customerEmail,
                total_amount: orderData.total,
                items: orderData.items.map(
                  (item: {
                    product: { name: string };
                    quantity: number;
                    selectedVariant: { price: number };
                  }) => ({
                    product_name: item.product.name,
                    quantity: item.quantity,
                    unit_price: item.selectedVariant.price, // or salePrice? Using price for simplicity or check logic
                  })
                ),
              },
            })
            .then(({ error }) => {
              if (error) console.error('Failed to send email:', error);
            });
        }
      } catch (emailErr) {
        console.warn('Email trigger failed:', emailErr);
        // Don't block order success
      }

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
      const { data, error } = await (await getSupabase())
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
          id: '',
          street: data.shipping_street,
          city: data.shipping_city,
          state: data.shipping_state,
          zip: data.shipping_zip,
          country: data.shipping_country || 'India',
          type: 'Shipping',
          isDefault: false,
        },
        billingAddress: {
          id: '',
          street: data.billing_street || data.shipping_street,
          city: data.billing_city || data.shipping_city,
          state: data.billing_state || data.shipping_state,
          zip: data.billing_zip || data.shipping_zip,
          country: data.billing_country || data.shipping_country || 'India',
          type: 'Billing',
          isDefault: false,
        },
        deliveryMethod: (data.delivery_method as Order['deliveryMethod']) || 'Standard',
        paymentMethod: data.payment_method,
        shippingCost: parseFloat(data.shipping_cost) || 0,
        discount: parseFloat(data.discount) || 0,
        items: (data.order_items as Record<string, unknown>[]).map(
          (item: Record<string, unknown>) => ({
            product: {
              id: item.product_id as string,
              name: item.product_name as string,
              images: [item.product_image as string],
            } as unknown as Product,
            selectedVariant: {
              id: item.variant_id as string,
              name: item.variant_name as string,
              price: parseFloat(item.unit_price as string),
              salePrice: item.sale_price ? parseFloat(item.sale_price as string) : undefined,
            } as unknown as Variant,
            quantity: item.quantity as number,
          })
        ),
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
      const { error } = await (await getSupabase())
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

  /**
   * Track order (Public/Guest)
   */
  trackOrder: async (orderId: string, email?: string): Promise<APIResponse<Order>> => {
    const { data: orderData, error } = await (await getSupabase())
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error) throw new Error('Order not found');

    // Email verification for guests
    if (email) {
      const orderEmail = orderData.guest_email || orderData.user_email || '';
      if (orderEmail.toLowerCase() !== email.toLowerCase()) {
        throw new Error('Order details do not match.');
      }
    }

    // Reuse transformation logic
    const order: Order = {
      id: orderData.id,
      date: orderData.created_at,
      status: orderData.status,
      total: parseFloat(orderData.total),
      shippingAddress: {
        id: '',
        street: orderData.shipping_street,
        city: orderData.shipping_city,
        state: orderData.shipping_state,
        zip: orderData.shipping_zip,
        country: orderData.shipping_country || 'India',
        type: 'Shipping',
        isDefault: false,
      },
      billingAddress: {
        id: '',
        street: orderData.billing_street || orderData.shipping_street,
        city: orderData.billing_city || orderData.shipping_city,
        state: orderData.billing_state || orderData.shipping_state,
        zip: orderData.billing_zip || orderData.shipping_zip,
        country: orderData.billing_country || orderData.shipping_country || 'India',
        type: 'Billing',
        isDefault: false,
      },
      paymentMethod: orderData.payment_method,
      deliveryMethod: (orderData.delivery_method as Order['deliveryMethod']) || 'Standard',
      items: (orderData.order_items as Record<string, unknown>[]).map((item) => ({
        product: {
          id: item.product_id as string,
          name: item.product_name as string,
          images: [item.product_image as string],
        } as unknown as Product,
        selectedVariant: {
          id: item.variant_id as string,
          name: item.variant_name as string,
          price: parseFloat(item.unit_price as string),
        } as unknown as Variant,
        quantity: item.quantity as number,
      })),
      shippingCost: parseFloat(orderData.shipping_cost || '0'),
      discount: parseFloat(orderData.discount || '0'),
    };

    return {
      data: order,
      success: true,
      message: 'Order details found',
    };
  },
};

/**
 * User/Auth API endpoints
 */
export const userAPI = {
  /**
   * Login user
   */
  login: async (credentials: { email: string; password: string }) => {
    const { data, error } = await (await getSupabase()).auth.signInWithPassword(credentials);
    if (error) throw error;
    return {
      data: {
        user: {
          id: parseInt(data.user.id.replace(/-/g, '').slice(0, 15), 16),
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          isAdmin: data.user.email === 'admin@tattva.com', // Mock Admin Logic
          isEmailVerified: !!data.user.email_confirmed_at,
          has2FA: false,
          addresses: data.user.user_metadata?.addresses || [],
          orders: [],
          wishlist: [],
        } as User,
        token: data.session?.access_token || '',
      },
      success: true,
    };
  },

  /**
   * Register new user
   */
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const { data, error } = await (
      await getSupabase()
    ).auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          addresses: [],
        },
      },
    });
    if (error) throw error;
    return {
      data: {
        user: {
          id: data.user ? parseInt(data.user.id.replace(/-/g, '').slice(0, 15), 16) : 0,
          email: data.user?.email || '',
          name: userData.name,
          isAdmin: false,
          isEmailVerified: false,
          has2FA: false,
          addresses: [],
          orders: [],
          wishlist: [],
        } as User,
        token: data.session?.access_token || '',
      },
      success: true,
    };
  },

  /**
   * Logout user
   */
  logout: async () => {
    const { error } = await (await getSupabase()).auth.signOut();
    if (error) throw error;
    return { success: true, data: undefined };
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const {
      data: { user },
      error,
    } = await (await getSupabase()).auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('No user found');

    return {
      data: {
        id: parseInt(user.id.replace(/-/g, '').slice(0, 15), 16),
        email: user.email || '',
        name: user.user_metadata?.name || '',
        isAdmin: false,
        isEmailVerified: !!user.email_confirmed_at,
        has2FA: false,
        addresses: user.user_metadata?.addresses || [],
        orders: [],
        wishlist: [],
      } as User,
      success: true,
    };
  },

  /**
   * Update user profile (including addresses)
   */
  updateProfile: async (userData: Partial<User>) => {
    const updates: Record<string, unknown> = {};
    if (userData.name) updates.name = userData.name;
    if (userData.phone) updates.phone = userData.phone;
    if (userData.addresses) updates.addresses = userData.addresses;

    const { data, error } = await (
      await getSupabase()
    ).auth.updateUser({
      data: updates,
    });

    if (error) throw error;

    return {
      data: {
        id: parseInt(data.user.id.replace(/-/g, '').slice(0, 15), 16),
        email: data.user.email || '',
        name: data.user.user_metadata?.name || '',
        isAdmin: false,
        isEmailVerified: !!data.user.email_confirmed_at,
        has2FA: false,
        addresses: data.user.user_metadata?.addresses || [],
        orders: [],
        wishlist: [],
      } as User,
      success: true,
    };
  },

  /**
   * Change password
   */
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    // Supabase doesn't require current password for update if logged in,
    // but for security we might want to re-auth. For now, just update.
    const { error } = await (await getSupabase()).auth.updateUser({ password: data.newPassword });
    if (error) throw error;
    return { success: true, data: undefined };
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    const { error } = await (
      await getSupabase()
    ).auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/reset-password',
    });
    if (error) throw error;
    return { success: true, data: undefined };
  },

  /**
   * Reset password with token
   * Note: Supabase handles token via URL hash. This function assumes session is established via link.
   */
  resetPassword: async (token: string, newPassword: string) => {
    // In Supabase, you just update the user after clicking the link
    const { error } = await (await getSupabase()).auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true, data: undefined };
  },
};

/**
 * Address API endpoints (Dedicated Table)
 */
export const addressAPI = {
  /**
   * Get all addresses for current user
   */
  getAll: async () => {
    const { data, error } = await (await getSupabase())
      .from('addresses')
      .select('*')
      .order('is_default', { ascending: false });

    if (error) throw error;

    return {
      data: data as Address[],
      success: true,
    };
  },

  /**
   * Add new address
   */
  add: async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    const {
      data: { user },
    } = await (await getSupabase()).auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // If making default, unset others
    if (address.isDefault) {
      await (await getSupabase())
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await (
      await getSupabase()
    )
      .from('addresses')
      .insert([{ ...address, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as Address,
      success: true,
    };
  },

  /**
   * Update address
   */
  update: async (id: string, address: Partial<Address>) => {
    const {
      data: { user },
    } = await (await getSupabase()).auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (address.isDefault) {
      await (await getSupabase())
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await (await getSupabase())
      .from('addresses')
      .update(address)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as Address,
      success: true,
    };
  },

  /**
   * Delete address
   */
  delete: async (id: string) => {
    const { error } = await (await getSupabase()).from('addresses').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
    };
  },
};

/**
 * Utility API endpoints
 */
export const utilsAPI = {
  /**
   * Check if pincode is serviceable
   */
  checkPincode: async (pincode: string) => {
    const { data, error } = await (
      await getSupabase()
    ).functions.invoke('check-pincode', {
      body: { pincode },
    });

    if (error) throw error;

    return {
      data,
      success: true,
    };
  },
};

/**
 * Promo code API endpoints
 */
export const promoAPI = {
  /**
   * Validate promo code via Edge Function
   */
  validate: async (code: string) => {
    const { data, error } = await (
      await getSupabase()
    ).functions.invoke('apply-coupon', {
      body: { code, cartTotal: 0 }, // Just validation, amount might matter for min_order but we can simulate or pass 0 if generic check
    });

    if (error) throw error;

    // transform to expected APIResponse format
    return {
      data: {
        valid: data.valid,
        discount: data.discount || 0,
        message: data.message,
      },
      success: true,
      message: data.message,
    } as APIResponse<{ valid: boolean; discount: number; message?: string }>;
  },

  /**
   * Apply promo code to cart via Edge Function
   */
  apply: async (code: string, cartTotal: number) => {
    const { data, error } = await (
      await getSupabase()
    ).functions.invoke('apply-coupon', {
      body: { code, cartTotal },
    });

    if (error) throw error;

    return {
      data: {
        discount: data.discount || 0,
        finalTotal: cartTotal - (data.discount || 0),
        message: data.message,
      },
      success: data.valid,
      message: data.message,
    } as APIResponse<{ discount: number; finalTotal: number }>;
  },
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
   * Calculate cart connection via Edge Function
   */
  calculate: async (
    items: Array<{ productId: number; variantId: number; quantity: number }>,
    couponCode?: string,
    userLocation?: { pincode: string }
  ) => {
    const { data, error } = await (
      await getSupabase()
    ).functions.invoke('calculate-cart-totals', {
      body: { items, couponCode, userLocation },
    });

    if (error) throw error;

    return {
      data,
      success: true,
      message: 'Cart calculated',
    };
  },

  /**
   * Validate stock via Edge Function
   */
  validateStock: async (
    items: Array<{ productId: number; variantId: number; quantity: number }>
  ) => {
    const { data, error } = await (
      await getSupabase()
    ).functions.invoke('validate-stock', {
      body: { items },
    });

    if (error) throw error;

    return {
      data,
      success: true,
      message: 'Stock validated',
    };
  },

  // ... (keeping other methods if needed, or remove if unused)
  // For now, retaining get/sync/clear but they might be deprecated if we move completely to client-side + edge calculation

  /**
   * Get user's cart (Legacy/Server Sync)
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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Stateful Mocks
let mockReviews = [
  {
    id: 101,
    author: 'Alice M.',
    rating: 5,
    comment: 'Amazing saffron!',
    status: 'approved',
    date: '2024-02-10',
    productName: 'Kashmir Saffron',
  },
  {
    id: 102,
    author: 'Bob D.',
    rating: 4,
    comment: 'Good but pricey.',
    status: 'pending',
    date: '2024-02-12',
    productName: 'Kashmir Saffron',
  },
  {
    id: 103,
    author: 'Charlie',
    rating: 2,
    comment: 'Delivery was late.',
    status: 'rejected',
    date: '2024-01-20',
    productName: 'Cold Pressed Coconut Oil',
  },
  {
    id: 104,
    author: 'Diana',
    rating: 5,
    comment: 'Love the aroma!',
    status: 'pending',
    date: '2024-02-14',
    productName: 'Spicy Turmeric Powder',
  },
];

let mockBlogs = [
  {
    id: 1,
    title: 'Benefits of Turmeric',
    status: 'published',
    type: 'blog',
    author: 'Dr. A. Sharma',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Saffron Recipes',
    status: 'draft',
    type: 'blog',
    author: 'Chef R. Kapoor',
    date: '2024-02-01',
  },
];

let mockRecipes = [
  {
    id: 1,
    title: 'Golden Milk',
    status: 'published',
    type: 'recipe',
    author: 'Tattva Kitchen',
    date: '2023-11-10',
  },
  {
    id: 2,
    title: 'Saffron Rice',
    status: 'published',
    type: 'recipe',
    author: 'Tattva Kitchen',
    date: '2023-12-05',
  },
];

export const reviewAPI = {
  getAll: async () => {
    await delay(500);
    return [...mockReviews];
  },
  updateStatus: async (id: number, status: 'approved' | 'rejected') => {
    await delay(300);
    mockReviews = mockReviews.map((r) => (r.id === id ? { ...r, status } : r));
    return { success: true };
  },
};

export const contentAPI = {
  getBlogs: async () => {
    await delay(400);
    return [...mockBlogs];
  },
  getRecipes: async () => {
    await delay(400);
    return [...mockRecipes];
  },
  delete: async (id: number, type: 'blog' | 'recipe') => {
    await delay(300);
    if (type === 'blog') mockBlogs = mockBlogs.filter((b) => b.id !== id);
    else mockRecipes = mockRecipes.filter((r) => r.id !== id);
    return { success: true };
  },
};
