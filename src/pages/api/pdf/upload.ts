/**
 * PDF Upload API Endpoint
 * =======================
 * Verwerkt PDF uploads naar Supabase Storage
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabaseClient';
import { requireAuth, getUserProfile, isAdmin, isLandingPageEditor, canEditProject } from '../../../lib/auth';

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
    const file = formData.get('pdfFile') as File;
    const projectId = formData.get('projectId')?.toString();
    const isLandingPage = !projectId;

    // Valideer dat er een bestand is
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'Geen bestand geselecteerd' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandstype
    if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
      return new Response(JSON.stringify({ error: 'Alleen PDF bestanden zijn toegestaan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Valideer bestandsgrootte (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'Bestand is te groot (max 10MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check rechten
    const userRole = auth.profile.role;
    
    if (isLandingPage) {
      // Landing page upload: alleen admin of landingpage_editor
      if (!isAdmin(userRole) && !isLandingPageEditor(userRole)) {
        return new Response(JSON.stringify({ error: 'Geen rechten om PDF te uploaden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Project upload: admin of eigenaar van project
      const canEdit = await canEditProject(auth.user.id, projectId);
      if (!canEdit) {
        return new Response(JSON.stringify({ error: 'Geen rechten om PDF te uploaden voor dit project' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Genereer unieke bestandsnaam
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = isLandingPage ? 'landing-page' : `projects/${projectId}`;
    const filePath = `${folder}/${timestamp}_${sanitizedFilename}`;

    // Upload naar Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('pdfs')
      .upload(filePath, arrayBuffer, {
        contentType: 'application/pdf',
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
      .from('pdfs')
      .getPublicUrl(filePath);

    // Sla referentie op in database
    const { error: dbError } = await supabaseAdmin
      .from('pdf_files')
      .insert({
        project_id: isLandingPage ? null : projectId,
        is_landing_page: isLandingPage,
        url: publicUrl,
        filename: file.name,
        file_size: file.size,
        uploaded_by: auth.user.id,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Probeer geüpload bestand te verwijderen bij database fout
      await supabaseAdmin.storage.from('pdfs').remove([filePath]);
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
