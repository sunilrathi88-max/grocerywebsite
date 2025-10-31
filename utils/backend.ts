import { supabase } from '../supabaseClient';

export async function placeOrder(order: {
  user_id: string;
  items: Array<{ product_id: number; quantity: number }>;
  total: number;
  shipping_address?: string;
}) {
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || 'Order failed');
  return result;
}

export async function initiatePayment(paymentDetails: {
  orderId: string;
  amount: number;
  currency?: string;
}) {
  const response = await fetch('/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentDetails),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || 'Payment failed');
  return result;
}

export async function addToCart(params: { user_id: string; product_id: number; quantity: number }) {
  const { data, error } = await supabase.from('cart').insert([params]);
  if (error) throw error;
  return data;
}

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}
