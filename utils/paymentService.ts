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
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
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
     * Create Order on Server (via Supabase Edge Function or direct API if using client-side logic for demo)
     * NOTE: In a real app, this MUST be done on the server to keep secrets safe.
     * For this demo, we will simulate the order creation or use a placeholder.
     */
    createOrder: async (amount: number): Promise<string> => {
        // In a real implementation, call your backend:
        // const { data } = await api.post('/create-razorpay-order', { amount });
        // return data.id;

        // For DEMO/MOCK purposes, we'll generate a mock ID.
        // To make this work for real, the user needs a backend function.
        console.warn('Using MOCK Razorpay Order ID. Implement backend for real payments.');
        return `order_${Date.now()}`;
    },

    /**
     * Initialize Payment Flow
     */
    initializePayment: async (
        amount: number,
        user: { name: string; email: string; phone?: string },
        onSuccess: (response: RazorpayResponse) => void,
        onError: (error: any) => void
    ) => {
        const res = await paymentService.loadScript();

        if (!res) {
            onError('Razorpay SDK failed to load. Are you online?');
            return;
        }

        // 1. Create Order
        const orderId = await paymentService.createOrder(amount);

        // 2. Options
        const options: RazorpayOptions = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE', // User needs to set this
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            name: 'TattvaCo',
            description: 'Grocery Order',
            image: '/logo.png',
            order_id: orderId, // This should come from backend in production
            handler: async (response) => {
                // 3. Verify Payment (Call backend)
                // await api.post('/verify-payment', response);
                onSuccess(response);
            },
            prefill: {
                name: user.name,
                email: user.email,
                contact: user.phone,
            },
            theme: {
                color: '#10B981', // Brand primary
            },
        };

        // 4. Open Razorpay
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    },
};
