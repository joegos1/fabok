/**
 * API: School verwijderen
 * =======================
 * POST endpoint om een school te verwijderen
 */

import type { APIRoute } from 'astro';
import { requireAuth, isLandingPageEditor } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export const POST: APIRoute = async ({ request, redirect }) => {
  // Check authenticatie
  const auth = await requireAuth(request);
  if (auth.redirect) {
    return auth.redirect;
  }

  const { profile } = auth;
  if (!profile || !isLandingPageEditor(profile.role)) {
    return new Response('Unauthorized', { status: 403 });
  }

  try {
    const formData = await request.formData();
    const schoolId = formData.get('schoolId')?.toString();

    if (!schoolId) {
      return redirect('/dashboard/landingpage?error=School ID ontbreekt');
    }

    // Verwijder school
    const { error } = await supabaseAdmin
      .from('schools')
      .delete()
      .eq('id', schoolId);

    if (error) {
      console.error('Error deleting school:', error);
      return redirect('/dashboard/landingpage?error=Fout bij verwijderen school');
    }

    return redirect('/dashboard/landingpage?message=school-deleted');
  } catch (error) {
    console.error('Error in delete school:', error);
    return redirect('/dashboard/landingpage?error=Onverwachte fout');
  }
};
