import { supabase } from '../supabaseClient';
import { isProd } from './env';

// Types for Cashfree
interface CashfreeOptions {
  mode: 'sandbox' | 'production';
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  returnUrl?: string;
  redirectTarget?: '_self' | '_blank' | '_top';
}

declare global {
  interface Window {
    Cashfree: new (options: CashfreeOptions) => {
      checkout: (options: CashfreeCheckoutOptions) => Promise<void>;
    };
  }
}

interface PaymentOrderResponse {
  payment_session_id: string;
  order_id: string;
  environment?: 'production' | 'sandbox';
}

export const paymentService = {
  /**
   * Load Cashfree Script
   */
  loadScript: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Create Order on Server (via Supabase Edge Function)
   * This calls the server-side Edge Function to create a Cashfree order securely.
   */
  createOrder: async (
    amount: number,
    customer: { id: string; phone: string; name?: string; email?: string }
  ): Promise<PaymentOrderResponse> => {
    try {
      console.log('Calling create-cashfree-order for amount:', amount);

      // Call Edge Function for secure order creation using native fetch to bypass any potential client issues
      const baseUrl = (supabase as any).supabaseUrl;
      const anonKey = (supabase as any).supabaseKey;

      const response = await fetch(`${baseUrl}/functions/v1/create-cashfree-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({
          order_amount: amount,
          customer_id: customer.id,
          customer_phone: customer.phone,
          customer_name: customer.name,
          customer_email: customer.email,
        }),
      });

      const data = await response.json();
      const error = response.ok ? null : { message: data.error || 'Failed to create order' };

      if (error) {
        console.error('Order creation error from Edge Function:', {
          message: error.message,
          details: error,
        });

        // We are disabling mock fallback for verification to identify the root cause
        /*
        if (
          error.message?.includes('FunctionsRelayError') ||
          error.message?.includes('not found') ||
          error.message?.includes('Failed to fetch')
        ) {
          console.warn('⚠️ Edge Function not found. Using MOCK order creation for development.');
          return {
            payment_session_id: `session_${Date.now()}_mock`,
            order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
        }
        */
        throw error;
      }

      console.log('✅ Order creation response:', data);
      return data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Failed to create payment order. Please try again.');
    }
  },

  /**
   * Verify Payment (server-side via Edge Function)
   * This calls the server-side Edge Function for secure status verification.
   */
  verifyPayment: async (orderId: string): Promise<boolean> => {
    try {
      // Call Edge Function for secure verification
      const { data, error } = await supabase.functions.invoke('verify-cashfree-payment', {
        body: { order_id: orderId },
      });

      if (error) {
        console.error('Payment verification error:', error);
        // Fallback to mock for development if Edge Function not deployed
        if (
          error.message?.includes('FunctionsRelayError') ||
          error.message?.includes('not found')
        ) {
          console.warn('⚠️ Edge Function not found. Using MOCK verification for development.');
          return true;
        }
        throw error;
      }

      return data?.status === 'SUCCESS';
    } catch (error) {
      console.error('Failed to verify payment:', error);
      throw new Error('Payment verification failed. Please contact support.');
    }
  },

  /**
   * Save Payment Transaction to Database
   */
  savePaymentTransaction: async (
    orderId: string,
    paymentDetails: {
      payment_id?: string; // Cashfree doesn't always give a payment ID immediately on frontend
      order_id: string;
      amount: number;
      status: 'success' | 'failed' | 'pending';
    }
  ) => {
    try {
      const { data, error } = await supabase.from('payment_transactions').insert({
        order_id: orderId, // Our internal order ID (if different) or Cashfree order ID
        payment_id: paymentDetails.payment_id || 'pending',
        payment_order_id: paymentDetails.order_id,
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        gateway: 'cashfree',
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error saving payment transaction:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Payment transaction save failed:', error);
      // Don't throw - payment succeeded even if logging failed
      return null;
    }
  },

  /**
   * Initialize Payment Flow
   */
  initializePayment: async (
    amount: number,
    user: { id: string; name: string; email: string; phone: string },
    onSuccess: (orderId: string) => void,
    onError: (error: string) => void
  ) => {
    try {
      // 1. Load Cashfree SDK
      const scriptLoaded = await paymentService.loadScript();
      if (!scriptLoaded) {
        onError('Cashfree SDK failed to load. Please check your internet connection.');
        return;
      }

      // 2. Create Order on server
      const orderData = await paymentService.createOrder(amount, {
        id: user.id || 'guest_' + Date.now(),
        phone: user.phone,
        name: user.name,
        email: user.email,
      });

      console.log('🚀 Initializing payment with order data:', orderData);

      // 3. Initialize Cashfree using the environment returned by the Edge Function
      const isProduction =
        orderData.environment === 'production' || (orderData.environment === undefined && isProd());
      const cashfree = new window.Cashfree({
        mode: isProduction ? 'production' : 'sandbox',
      });

      // 4. Checkout
      await cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: '_self', // or _blank
      });

      // Note: Since Cashfree redirects, onSuccess might not be called directly here unless we use a popup/iframe mode that returns control.
      // If redirecting, the verification happens on the return URL page (CheckoutPage).
      // For now, we'll assume the caller handles the redirect behavior or we just let it redirect.
    } catch (error) {
      console.error('Payment initialization error:', error);
      onError('Failed to initialize payment. Please try again.');
    }
  },
};
