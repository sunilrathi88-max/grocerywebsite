const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Supabase configuration is missing' });
    const supabase = createClient(supabaseUrl, supabaseKey);
    if (req.method === 'GET') {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${process.env.SITE_URL || 'https://www.tattvaco.in'}/#/` } });
      if (error) return res.status(400).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, url: data.url });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Google login error' });
  }
};
