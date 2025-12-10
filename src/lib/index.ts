/**
 * Lib Barrel Export
 * =================
 * Centrale export van alle utilities
 */

// Auth exports
export * from './auth';

// Database exports
export { supabase, supabaseAdmin, createSupabaseClient } from './database/supabase';
export type { SupabaseClient } from './database/supabase';
