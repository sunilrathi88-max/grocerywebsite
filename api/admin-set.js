// api/admin-set.js
import { createClient } from '@supabase/supabase-js';
import { supabase as publicClient } from '../supabaseClient';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminClient = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Verify caller is an admin using their access token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing bearer token' });
    return;
  }

  const accessToken = authHeader.substring('Bearer '.length);
  const { data, error } = await publicClient.auth.getUser(accessToken);
  if (error || !data?.user) {
    res.status(403).json({ error: 'Forbidden: invalid token' });
    return;
  }
  const callerIsAdmin = Boolean(data.user.user_metadata?.is_admin);
  if (!callerIsAdmin) {
    res.status(403).json({ error: 'Forbidden: not an admin' });
    return;
  }

  const { user_id, is_admin } = req.body || {};
  if (!user_id || typeof is_admin !== 'boolean') {
    res.status(400).json({ error: 'Missing user_id or is_admin' });
    return;
  }

  try {
    const { data: updated, error: updateError } = await adminClient.auth.admin.updateUserById(
      user_id,
      { user_metadata: { is_admin } }
    );
    if (updateError) throw updateError;
    res.status(200).json({ message: 'User admin flag updated', user: updated });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update admin flag', details: e.message });
  }
}
