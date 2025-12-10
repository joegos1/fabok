/**
 * API: School volgorde wijzigen
 * ==============================
 * POST endpoint om de volgorde van scholen te wijzigen
 */

import type { APIRoute } from 'astro';
import { requireAuth, isLandingPageEditor, supabaseAdmin } from '../../../lib';

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
    const direction = formData.get('direction')?.toString(); // 'up' or 'down'

    if (!schoolId || !direction) {
      return redirect('/dashboard/landingpage?error=Ongeldige parameters');
    }

    // Haal huidige school op
    const { data: currentSchool } = await supabaseAdmin
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (!currentSchool) {
      return redirect('/dashboard/landingpage?error=School niet gevonden');
    }

    // Haal alle scholen op
    const { data: allSchools } = await supabaseAdmin
      .from('schools')
      .select('*')
      .order('display_order', { ascending: true });

    if (!allSchools || allSchools.length < 2) {
      return redirect('/dashboard/landingpage');
    }

    const currentIndex = allSchools.findIndex(s => s.id === schoolId);
    
    if (currentIndex === -1) {
      return redirect('/dashboard/landingpage?error=School niet gevonden');
    }

    let swapIndex = -1;
    if (direction === 'up' && currentIndex > 0) {
      swapIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < allSchools.length - 1) {
      swapIndex = currentIndex + 1;
    }

    if (swapIndex === -1) {
      return redirect('/dashboard/landingpage');
    }

    const swapSchool = allSchools[swapIndex];

    // Wissel display_order om
    const tempOrder = currentSchool.display_order;
    
    await supabaseAdmin
      .from('schools')
      .update({ display_order: swapSchool.display_order })
      .eq('id', currentSchool.id);

    await supabaseAdmin
      .from('schools')
      .update({ display_order: tempOrder })
      .eq('id', swapSchool.id);

    return redirect('/dashboard/landingpage?message=school-reordered');
  } catch (error) {
    console.error('Error in reorder school:', error);
    return redirect('/dashboard/landingpage?error=Onverwachte fout');
  }
};
