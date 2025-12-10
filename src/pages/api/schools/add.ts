/**
 * API: School toevoegen
 * =====================
 * POST endpoint om een nieuwe school toe te voegen
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
    const schoolName = formData.get('schoolName')?.toString()?.trim();

    if (!schoolName) {
      return redirect('/dashboard/landingpage?error=Schoolnaam is verplicht');
    }

    // Haal hoogste display_order op
    const { data: maxOrderData } = await supabaseAdmin
      .from('schools')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    const nextOrder = maxOrderData && maxOrderData.length > 0 
      ? maxOrderData[0].display_order + 1 
      : 0;

    // Voeg school toe
    const { error } = await supabaseAdmin
      .from('schools')
      .insert({
        name: schoolName,
        display_order: nextOrder,
      });

    if (error) {
      console.error('Error adding school:', error);
      return redirect('/dashboard/landingpage?error=Fout bij toevoegen school');
    }

    return redirect('/dashboard/landingpage?message=school-added');
  } catch (error) {
    console.error('Error in add school:', error);
    return redirect('/dashboard/landingpage?error=Onverwachte fout');
  }
};
