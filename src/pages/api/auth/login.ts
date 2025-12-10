/**
 * Login API Endpoint
 * ==================
 * Verwerkt login formulier en zet auth cookies
 */

import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin, createAuthCookies } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return redirect('/login?error=invalid_credentials');
    }

    // Probeer in te loggen
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error('Login error:', error);
      return redirect('/login?error=invalid_credentials');
    }

    // Check account status
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('account_status')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      if (profile.account_status === 'pending') {
        await supabase.auth.signOut();
        return redirect('/login?error=account_pending');
      }
      if (profile.account_status === 'rejected') {
        await supabase.auth.signOut();
        return redirect('/login?error=account_rejected');
      }
    }

    // Zet auth cookies
    const cookies = createAuthCookies(
      data.session.access_token,
      data.session.refresh_token
    );

    // Use Headers to properly set multiple Set-Cookie headers
    const headers = new Headers();
    headers.set('Location', '/dashboard');
    cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

    // Use 303 See Other for POST->GET redirect (more appropriate than 302)
    return new Response(null, {
      status: 303,
      headers,
    });
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/login?error=server_error');
  }
};
