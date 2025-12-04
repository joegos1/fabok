/* empty css                                      */
import { e as createComponent, f as createAstro, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent, l as renderScript } from '../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_JNDdhiWt.mjs';
import 'clsx';
import { a as supabaseAdmin } from '../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$ProjectCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProjectCard;
  const { project, showStatus = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-firda-gray-200"> <div class="flex items-start justify-between"> <div class="flex-1"> <a${addAttribute(`/projecten/${project.id}`, "href")} class="group"> <h3 class="text-lg font-semibold text-firda-gray-900 group-hover:text-firda-blue-600 transition"> ${project.title} </h3> </a> ${project.short_description && renderTemplate`<p class="mt-2 text-firda-gray-600 line-clamp-2"> ${project.short_description} </p>`} </div> ${showStatus && renderTemplate`<span${addAttribute([
    "ml-4 px-2 py-1 text-xs font-medium rounded-full",
    project.status === "active" ? "bg-firda-green-100 text-firda-green-700" : "bg-firda-gray-100 text-firda-gray-600"
  ], "class:list")}> ${project.status === "active" ? "Actief" : "Gearchiveerd"} </span>`} </div> ${project.tags && project.tags.length > 0 && renderTemplate`<div class="mt-4 flex flex-wrap gap-2"> ${project.tags.map((tag) => renderTemplate`<span class="px-2 py-1 text-xs font-medium rounded-full bg-firda-blue-50 text-firda-blue-600"> ${tag} </span>`)} </div>`} <div class="mt-4 flex items-center justify-between"> ${project.contact_person && renderTemplate`<p class="text-sm text-firda-gray-500"> <span class="font-medium">Contact:</span> ${project.contact_person} </p>`} <a${addAttribute(`/projecten/${project.id}`, "href")} class="inline-flex items-center text-sm font-medium text-firda-blue-600 hover:text-firda-blue-700 transition">
Bekijk details
<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </a> </div> </article>`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/components/ProjectCard.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: projects, error } = await supabaseAdmin.from("projects").select("*").eq("status", "active").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching projects:", error);
  }
  const allTags = projects?.flatMap((p) => p.tags || []) || [];
  const uniqueTags = [...new Set(allTags)].sort();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Projecten" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <!-- Header --> <div class="mb-8"> <h1 class="text-3xl lg:text-4xl font-bold text-firda-gray-900 mb-4">
VABOK Projecten
</h1> <p class="text-lg text-firda-gray-600 max-w-3xl">
Ontdek alle VABOK-projecten die gericht zijn op het versterken van de aansluiting 
        in de beroepskolom. Klik op een project voor meer details.
</p> </div> <!-- Filter op tags (als er tags zijn) --> ${uniqueTags.length > 0 && renderTemplate`<div class="mb-8"> <h2 class="text-sm font-semibold text-firda-gray-700 mb-3">Filter op tags:</h2> <div class="flex flex-wrap gap-2"> <button data-filter="all" class="filter-btn active px-3 py-1 text-sm font-medium rounded-full bg-firda-blue-600 text-white">
Alles
</button> ${uniqueTags.map((tag) => renderTemplate`<button${addAttribute(tag, "data-filter")} class="filter-btn px-3 py-1 text-sm font-medium rounded-full bg-firda-gray-200 text-firda-gray-700 hover:bg-firda-gray-300 transition"> ${tag} </button>`)} </div> </div>`} <!-- Projecten grid --> ${!projects || projects.length === 0 ? renderTemplate`<div class="text-center py-16 bg-white rounded-xl shadow-sm"> <svg class="mx-auto h-16 w-16 text-firda-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="text-lg font-semibold text-firda-gray-900 mb-2">
Nog geen projecten
</h3> <p class="text-firda-gray-600">
Er zijn momenteel geen actieve projecten om weer te geven.
</p> </div>` : renderTemplate`<div id="projects-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> ${projects.map((project) => renderTemplate`<div class="project-item"${addAttribute(JSON.stringify(project.tags || []), "data-tags")}> ${renderComponent($$result2, "ProjectCard", $$ProjectCard, { "project": project })} </div>`)} </div>`} <!-- Geen resultaten na filtering --> <div id="no-results" class="hidden text-center py-16 bg-white rounded-xl shadow-sm"> <svg class="mx-auto h-16 w-16 text-firda-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <h3 class="text-lg font-semibold text-firda-gray-900 mb-2">
Geen projecten gevonden
</h3> <p class="text-firda-gray-600">
Er zijn geen projecten met de geselecteerde tag.
</p> </div> </div> ` })} ${renderScript($$result, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/projecten/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/projecten/index.astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/projecten/index.astro";
const $$url = "/projecten";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
