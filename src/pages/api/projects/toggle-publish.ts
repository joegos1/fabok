/**
 * Toggle Project Publish Status API
 * ==================================
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect('/login');
    }

    // Alleen admins en project_editors mogen publiceren
    if (auth.profile.role !== 'admin' && auth.profile.role !== 'project_editor') {
      return redirect('/dashboard?error=Geen rechten');
    }

    const formData = await request.formData();
    const projectId = formData.get('projectId')?.toString();

    if (!projectId) {
      return redirect('/dashboard/beheer-projecten?error=Ongeldig project');
    }

    // Check rechten (project_editor mag alleen eigen projecten publiceren)
    if (auth.profile.role === 'project_editor') {
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('owner_id')
        .eq('id', projectId)
        .single();

      if (project?.owner_id !== auth.user?.id) {
        return redirect('/dashboard/beheer-projecten?error=Geen rechten');
      }
    }

    // Haal huidige status op
    const { data: currentProject } = await supabaseAdmin
      .from('projects')
      .select('is_published')
      .eq('id', projectId)
      .single();

    if (!currentProject) {
      return redirect('/dashboard/beheer-projecten?error=Project niet gevonden');
    }

    // Toggle publish status
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ 
        is_published: !currentProject.is_published,
        updated_at: new Date().toISOString() 
      })
      .eq('id', projectId);

    if (error) {
      console.error('Error toggling publish status:', error);
      return redirect('/dashboard/beheer-projecten?error=Actie mislukt');
    }

    const message = !currentProject.is_published ? 'published' : 'unpublished';
    return redirect(`/dashboard/beheer-projecten?message=${message}`);
  } catch (error) {
    console.error('Error in toggle-publish:', error);
    return redirect('/dashboard/beheer-projecten?error=Er ging iets mis');
  }
};
