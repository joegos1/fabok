/**
 * Restore Project API
 * ===================
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabaseClient';
import { requireAuth } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect('/login');
    }

    // Alleen admins mogen herstellen
    if (auth.profile.role !== 'admin') {
      return redirect('/dashboard?error=Geen rechten');
    }

    const formData = await request.formData();
    const projectId = formData.get('projectId')?.toString();

    if (!projectId) {
      return redirect('/dashboard/beheer-projecten?error=Ongeldig project');
    }

    // Restore project
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      console.error('Error restoring project:', error);
      return redirect('/dashboard/beheer-projecten?error=Herstellen mislukt');
    }

    return redirect('/dashboard/beheer-projecten?message=updated');
  } catch (error) {
    console.error('Error:', error);
    return redirect('/dashboard/projecten?error=Er is een fout opgetreden');
  }
};
