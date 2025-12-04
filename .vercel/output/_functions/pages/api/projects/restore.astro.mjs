import { a as supabaseAdmin } from '../../../chunks/supabaseClient_D_y5VInu.mjs';
import { r as requireAuth } from '../../../chunks/auth_DruAOZHN.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, redirect }) => {
  try {
    const auth = await requireAuth(request);
    if (auth.redirect || !auth.profile) {
      return redirect("/login");
    }
    if (auth.profile.role !== "admin") {
      return redirect("/dashboard?error=Geen rechten");
    }
    const formData = await request.formData();
    const projectId = formData.get("projectId")?.toString();
    if (!projectId) {
      return redirect("/dashboard/projecten?error=Ongeldig project");
    }
    const { error } = await supabaseAdmin.from("projects").update({ status: "active", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", projectId);
    if (error) {
      console.error("Error restoring project:", error);
      return redirect("/dashboard/projecten?error=Herstellen mislukt");
    }
    return redirect("/dashboard/projecten?message=updated");
  } catch (error) {
    console.error("Error:", error);
    return redirect("/dashboard/projecten?error=Er is een fout opgetreden");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
