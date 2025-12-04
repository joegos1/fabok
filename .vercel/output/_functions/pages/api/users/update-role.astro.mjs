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
    const userId = formData.get("userId")?.toString();
    const newRole = formData.get("role")?.toString();
    if (!userId || !newRole) {
      return redirect("/dashboard/gebruikers?error=Ongeldige gegevens");
    }
    const validRoles = ["admin", "landingpage_editor", "project_editor", "viewer"];
    if (!validRoles.includes(newRole)) {
      return redirect("/dashboard/gebruikers?error=Ongeldige rol");
    }
    if (userId === auth.profile.id) {
      return redirect("/dashboard/gebruikers?error=Je kunt je eigen rol niet wijzigen");
    }
    const { error } = await supabaseAdmin.from("profiles").update({ role: newRole, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", userId);
    if (error) {
      console.error("Error updating role:", error);
      return redirect("/dashboard/gebruikers?error=Update mislukt");
    }
    return redirect("/dashboard/gebruikers?message=updated");
  } catch (error) {
    console.error("Error:", error);
    return redirect("/dashboard/gebruikers?error=Er is een fout opgetreden");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
