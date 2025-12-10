/**
 * Reject User API
 * ===============
 * Wijst een gebruiker af
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect('/login');
    }

    // Alleen admins mogen afwijzen
    if (auth.profile.role !== 'admin') {
      return redirect('/dashboard?error=Geen rechten');
    }

    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();

    if (!userId) {
      return redirect('/dashboard/gebruikers?error=Ongeldige gegevens');
    }

    // Update profile
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        account_status: 'rejected',
        role: null, // Zorg dat rol leeg is
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error rejecting user:', error);
      return redirect('/dashboard/gebruikers?error=Fout bij afwijzen');
    }

    return redirect('/dashboard/gebruikers?message=rejected');
  } catch (error) {
    console.error('Error processing request:', error);
    return redirect('/dashboard/gebruikers?error=Serverfout');
  }
};
