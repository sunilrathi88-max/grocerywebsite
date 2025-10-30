// api/order.js
import { supabase } from '../supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const orderData = req.body;
    // Insert order into Supabase table 'orders'
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData]);
    if (error) throw error;
    res.status(200).json({ message: 'Order placed', order: data });
  } catch (err) {
    res.status(500).json({ error: 'Order placement failed', details: err.message });
  }
}
