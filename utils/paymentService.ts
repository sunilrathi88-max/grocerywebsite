import { supabase } from '../supabaseClient';

// Types for Razorpay
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export const paymentService = {
  /**
   * Load Razorpay Script
   */
  loadScript: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Create Order on Server (via Supabase Edge Function)
   * This calls the server-side Edge Function to create a Razorpay order securely.
   */
  createOrder: async (amount: number): Promise<PaymentOrderResponse> => {
    try {
      // Call Edge Function for secure order creation
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: Math.round(amount * 100) }, // Amount in paise
      });

      if (error) {
        console.error('Order creation error:', error);
        // Fallback to mock for development if Edge Function not deployed
        if (
          error.message?.includes('FunctionsRelayError') ||
          error.message?.includes('not found')
        ) {
          console.warn('⚠️ Edge Function not found. Using MOCK order creation for development.');
          return {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.round(amount * 100),
            currency: 'INR',
          };
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new Error('Failed to create payment order. Please try again.');
    }
  },

  /**
   * Verify Payment Signature (server-side via Edge Function)
   * This calls the server-side Edge Function for secure signature verification.
   */
  verifyPayment: async (
    orderId: string,
    paymentId: string,
    signature: string,
    amount?: number
  ): Promise<boolean> => {
    try {
      // Call Edge Function for secure signature verification
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: {
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          order_id: orderId, // For database logging
          amount: amount || 0,
        },
      });

      if (error) {
        console.error('Payment verification error:', error);
        // Fallback to mock for development if Edge Function not deployed
        if (
          error.message?.includes('FunctionsRelayError') ||
          error.message?.includes('not found')
        ) {
          console.warn('⚠️ Edge Function not found. Using MOCK verification for development.');
          // eslint-disable-next-line no-console
          console.log('Payment Details:', { orderId, paymentId, signature });
          return true;
        }
        throw error;
      }

      return data?.verified === true;
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
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      amount: number;
      status: 'success' | 'failed';
    }
  ) => {
    try {
      const { data, error } = await supabase.from('payment_transactions').insert({
        order_id: orderId,
        payment_id: paymentDetails.razorpay_payment_id,
        payment_order_id: paymentDetails.razorpay_order_id,
        payment_signature: paymentDetails.razorpay_signature,
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        gateway: 'razorpay',
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
    user: { name: string; email: string; phone?: string },
    onSuccess: (response: RazorpayResponse) => void,
    onError: (error: string) => void,
    onDismiss?: () => void
  ) => {
    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await paymentService.loadScript();
      if (!scriptLoaded) {
        onError('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      // 2. Create Order on server
      const orderData = await paymentService.createOrder(amount);

      // 3. Configure Razorpay options
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_KEY_HERE') {
        console.warn('Razorpay Key not configured. Set VITE_RAZORPAY_KEY_ID in .env file.');
      }

      const options: RazorpayOptions = {
        key: razorpayKey || 'rzp_test_demo_key',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TattvaCo - Premium Indian Groceries',
        description: 'Grocery Order Payment',
        image: '/logo.png',
        order_id: orderData.id,
        handler: async (response) => {
          // Payment successful - verify and process
          try {
            const isVerified = await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (isVerified) {
              onSuccess(response);
            } else {
              onError('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onError('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#10B981', // Brand primary green
        },
        modal: {
          ondismiss: () => {
            if (onDismiss) {
              onDismiss();
            }
          },
        },
      };

      // 4. Open Razorpay Checkout
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      onError('Failed to initialize payment. Please try again.');
    }
  },

  /**
   * Initiate Refund (must be called from server in production)
   */
  initiateRefund: async (
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; refund_id?: string }> => {
    // In production, call your backend:
    // const { data } = await supabase.functions.invoke('create-razorpay-refund', {
    //   body: { payment_id: paymentId, amount: Math.round(amount * 100), reason }
    // });
    // return data;

    //DEMO/MOCK implementation
    console.warn('Using MOCK Refund Creation. In production, process refunds server-side.');
    // eslint-disable-next-line no-console
    console.log('Refund request:', { paymentId, amount, reason });

    return {
      success: true,
      refund_id: `rfnd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  },
};
