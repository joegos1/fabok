import { a as supabaseAdmin } from '../../chunks/supabaseClient_D_y5VInu.mjs';
import { r as requireAuth, i as isAdmin, b as isLandingPageEditor, d as canEditProject } from '../../chunks/auth_DruAOZHN.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request, redirect }) => {
  try {
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile || !auth.user) {
      return redirect("/login");
    }
    const formData = await request.formData();
    const pdfId = formData.get("pdfId")?.toString();
    const redirectTo = formData.get("redirectTo")?.toString() || "/dashboard";
    if (!pdfId) {
      return redirect(`${redirectTo}?error=Ongeldige PDF`);
    }
    const { data: pdf, error: fetchError } = await supabaseAdmin.from("pdf_files").select("*").eq("id", pdfId).single();
    if (fetchError || !pdf) {
      return redirect(`${redirectTo}?error=PDF niet gevonden`);
    }
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
    try {
      const url = new URL(pdf.url);
      const pathParts = url.pathname.split("/storage/v1/object/public/pdfs/");
      if (pathParts.length > 1) {
        const filePath = decodeURIComponent(pathParts[1]);
        await supabaseAdmin.storage.from("pdfs").remove([filePath]);
      }
    } catch (storageError) {
      console.error("Error removing from storage:", storageError);
    }
    const { error: deleteError } = await supabaseAdmin.from("pdf_files").delete().eq("id", pdfId);
    if (deleteError) {
      console.error("Error deleting PDF record:", deleteError);
      return redirect(`${redirectTo}?error=Verwijderen mislukt`);
    }
    return redirect(`${redirectTo}?message=pdf_deleted`);
  } catch (error) {
    console.error("Error:", error);
    return redirect("/dashboard?error=Er is een fout opgetreden");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
