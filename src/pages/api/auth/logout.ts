/**
 * Logout API Endpoint
 * ===================
 * Verwijdert auth cookies en logt gebruiker uit
 */

import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabaseClient';
import { clearAuthCookies } from '../../../lib/auth';

export const GET: APIRoute = async ({ redirect }) => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Verwijder cookies en redirect naar login
  const cookies = clearAuthCookies();

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/login?message=logged_out',
      'Set-Cookie': cookies.join(', '),
    },
  });
};
