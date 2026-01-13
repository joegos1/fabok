/**
 * API: School bijwerken
 * =====================
 * POST endpoint om een bestaande school te bewerken
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
        const schoolName = formData.get('schoolName')?.toString()?.trim();
        const address = formData.get('address')?.toString()?.trim();
        const city = formData.get('city')?.toString()?.trim();
        const province = formData.get('province')?.toString()?.trim();

        if (!schoolId || !schoolName) {
            return redirect('/dashboard/landingpage?error=Naam en ID zijn verplicht');
        }

        let latitude = null;
        let longitude = null;
        let geocodingSuccess = false;

        // Automatische Geocoding via Nominatim (indien adres/stad aanwezig)
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
                    geocodingSuccess = true;
                }
            } catch (geoError) {
                console.error('Geocoding error:', geoError);
            }
        }

        // Update object voorbereiden
        const updateData: any = {
            name: schoolName,
            address,
            city,
            province
        };

        // Alleen coördinaten updaten als geocoding is gelukt
        // Zo behouden we oude coördinaten als geocoding even faalt maar adres niet echt veranderd is
        if (geocodingSuccess) {
            updateData.latitude = latitude;
            updateData.longitude = longitude;
        }

        // Voer update uit
        const { error } = await supabaseAdmin
            .from('schools')
            .update(updateData as any)
            .eq('id', schoolId);

        if (error) {
            console.error('Error updating school:', error);
            return redirect('/dashboard/landingpage?error=Fout bij bijwerken school');
        }

        return redirect('/dashboard/landingpage?message=school-updated');
    } catch (error) {
        console.error('Error in update school:', error);
        return redirect('/dashboard/landingpage?error=Onverwachte fout');
    }
};
