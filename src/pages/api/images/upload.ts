/**
 * Image Upload API Endpoint
 * ==========================
 * Verwerkt afbeelding uploads naar Supabase Storage
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
    const file = formData.get('imageFile') as File;
    const projectId = formData.get('projectId')?.toString();

    // Valideer project ID
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Project ID ontbreekt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer dat er een bestand is
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'Geen bestand geselecteerd' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandstype
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(file.type) || !validExtensions.includes(extension)) {
      return new Response(JSON.stringify({ error: 'Alleen JPG, PNG en WebP bestanden zijn toegestaan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandsgrootte (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'Bestand is te groot (max 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check rechten: admin of eigenaar van project
    const canEdit = await canEditProject(auth.user.id, projectId);
    if (!canEdit) {
      return new Response(JSON.stringify({ error: 'Geen rechten om afbeeldingen te uploaden voor dit project' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Genereer unieke bestandsnaam
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `projects/${projectId}/images/${timestamp}_${sanitizedFilename}`;

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
      return new Response(JSON.stringify({ error: 'Fout bij uploaden van bestand' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Haal public URL op
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(filePath);

    // Sla referentie op in database
    const { error: dbError } = await supabaseAdmin
      .from('project_images')
      .insert({
        project_id: projectId,
        url: publicUrl,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: auth.user.id,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Probeer geüpload bestand te verwijderen bij database fout
      await supabaseAdmin.storage.from('project-images').remove([filePath]);
      return new Response(JSON.stringify({ error: 'Fout bij opslaan van bestandsreferentie' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
