import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { event_id, first_name, middle_name, last_name, email } = body;

        if (!event_id || !first_name || !last_name || !email) {
            return new Response(
                JSON.stringify({ error: 'Niet alle verplichte velden zijn ingevuld.' }),
                { status: 400 }
            );
        }

        // Controleer of de email al is aangemeld voor dit event
        const { data: existing } = await supabaseAdmin
            .from('event_registrations')
            .select('id')
            .eq('event_id', event_id)
            .eq('email', email)
            .single();

        if (existing) {
            return new Response(
                JSON.stringify({ error: 'U bent al aangemeld voor dit evenement met dit e-mailadres.' }),
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('event_registrations')
            .insert({
                event_id,
                first_name,
                middle_name: middle_name || null,
                last_name,
                email
            });

        if (error) throw error;

        return new Response(
            JSON.stringify({ message: 'Aanmelding succesvol voltooid.' }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error registering for event:', error);
        return new Response(
            JSON.stringify({ error: 'Er is een fout opgetreden bij de aanmelding.' }),
            { status: 500 }
        );
    }
};
