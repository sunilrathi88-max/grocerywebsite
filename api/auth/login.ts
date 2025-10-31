import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
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

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred during login' 
    });
  }
}
