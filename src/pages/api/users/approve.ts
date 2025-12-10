/**
 * Approve User API
 * ================
 * Keurt een gebruiker goed en kent een rol toe
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth } from '../../../lib';
import type { UserRole } from '../../../types/database';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect('/login');
    }

    // Alleen admins mogen goedkeuren
    if (auth.profile.role !== 'admin') {
      return redirect('/dashboard?error=Geen rechten');
    }

    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();
    const role = formData.get('role')?.toString() as UserRole;

    if (!userId || !role) {
      return redirect('/dashboard/gebruikers?error=Ongeldige gegevens');
    }

    // Update profile
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        account_status: 'approved',
        role: role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error approving user:', error);
      return redirect('/dashboard/gebruikers?error=Fout bij goedkeuren');
    }

    return redirect('/dashboard/gebruikers?message=approved');
  } catch (error) {
    console.error('Error processing request:', error);
    return redirect('/dashboard/gebruikers?error=Serverfout');
  }
};
