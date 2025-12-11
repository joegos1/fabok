/**
 * Delete Image API
 * ================
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth, canEditProject, isAdmin } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile || !auth.user) {
      return redirect('/login');
    }

    const formData = await request.formData();
    const imageId = formData.get('imageId')?.toString();
    const redirectTo = formData.get('redirectTo')?.toString() || '/dashboard';

    if (!imageId) {
      return redirect(`${redirectTo}?error=Ongeldige afbeelding`);
    }

    // Haal afbeelding info op
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('project_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return redirect(`${redirectTo}?error=Afbeelding niet gevonden`);
    }

    // Check rechten
    const userRole = auth.profile.role;
    let canDelete = false;

    if (isAdmin(userRole)) {
      canDelete = true;
    } else if (image.project_id) {
      canDelete = await canEditProject(auth.user.id, image.project_id);
    }

    if (!canDelete) {
      return redirect(`${redirectTo}?error=Geen rechten om deze afbeelding te verwijderen`);
    }

    // Verwijder uit storage
    try {
      // Extract path from URL
      const url = new URL(image.url);
      const pathParts = url.pathname.split('/storage/v1/object/public/project-images/');
      if (pathParts.length > 1) {
        const filePath = decodeURIComponent(pathParts[1]);
        await supabaseAdmin.storage.from('project-images').remove([filePath]);
      }
    } catch (storageError) {
      console.error('Error removing from storage:', storageError);
      // Continue anyway, storage file may already be gone
    }

    // Verwijder uit database
    const { error: deleteError } = await supabaseAdmin
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Error deleting image record:', deleteError);
      return redirect(`${redirectTo}?error=Verwijderen mislukt`);
    }

    return redirect(`${redirectTo}?message=image_deleted`);
  } catch (error) {
    console.error('Error:', error);
    return redirect('/dashboard?error=Er is een fout opgetreden');
  }
};
