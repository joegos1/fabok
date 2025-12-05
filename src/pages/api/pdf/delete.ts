/**
 * Delete PDF API
 * ==============
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabaseClient';
import { requireAuth, canEditProject, isLandingPageEditor, isAdmin } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile || !auth.user) {
      return redirect('/login');
    }

    const formData = await request.formData();
    const pdfId = formData.get('pdfId')?.toString();
    const redirectTo = formData.get('redirectTo')?.toString() || '/dashboard';

    if (!pdfId) {
      return redirect(`${redirectTo}?error=Ongeldige PDF`);
    }

    // Haal PDF info op
    const { data: pdf, error: fetchError } = await supabaseAdmin
      .from('pdf_files')
      .select('*')
      .eq('id', pdfId)
      .single();

    if (fetchError || !pdf) {
      return redirect(`${redirectTo}?error=PDF niet gevonden`);
    }

    // Check rechten
    const userRole = auth.profile.role;
    let canDelete = false;

    if (isAdmin(userRole)) {
      canDelete = true;
    } else if (pdf.is_landing_page && isLandingPageEditor(userRole)) {
      canDelete = true;
    } else if (pdf.project_id) {
      canDelete = await canEditProject(auth.user.id, pdf.project_id);
    }

    if (!canDelete) {
      return redirect(`${redirectTo}?error=Geen rechten om deze PDF te verwijderen`);
    }

    // Verwijder uit storage
    try {
      // Extract path from URL
      const url = new URL(pdf.url);
      const pathParts = url.pathname.split('/storage/v1/object/public/pdfs/');
      if (pathParts.length > 1) {
        const filePath = decodeURIComponent(pathParts[1]);
        await supabaseAdmin.storage.from('pdfs').remove([filePath]);
      }
    } catch (storageError) {
      console.error('Error removing from storage:', storageError);
      // Continue anyway, storage file may already be gone
    }

    // Verwijder uit database
    const { error: deleteError } = await supabaseAdmin
      .from('pdf_files')
      .delete()
      .eq('id', pdfId);

    if (deleteError) {
      console.error('Error deleting PDF record:', deleteError);
      return redirect(`${redirectTo}?error=Verwijderen mislukt`);
    }

    return redirect(`${redirectTo}?message=pdf_deleted`);
  } catch (error) {
    console.error('Error:', error);
    return redirect('/dashboard?error=Er is een fout opgetreden');
  }
};
