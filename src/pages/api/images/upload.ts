/**
 * Image Upload API Endpoint
 * ==========================
 * Verwerkt afbeelding uploads voor Tiptap editor naar Supabase Storage
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth, canEditProject } from '../../../lib';

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
    const file = formData.get('image') as File;
    const projectId = formData.get('projectId')?.toString();

    // Valideer dat er een bestand is
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'Geen bestand geselecteerd' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer project ID
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Project ID ontbreekt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandstype (alleen afbeeldingen)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Alleen JPEG, PNG, GIF en WebP afbeeldingen zijn toegestaan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandsgrootte (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'Afbeelding is te groot (max 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check rechten - gebruiker moet project kunnen bewerken
    const canEdit = await canEditProject(auth.user.id, projectId);
    if (!canEdit) {
      return new Response(JSON.stringify({ error: 'Geen rechten om afbeeldingen te uploaden voor dit project' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Genereer unieke bestandsnaam
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9-]/g, '_'); // Sanitize
    const fileName = `${timestamp}_${sanitizedName}.${fileExt}`;
    const filePath = `projects/${projectId}/${fileName}`;

    // Upload naar Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('project-images')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Fout bij uploaden van afbeelding' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Haal public URL op
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ 
      url: publicUrl
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
