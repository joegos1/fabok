/* empty css                                            */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../../../chunks/DashboardLayout_b7uNVWIY.mjs';
import { r as requireAuth } from '../../../chunks/auth_DruAOZHN.mjs';
import { a as supabaseAdmin } from '../../../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$Nieuw = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Nieuw;
  const auth = await requireAuth(Astro2.request);
  if (auth.redirect) {
    return auth.redirect;
  }
  const { profile } = auth;
  if (!profile || profile.role !== "admin") {
    return Astro2.redirect("/dashboard");
  }
  const { data: users } = await supabaseAdmin.from("profiles").select("id, email, full_name, role").in("role", ["admin", "project_editor"]).order("full_name");
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const title = formData.get("title")?.toString() || "";
      const shortDescription = formData.get("short_description")?.toString() || null;
      const fullDescription = formData.get("full_description")?.toString() || null;
      const goals = formData.get("goals")?.toString() || null;
      const targetAudience = formData.get("target_audience")?.toString() || null;
      const contactPerson = formData.get("contact_person")?.toString() || null;
      const tagsString = formData.get("tags")?.toString() || "";
      const ownerId = formData.get("owner_id")?.toString() || profile.id;
      const tags = tagsString.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
      const { error } = await supabaseAdmin.from("projects").insert({
        title,
        short_description: shortDescription,
        full_description: fullDescription,
        goals,
        target_audience: targetAudience,
        contact_person: contactPerson,
        tags,
        owner_id: ownerId,
        status: "active"
      });
      if (error) {
        console.error("Error creating project:", error);
      } else {
        return Astro2.redirect("/dashboard/projecten?message=created");
      }
    } catch (error) {
      console.error("Error processing form:", error);
    }
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Nieuw project", "profile": profile }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl"> <div class="flex items-center mb-6"> <a href="/dashboard/projecten" class="text-firda-gray-500 hover:text-firda-gray-700 mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg> </a> <h1 class="text-2xl font-bold text-firda-gray-900">
Nieuw project aanmaken
</h1> </div> <form method="POST" class="space-y-6"> <!-- Titel --> <div> <label for="title" class="block text-sm font-medium text-firda-gray-700 mb-1">
Titel <span class="text-red-500">*</span> </label> <input type="text" id="title" name="title" required class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Naam van het project"> </div> <!-- Korte beschrijving --> <div> <label for="short_description" class="block text-sm font-medium text-firda-gray-700 mb-1">
Korte beschrijving
</label> <input type="text" id="short_description" name="short_description" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Korte samenvatting van het project"> <p class="mt-1 text-sm text-firda-gray-500">
Deze tekst wordt getoond in het overzicht
</p> </div> <!-- Uitgebreide beschrijving --> <div> <label for="full_description" class="block text-sm font-medium text-firda-gray-700 mb-1">
Uitgebreide beschrijving
</label> <textarea id="full_description" name="full_description" rows="6" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Gedetailleerde beschrijving van het project..."></textarea> </div> <!-- Doelen --> <div> <label for="goals" class="block text-sm font-medium text-firda-gray-700 mb-1">
Doelen
</label> <textarea id="goals" name="goals" rows="4" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Elk doel op een nieuwe regel..."></textarea> <p class="mt-1 text-sm text-firda-gray-500">
Zet elk doel op een nieuwe regel
</p> </div> <!-- Doelgroep --> <div> <label for="target_audience" class="block text-sm font-medium text-firda-gray-700 mb-1">
Doelgroep
</label> <input type="text" id="target_audience" name="target_audience" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Bijv. MBO-studenten, docenten, etc."> </div> <!-- Contactpersoon --> <div> <label for="contact_person" class="block text-sm font-medium text-firda-gray-700 mb-1">
Contactpersoon
</label> <input type="text" id="contact_person" name="contact_person" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Naam van de contactpersoon"> </div> <!-- Tags --> <div> <label for="tags" class="block text-sm font-medium text-firda-gray-700 mb-1">
Tags
</label> <input type="text" id="tags" name="tags" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="vmbo-mbo, doorstroom, innovatie"> <p class="mt-1 text-sm text-firda-gray-500">
Scheid tags met komma's
</p> </div> <!-- Eigenaar --> <div> <label for="owner_id" class="block text-sm font-medium text-firda-gray-700 mb-1">
Projecteigenaar <span class="text-red-500">*</span> </label> <select id="owner_id" name="owner_id" required class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> ${users?.map((user) => renderTemplate`<option${addAttribute(user.id, "value")}${addAttribute(user.id === profile.id, "selected")}> ${user.full_name || user.email} (${user.role})
</option>`)} </select> <p class="mt-1 text-sm text-firda-gray-500">
De eigenaar kan dit project bewerken
</p> </div> <!-- Submit buttons --> <div class="flex items-center gap-4 pt-4 border-t border-firda-gray-200"> <button type="submit" class="px-6 py-2 bg-firda-green-500 text-white font-medium rounded-lg hover:bg-firda-green-600 transition">
Project aanmaken
</button> <a href="/dashboard/projecten" class="px-6 py-2 bg-firda-gray-200 text-firda-gray-700 font-medium rounded-lg hover:bg-firda-gray-300 transition">
Annuleren
</a> </div> </form> </div> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/projecten/nieuw.astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/projecten/nieuw.astro";
const $$url = "/dashboard/projecten/nieuw";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nieuw,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
