import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth, isAdmin, isProjectEditor } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = await requireAuth(request);
    if (auth.redirect) return auth.redirect;

    const { profile } = auth;
    if (!profile) return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();
    const registrationId = formData.get('registrationId') as string;
    const eventId = formData.get('eventId') as string;

    if (!registrationId || !eventId) {
        return new Response('Missing registration ID or event ID', { status: 400 });
    }

    // Check permissies voor dit event
    const { data: event } = await supabaseAdmin
        .from('project_events')
        .select('*, projects(owner_id)')
        .eq('id', eventId)
        .single();

    if (!event) return new Response('Event not found', { status: 404 });

    const isOwner = (event as any).projects?.owner_id === profile.id;
    const canDelete = isAdmin(profile.role) || profile.role === 'landingpage_editor' || (isProjectEditor(profile.role) && isOwner);

    if (!canDelete) {
        return new Response('Forbidden', { status: 403 });
    }

    const { error } = await supabaseAdmin
        .from('event_registrations')
        .delete()
        .eq('id', registrationId);

    if (error) {
        console.error('Error deleting registration:', error);
        return new Response(error.message, { status: 500 });
    }

    // Redirect terug naar de detail pagina
    return redirect(`/dashboard/inschrijvingen/${eventId}?message=registration_deleted`);
};
