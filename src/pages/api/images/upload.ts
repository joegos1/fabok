/**
 * Image Upload API Endpoint
 * ==========================
 * Verwerkt image uploads naar Supabase Storage
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth, isAdmin, canEditProject } from '../../../lib';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!auth.user || !auth.profile) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('imageFile') as File;
    const projectId = formData.get('projectId')?.toString();

    // Valideer dat er een bestand is
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'Geen bestand geselecteerd' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandstype
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const hasValidType = validImageTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidType || !hasValidExtension) {
      return new Response(JSON.stringify({ error: 'Alleen JPG, PNG, WebP of GIF afbeeldingen zijn toegestaan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandsgrootte (max 5MB voor images)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'Bestand is te groot (max 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check rechten - alleen voor projecten (niet voor landing page bij images)
    if (projectId) {
      const canEdit = await canEditProject(auth.user.id, projectId);
      if (!canEdit) {
        return new Response(JSON.stringify({ error: 'Geen rechten om afbeelding te uploaden voor dit project' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Genereer unieke bestandsnaam
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = projectId ? `projects/${projectId}` : 'general';
    const filePath = `${folder}/${timestamp}_${sanitizedFilename}`;

    // Upload naar Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Fout bij uploaden van bestand' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Haal public URL op
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ 
      success: true, 
      url: publicUrl,
      filename: file.name 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Er is een onverwachte fout opgetreden' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
