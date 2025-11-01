const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Supabase configuration is missing' });
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name: name || '' } } });
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, user: data.user, message: 'Signup successful' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occurred during signup' });
  }
};
