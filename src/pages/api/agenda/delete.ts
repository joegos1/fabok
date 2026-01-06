import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = await requireAuth(request);
    if (auth.redirect) return auth.redirect;

    const formData = await request.formData();
    const eventId = formData.get('eventId') as string;

    if (!eventId) {
        return new Response('Missing event ID', { status: 400 });
    }

    const { error } = await supabaseAdmin
        .from('project_events')
        .delete()
        .eq('id', eventId);

    if (error) {
        console.error('Error deleting event:', error);
        return redirect('/dashboard/agenda/overzicht?error=' + encodeURIComponent(error.message));
    }

    return redirect('/dashboard/agenda/overzicht?message=deleted');
};
