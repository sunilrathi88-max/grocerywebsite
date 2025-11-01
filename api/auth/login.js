const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Supabase configuration is missing' 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ 
        success: false,
        message: error.message 
      });
    }

    // Return success response with tokens
    return res.status(200).json({
      success: true,
      user: data.user,
      tokens: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresIn: data.session?.expires_in,
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred during login' 
    });
  }
};
