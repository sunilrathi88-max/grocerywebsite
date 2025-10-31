// api/admin.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client for auth token verification
const publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Admin client for privileged data operations
const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Allowlist of admin emails (optional, in addition to user_metadata.is_admin)
const ADMIN_EMAILS = ['sunilrathi88@gmail.com', 'admin@tattvaco.in'];

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing bearer token' });
    return;
  }

  const token = authHeader.substring('Bearer '.length);
  const { data, error } = await publicClient.auth.getUser(token);
  if (error || !data?.user) {
    res.status(403).json({ error: 'Invalid user token' });
    return;
  }

  const user = data.user;
  const isAdmin = Boolean(user.user_metadata?.is_admin) || ADMIN_EMAILS.includes(user.email ?? '');
  if (!isAdmin) {
    res.status(403).json({ error: 'Access denied. Admin only.' });
    return;
  }

  if (req.method === 'GET') {
    // Fetch all orders
    const { data: orders, error: ordersError } = await adminClient.from('orders').select('*');
    if (ordersError) return res.status(500).json({ error: ordersError.message });
    return res.status(200).json({ data: orders });
  }

  if (req.method === 'POST') {
    // Update order status
    const { orderId, status } = req.body || {};
    if (!orderId || !status) return res.status(400).json({ error: 'Missing orderId or status' });
    const { error: updateError } = await adminClient
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (updateError) return res.status(500).json({ error: updateError.message });
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
