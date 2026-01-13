/**
 * API: School toevoegen
 * =====================
 * POST endpoint om een nieuwe school toe te voegen
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
    const schoolName = formData.get('schoolName')?.toString()?.trim();
    const address = formData.get('address')?.toString()?.trim();
    const city = formData.get('city')?.toString()?.trim();
    const province = formData.get('province')?.toString()?.trim();

    if (!schoolName) {
      return redirect('/dashboard/landingpage?error=Schoolnaam is verplicht');
    }

    let latitude = null;
    let longitude = null;

    // Automatische Geocoding via Nominatim (OpenStreetMap)
    if (address && city) {
      try {
        const query = `${address}, ${city}, Nederland`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
          {
            headers: {
              'User-Agent': 'FABOK-App-Geocoding/1.0'
            }
          }
        );
        const data = await response.json();

        if (data && data.length > 0) {
          latitude = parseFloat(data[0].lat);
          longitude = parseFloat(data[0].lon);
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError);
        // We gaan door zonder coördinaten als geocoding faalt
      }
    }

    // Haal hoogste display_order op
    const { data: maxOrderData } = await supabaseAdmin
      .from('schools')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1) as { data: any[] | null };

    const nextOrder = maxOrderData && maxOrderData.length > 0
      ? maxOrderData[0].display_order + 1
      : 0;

    // Voeg school toe
    const { error } = await supabaseAdmin
      .from('schools')
      .insert({
        name: schoolName,
        address,
        city,
        province,
        latitude,
        longitude,
        display_order: nextOrder,
      } as any);

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
