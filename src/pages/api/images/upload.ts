/**
 * Image Upload API Endpoint
 * =========================
 * Uploadt een project-afbeelding naar Supabase Storage (bucket: images)
 * en koppelt deze aan het project.
 */

import type { APIRoute } from 'astro';
import { requireAuth, canEditProject, supabaseAdmin } from '../../../lib';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.user || !auth.profile) {
      return new Response(JSON.stringify({ error: 'Niet geautoriseerd' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const file = formData.get('imageFile') as File | null;
    const projectId = formData.get('projectId')?.toString();

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Project ontbreekt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'Geen afbeelding geselecteerd' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return new Response(JSON.stringify({ error: 'Alleen JPG, PNG of WebP afbeeldingen zijn toegestaan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return new Response(JSON.stringify({ error: 'Afbeelding is te groot (max 5MB)' }), {
        status: 413, // Te grote payload voor duidelijkere afhandeling aan de client-kant
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const canEdit = await canEditProject(auth.user.id, projectId);
    if (!canEdit) {
      return new Response(JSON.stringify({ error: 'Geen rechten om dit project te bewerken' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verwijder bestaande afbeelding (als aanwezig) om storage netjes te houden
    const { data: existingProject } = await supabaseAdmin
      .from('projects')
      .select('section_image_path')
      .eq('id', projectId)
      .single();

    const existingPath = existingProject?.section_image_path as string | null | undefined;
    if (existingPath) {
      await supabaseAdmin.storage.from('images').remove([existingPath]);
    }

    const timestamp = Date.now();
    const sanitized = sanitizeFilename(file.name || 'image');
    const filePath = `projects/${projectId}/${timestamp}_${sanitized}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Fout bij uploaden van afbeelding' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('images').getPublicUrl(filePath);

    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        section_image_url: publicUrl,
        section_image_path: filePath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Project update error:', updateError);
      // rollback storage object
      await supabaseAdmin.storage.from('images').remove([filePath]);
      return new Response(JSON.stringify({ error: 'Fout bij opslaan van afbeelding' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        path: filePath,
        filename: file.name,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(JSON.stringify({ error: 'Er is een onverwachte fout opgetreden' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
