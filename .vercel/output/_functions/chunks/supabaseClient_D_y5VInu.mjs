import { createClient } from '@supabase/supabase-js';

const supabaseUrl = undefined                                   ;
const supabaseAnonKey = undefined                                        ;
{
  throw new Error("Missing Supabase environment variables. Check your .env file.");
}
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export { supabaseAdmin as a, supabase as s };
