import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzhdyvdttbeczyavrcvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aGR5dmR0dGJlY3p5YXZyY3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTgyMDEsImV4cCI6MjA3NzM5NDIwMX0.7N_Z-f7wp0MVhdQFaPoqzdmtI77kZtaiU7lQ3uo0u_8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
