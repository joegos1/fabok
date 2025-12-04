/* empty css                                         */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_JNDdhiWt.mjs';
import { $ as $$PdfList } from '../../chunks/PdfList_C4Nno7qd.mjs';
import { a as supabaseAdmin } from '../../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/projecten");
  }
  const { data: project, error: projectError } = await supabaseAdmin.from("projects").select("*").eq("id", id).eq("status", "active").single();
  if (projectError || !project) {
    return Astro2.redirect("/projecten");
  }
  const { data: pdfs } = await supabaseAdmin.from("pdf_files").select("*").eq("project_id", id).order("uploaded_at", { ascending: false });
  const { data: owner } = await supabaseAdmin.from("profiles").select("full_name, email").eq("id", project.owner_id).single();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": project.title }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <!-- Breadcrumb --> <nav class="mb-8"> <ol class="flex items-center space-x-2 text-sm text-firda-gray-500"> <li> <a href="/" class="hover:text-firda-blue-600 transition">Home</a> </li> <li> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg> </li> <li> <a href="/projecten" class="hover:text-firda-blue-600 transition">Projecten</a> </li> <li> <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg> </li> <li class="text-firda-gray-900 font-medium truncate max-w-[200px]"> ${project.title} </li> </ol> </nav> <div class="grid lg:grid-cols-3 gap-8"> <!-- Hoofdcontent --> <div class="lg:col-span-2 space-y-8"> <!-- Header --> <div class="bg-white rounded-xl shadow-sm p-8"> <h1 class="text-3xl font-bold text-firda-gray-900 mb-4"> ${project.title} </h1> ${project.tags && project.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-6"> ${project.tags.map((tag) => renderTemplate`<span class="px-3 py-1 text-sm font-medium rounded-full bg-firda-blue-50 text-firda-blue-600"> ${tag} </span>`)} </div>`} ${project.short_description && renderTemplate`<p class="text-lg text-firda-gray-600 leading-relaxed"> ${project.short_description} </p>`} </div> <!-- Uitgebreide beschrijving --> ${project.full_description && renderTemplate`<div class="bg-white rounded-xl shadow-sm p-8"> <h2 class="text-xl font-bold text-firda-gray-900 mb-4">
Over dit project
</h2> <div class="prose prose-lg max-w-none text-firda-gray-700"> ${project.full_description.split("\n").map((paragraph) => paragraph.trim() && renderTemplate`<p class="mb-4">${paragraph}</p>`)} </div> </div>`} <!-- Doelen --> ${project.goals && renderTemplate`<div class="bg-white rounded-xl shadow-sm p-8"> <h2 class="text-xl font-bold text-firda-gray-900 mb-4 flex items-center"> <svg class="w-6 h-6 mr-2 text-firda-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Doelen
</h2> <div class="prose prose-lg max-w-none text-firda-gray-700"> ${project.goals.split("\n").map((goal) => goal.trim() && renderTemplate`<div class="flex items-start mb-3"> <svg class="w-5 h-5 mr-3 text-firda-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>${goal.trim()}</span> </div>`)} </div> </div>`} <!-- Doelgroep --> ${project.target_audience && renderTemplate`<div class="bg-white rounded-xl shadow-sm p-8"> <h2 class="text-xl font-bold text-firda-gray-900 mb-4 flex items-center"> <svg class="w-6 h-6 mr-2 text-firda-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path> </svg>
Doelgroep
</h2> <p class="text-firda-gray-700"> ${project.target_audience} </p> </div>`} </div> <!-- Sidebar --> <aside class="lg:col-span-1 space-y-6"> <!-- Contactinformatie --> <div class="bg-white rounded-xl shadow-sm p-6"> <h3 class="text-lg font-bold text-firda-gray-900 mb-4">
Contact
</h3> ${project.contact_person && renderTemplate`<div class="flex items-start mb-4"> <svg class="w-5 h-5 mr-3 text-firda-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> <div> <p class="text-sm text-firda-gray-500">Contactpersoon</p> <p class="font-medium text-firda-gray-800">${project.contact_person}</p> </div> </div>`} ${owner && renderTemplate`<div class="flex items-start"> <svg class="w-5 h-5 mr-3 text-firda-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg> <div> <p class="text-sm text-firda-gray-500">Projecteigenaar</p> <p class="font-medium text-firda-gray-800"> ${owner.full_name || owner.email} </p> </div> </div>`} </div> <!-- PDF documenten --> <div class="sticky top-8"> ${renderComponent($$result2, "PdfList", $$PdfList, { "pdfs": pdfs || [], "title": "Projectdocumenten", "maxHeight": "400px" })} </div> </aside> </div> <!-- Terug link --> <div class="mt-8"> <a href="/projecten" class="inline-flex items-center text-firda-blue-600 font-medium hover:text-firda-blue-700 transition"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
Terug naar overzicht
</a> </div> </div> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/projecten/[id].astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/projecten/[id].astro";
const $$url = "/projecten/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
