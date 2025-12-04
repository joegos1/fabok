/* empty css                                         */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_b7uNVWIY.mjs';
import { r as requireAuth } from '../../chunks/auth_DruAOZHN.mjs';
import { a as supabaseAdmin } from '../../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$MijnProjecten = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MijnProjecten;
  const auth = await requireAuth(Astro2.request);
  if (auth.redirect) {
    return auth.redirect;
  }
  const { profile, user } = auth;
  if (!profile || !user) {
    return Astro2.redirect("/login");
  }
  if (profile.role !== "project_editor" && profile.role !== "admin") {
    return Astro2.redirect("/dashboard");
  }
  const { data: projects, error } = await supabaseAdmin.from("projects").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching projects:", error);
  }
  const url = new URL(Astro2.request.url);
  const message = url.searchParams.get("message");
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Mijn projecten", "profile": profile }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-bold text-firda-gray-900 mb-6">
Mijn projecten
</h1> ${message === "updated" && renderTemplate`<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
Project succesvol bijgewerkt.
</div>`}${!projects || projects.length === 0 ? renderTemplate`<div class="text-center py-16 bg-firda-gray-50 rounded-lg"> <svg class="mx-auto h-16 w-16 text-firda-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="text-lg font-semibold text-firda-gray-900 mb-2">
Geen projecten toegewezen
</h3> <p class="text-firda-gray-600">
Er zijn nog geen projecten aan je toegewezen.<br>
Neem contact op met een administrator.
</p> </div>` : renderTemplate`<div class="grid md:grid-cols-2 gap-6"> ${projects.map((project) => renderTemplate`<div class="bg-firda-gray-50 rounded-lg p-6 hover:shadow-md transition"> <div class="flex items-start justify-between mb-3"> <h3 class="font-semibold text-firda-gray-900"> ${project.title} </h3> <span${addAttribute(`px-2 py-1 text-xs font-medium rounded-full ${project.status === "active" ? "bg-firda-green-100 text-firda-green-700" : "bg-firda-gray-200 text-firda-gray-600"}`, "class")}> ${project.status === "active" ? "Actief" : "Gearchiveerd"} </span> </div> ${project.short_description && renderTemplate`<p class="text-sm text-firda-gray-600 mb-4 line-clamp-2"> ${project.short_description} </p>`} ${project.tags && project.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1 mb-4"> ${project.tags.map((tag) => renderTemplate`<span class="text-xs px-2 py-0.5 bg-firda-blue-100 text-firda-blue-600 rounded-full"> ${tag} </span>`)} </div>`} <div class="flex items-center gap-3"> <a${addAttribute(`/dashboard/projecten/${project.id}`, "href")} class="inline-flex items-center px-4 py-2 bg-firda-blue-600 text-white text-sm font-medium rounded-lg hover:bg-firda-blue-700 transition"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg>
Bewerken
</a> <a${addAttribute(`/projecten/${project.id}`, "href")} target="_blank" class="inline-flex items-center px-4 py-2 text-firda-gray-700 text-sm font-medium hover:text-firda-blue-600 transition"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg>
Bekijken
</a> </div> </div>`)} </div>`}` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/mijn-projecten.astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/mijn-projecten.astro";
const $$url = "/dashboard/mijn-projecten";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$MijnProjecten,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
