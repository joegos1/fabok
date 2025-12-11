/**
 * Migratie Script: Plain Text naar HTML
 * ======================================
 * Converteer bestaande plain text full_description naar HTML <p> tags
 * 
 * Gebruik:
 * 1. Via API: GET /api/migrate/text-to-html (alleen voor admins)
 * 2. Of rechtstreeks in terminal:
 *    node --loader ts-node/esm scripts/migrate-text-to-html.ts
 */

import type { APIRoute } from 'astro';
import { supabaseAdmin, requireAuth, isAdmin } from '../../../lib';

export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    // Check authenticatie - alleen admin
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect('/login');
    }

    if (!isAdmin(auth.profile.role)) {
      return new Response(JSON.stringify({ error: 'Alleen admins kunnen deze migratie uitvoeren' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Haal alle projecten op
    const { data: projects, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('id, title, full_description')
      .not('full_description', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!projects || projects.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'Geen projecten gevonden om te migreren',
        migrated: 0 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let migratedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const project of projects) {
      try {
        // Skip als al HTML (bevat HTML tags)
        if (project.full_description && /<[^>]+>/.test(project.full_description)) {
          skippedCount++;
          console.log(`Skipped ${project.title} - already contains HTML`);
          continue;
        }

        // Converteer plain text naar HTML
        const htmlContent = convertTextToHtml(project.full_description || '');

        // Update project
        const { error: updateError } = await supabaseAdmin
          .from('projects')
          .update({ 
            full_description: htmlContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', project.id);

        if (updateError) {
          throw updateError;
        }

        migratedCount++;
        console.log(`Migrated: ${project.title}`);

      } catch (error) {
        const errorMsg = `Error migrating ${project.title}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Migratie voltooid',
      total: projects.length,
      migrated: migratedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Migration error:', error);
    return new Response(JSON.stringify({ 
      error: 'Fout tijdens migratie',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * Converteer plain text naar HTML
 * - Split op newlines
 * - Wrap elke paragraaf in <p> tags
 * - Behoud lege regels als scheiding
 */
function convertTextToHtml(text: string): string {
  if (!text || text.trim() === '') {
    return '';
  }

  // Split op dubbele newlines voor paragrafen
  const paragraphs = text.split(/\n\n+/);

  const htmlParagraphs = paragraphs
    .map(para => {
      const trimmed = para.trim();
      if (!trimmed) return '';

      // Replace single newlines binnen paragraaf met spatie
      const cleaned = trimmed.replace(/\n/g, ' ');

      // Escape HTML characters voor veiligheid
      const escaped = escapeHtml(cleaned);

      return `<p>${escaped}</p>`;
    })
    .filter(p => p.length > 0);

  return htmlParagraphs.join('\n');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}
