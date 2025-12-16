/**
 * Image Delete API Endpoint
 * =========================
 * Verwijdert de gekoppelde project-afbeelding uit Supabase Storage (bucket: images)
 * en maakt de projectvelden leeg.
 */

import type { APIRoute } from 'astro';
import { requireAuth, canEditProject, supabaseAdmin } from '../../../lib';

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
    const projectId = formData.get('projectId')?.toString();

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Project ontbreekt' }), {
        status: 400,
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

    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('section_image_path')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      console.error('Error fetching project image path:', fetchError);
      return new Response(JSON.stringify({ error: 'Kon project niet ophalen' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const path = (project?.section_image_path as string | null) || null;
    if (path) {
      const { error: removeError } = await supabaseAdmin.storage.from('images').remove([path]);
      if (removeError) {
        console.error('Error removing image from storage:', removeError);
        return new Response(JSON.stringify({ error: 'Verwijderen uit opslag mislukt' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('projects')
      .update({
        section_image_url: null,
        section_image_path: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error clearing project image:', updateError);
      return new Response(JSON.stringify({ error: 'Kon project niet bijwerken' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Image delete error:', error);
    return new Response(JSON.stringify({ error: 'Er is een onverwachte fout opgetreden' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
