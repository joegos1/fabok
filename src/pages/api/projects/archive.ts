/**
 * Archive Project API
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

    // Alleen admins mogen archiveren
    if (auth.profile.role !== 'admin') {
      return redirect('/dashboard?error=Geen rechten');
    }

    const formData = await request.formData();
    const projectId = formData.get('projectId')?.toString();

    if (!projectId) {
      return redirect('/dashboard/projecten?error=Ongeldig project');
    }

    // Archive project
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ status: 'gearchiveerd', updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      console.error('Error archiving project:', error);
      return redirect('/dashboard/projecten?error=Archiveren mislukt');
    }

    return redirect('/dashboard/projecten?message=archived');
  } catch (error) {
    console.error('Error:', error);
    return redirect('/dashboard/projecten?error=Er is een fout opgetreden');
  }
};
