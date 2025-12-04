import { a as supabaseAdmin } from '../../chunks/supabaseClient_D_y5VInu.mjs';
import { r as requireAuth, i as isAdmin, b as isLandingPageEditor, d as canEditProject } from '../../chunks/auth_DruAOZHN.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const auth = await requireAuth(request);
    if (auth.redirect) {
      return new Response(JSON.stringify({ error: "Niet geautoriseerd" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!auth.user || !auth.profile) {
      return new Response(JSON.stringify({ error: "Niet geautoriseerd" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formData = await request.formData();
    const file = formData.get("pdfFile");
    const projectId = formData.get("projectId")?.toString();
    const isLandingPage = !projectId;
    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: "Geen bestand geselecteerd" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      return new Response(JSON.stringify({ error: "Alleen PDF bestanden zijn toegestaan" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "Bestand is te groot (max 10MB)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const userRole = auth.profile.role;
    if (isLandingPage) {
      if (!isAdmin(userRole) && !isLandingPageEditor(userRole)) {
        return new Response(JSON.stringify({ error: "Geen rechten om PDF te uploaden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      const canEdit = await canEditProject(auth.user.id, projectId);
      if (!canEdit) {
        return new Response(JSON.stringify({ error: "Geen rechten om PDF te uploaden voor dit project" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const folder = isLandingPage ? "landing-page" : `projects/${projectId}`;
    const filePath = `${folder}/${timestamp}_${sanitizedFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("pdfs").upload(filePath, arrayBuffer, {
      contentType: "application/pdf",
      cacheControl: "3600"
    });
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(JSON.stringify({ error: "Fout bij uploaden van bestand" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: { publicUrl } } = supabaseAdmin.storage.from("pdfs").getPublicUrl(filePath);
    const { error: dbError } = await supabaseAdmin.from("pdf_files").insert({
      project_id: isLandingPage ? null : projectId,
      is_landing_page: isLandingPage,
      url: publicUrl,
      filename: file.name,
      file_size: file.size,
      uploaded_by: auth.user.id
    });
    if (dbError) {
      console.error("Database error:", dbError);
      await supabaseAdmin.storage.from("pdfs").remove([filePath]);
      return new Response(JSON.stringify({ error: "Fout bij opslaan van bestandsreferentie" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      filename: file.name
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Er is een onverwachte fout opgetreden" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
