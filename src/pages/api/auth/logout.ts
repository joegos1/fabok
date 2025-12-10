/**
 * Logout API Endpoint
 * ===================
 * Verwijdert auth cookies en logt gebruiker uit
 */

import type { APIRoute } from 'astro';
import { supabase, clearAuthCookies } from '../../../lib';

export const GET: APIRoute = async ({ redirect }) => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Verwijder cookies en redirect naar login
  const cookies = clearAuthCookies();

  // Use Headers to properly set multiple Set-Cookie headers
  const headers = new Headers();
  headers.set('Location', '/login?message=logged_out');
  cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

  return new Response(null, {
    status: 302,
    headers,
  });
};
