import { createClient } from '@supabase/supabase-js';
import { getEnv } from './utils/env';

export const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
export const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
    persistSession: true,
  },
});
