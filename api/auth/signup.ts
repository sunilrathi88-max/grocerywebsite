import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Supabase configuration is missing' 
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        }
      }
    });

    if (error) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      user: data.user,
      tokens: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
      },
      message: 'Signup successful',
      verificationEmailSent: !data.session
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred during signup' 
    });
  }
}
