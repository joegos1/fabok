/**
 * Supabase Client Configuratie
 * ============================
 * Dit bestand bevat de Supabase client configuratie.
 * 
 * Er zijn twee clients:
 * 1. supabase - Publieke client met anon key (voor auth en publieke queries)
 * 2. supabaseAdmin - Admin client met service role key (voor server-side operaties)
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Valideer environment variabelen
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

/**
 * Publieke Supabase client
 * Gebruik deze voor client-side operaties en auth
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Admin Supabase client (alleen server-side!)
 * Heeft volledige toegang, bypass RLS
 * Gebruik alleen in API routes en server-side code
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Maak een Supabase client met de access token van de huidige gebruiker
 * Gebruik dit voor server-side operaties waar RLS moet worden toegepast
 */
export function createSupabaseClient(accessToken?: string) {
  if (!accessToken) {
    return supabase;
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper type exports
export type SupabaseClient = typeof supabase;
