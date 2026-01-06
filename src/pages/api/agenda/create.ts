import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth } from '../../../lib';

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = await requireAuth(request);
    if (auth.redirect) return auth.redirect;

    const formData = await request.formData();
    const project_id = formData.get('project_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;

    if (!project_id || !title || !date || !time) {
        return new Response('Missing required fields', { status: 400 });
    }

    // Combineer datum en tijd
    const start_date = new Date(`${date}T${time}`).toISOString();

    const { error } = await supabaseAdmin
        .from('project_events')
        .insert({
            project_id,
            title,
            description,
            start_date,
            location
        } as any);

    if (error) {
        console.error('Error creating event:', error);
        return redirect('/dashboard/agenda/nieuw?error=' + encodeURIComponent(error.message));
    }

    return redirect('/dashboard/agenda/overzicht?message=created');
};
