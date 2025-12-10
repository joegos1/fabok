/**
 * Update User Role API
 * ====================
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth } from '../../../lib';
import type { UserRole } from '../../../types/database';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect('/login');
    }

    // Alleen admins mogen rollen wijzigen
    if (auth.profile.role !== 'admin') {
      return redirect('/dashboard?error=Geen rechten');
    }

    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();
    const newRole = formData.get('role')?.toString() as UserRole;

    if (!userId || !newRole) {
      return redirect('/dashboard/gebruikers?error=Ongeldige gegevens');
    }

    // Valideer rol
    const validRoles: UserRole[] = ['admin', 'landingpage_editor', 'project_editor', 'viewer'];
    if (!validRoles.includes(newRole)) {
      return redirect('/dashboard/gebruikers?error=Ongeldige rol');
    }

    // Prevent admin from changing their own role
    if (userId === auth.profile.id) {
      return redirect('/dashboard/gebruikers?error=Je kunt je eigen rol niet wijzigen');
    }

    // Update role
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating role:', error);
      return redirect('/dashboard/gebruikers?error=Update mislukt');
    }

    return redirect('/dashboard/gebruikers?message=updated');
  } catch (error) {
    console.error('Error:', error);
    return redirect('/dashboard/gebruikers?error=Er is een fout opgetreden');
  }
};
