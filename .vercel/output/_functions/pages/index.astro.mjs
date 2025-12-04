/* empty css                                      */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_JNDdhiWt.mjs';
import { $ as $$PdfList } from '../chunks/PdfList_C4Nno7qd.mjs';
import { a as supabaseAdmin } from '../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: landingContent } = await supabaseAdmin.from("landing_page_content").select("*").single();
  const { data: pdfs } = await supabaseAdmin.from("pdf_files").select("*").eq("is_landing_page", true).order("uploaded_at", { ascending: false });
  const content = landingContent || {
    title: "VABOK - Versterken van de Aansluiting in de Beroepskolom",
    intro: "Welkom bij VABOK, het platform voor informatie over onderwijsprojecten.",
    body: "Hier vindt u informatie over lopende projecten, hun doelen en resultaten."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="bg-gradient-to-br from-firda-blue-600 to-firda-blue-800 text-white py-16 lg:py-24"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="max-w-3xl"> <h1 class="text-4xl lg:text-5xl font-bold mb-6"> ${content.title} </h1> <p class="text-xl text-firda-blue-100 mb-8"> ${content.intro} </p> <div class="flex flex-wrap gap-4"> <a href="/projecten" class="inline-flex items-center px-6 py-3 bg-firda-green-500 text-white font-semibold rounded-lg hover:bg-firda-green-600 transition">
Bekijk projecten
<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </a> <a href="#documenten" class="inline-flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition">
Documenten
</a> </div> </div> </div> </section>  <section class="py-12 lg:py-16"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid lg:grid-cols-3 gap-8"> <!-- Hoofdcontent --> <div class="lg:col-span-2"> <div class="bg-white rounded-xl shadow-sm p-8"> <h2 class="text-2xl font-bold text-firda-gray-900 mb-6">
Over VABOK
</h2> <div class="prose prose-lg max-w-none text-firda-gray-700"> ${content.body?.split("\n").map((paragraph) => paragraph.trim() && renderTemplate`<p class="mb-4">${paragraph}</p>`)} </div> <!-- Highlights --> <div class="mt-8 grid sm:grid-cols-3 gap-4"> <div class="p-4 bg-firda-blue-50 rounded-lg"> <div class="text-3xl font-bold text-firda-blue-600 mb-1">V</div> <p class="text-sm text-firda-gray-600">Versterken</p> </div> <div class="p-4 bg-firda-green-50 rounded-lg"> <div class="text-3xl font-bold text-firda-green-600 mb-1">A</div> <p class="text-sm text-firda-gray-600">Aansluiting</p> </div> <div class="p-4 bg-firda-blue-50 rounded-lg"> <div class="text-3xl font-bold text-firda-blue-600 mb-1">BOK</div> <p class="text-sm text-firda-gray-600">Beroepskolom</p> </div> </div> </div> <!-- Snelle links naar projecten --> <div class="mt-8 bg-white rounded-xl shadow-sm p-8"> <h2 class="text-2xl font-bold text-firda-gray-900 mb-6">
Ontdek onze projecten
</h2> <p class="text-firda-gray-600 mb-6">
VABOK omvat diverse projecten die gericht zijn op het verbeteren van de aansluiting 
              tussen verschillende niveaus in het onderwijs. Van vmbo naar mbo, van mbo naar hbo.
</p> <a href="/projecten" class="inline-flex items-center text-firda-blue-600 font-semibold hover:text-firda-blue-700 transition">
Bekijk alle projecten
<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </a> </div> </div> <!-- Sidebar met PDF's --> <aside id="documenten" class="lg:col-span-1"> <div class="sticky top-8"> ${renderComponent($$result2, "PdfList", $$PdfList, { "pdfs": pdfs || [], "title": "Documenten", "maxHeight": "500px" })} </div> </aside> </div> </div> </section>  <section class="py-12 bg-firda-gray-100"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid md:grid-cols-3 gap-6"> <div class="bg-white rounded-xl p-6 shadow-sm"> <div class="w-12 h-12 bg-firda-blue-100 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path> </svg> </div> <h3 class="text-lg font-semibold text-firda-gray-900 mb-2">
Voor docenten
</h3> <p class="text-firda-gray-600 text-sm">
Vind informatie over projecten en materialen voor in de klas.
</p> </div> <div class="bg-white rounded-xl p-6 shadow-sm"> <div class="w-12 h-12 bg-firda-green-100 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-firda-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path> </svg> </div> <h3 class="text-lg font-semibold text-firda-gray-900 mb-2">
Voor projectleiders
</h3> <p class="text-firda-gray-600 text-sm">
Beheer projectinformatie en deel resultaten met belanghebbenden.
</p> </div> <div class="bg-white rounded-xl p-6 shadow-sm"> <div class="w-12 h-12 bg-firda-blue-100 rounded-lg flex items-center justify-center mb-4"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path> </svg> </div> <h3 class="text-lg font-semibold text-firda-gray-900 mb-2">
Voor OCW
</h3> <p class="text-firda-gray-600 text-sm">
Inzicht in projectvoortgang en borging van onderwijsverbetering.
</p> </div> </div> </div> </section> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/index.astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
