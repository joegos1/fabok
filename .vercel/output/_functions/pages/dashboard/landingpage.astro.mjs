/* empty css                                         */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_b7uNVWIY.mjs';
import { $ as $$PdfList } from '../../chunks/PdfList_C4Nno7qd.mjs';
import { $ as $$PdfUpload } from '../../chunks/PdfUpload__OwjtNzD.mjs';
import { r as requireAuth, b as isLandingPageEditor } from '../../chunks/auth_DruAOZHN.mjs';
import { a as supabaseAdmin } from '../../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Landingpage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Landingpage;
  const auth = await requireAuth(Astro2.request);
  if (auth.redirect) {
    return auth.redirect;
  }
  const { profile } = auth;
  if (!profile) {
    return Astro2.redirect("/login");
  }
  if (!isLandingPageEditor(profile.role)) {
    return Astro2.redirect("/dashboard");
  }
  const { data: content } = await supabaseAdmin.from("landing_page_content").select("*").single();
  const { data: pdfs } = await supabaseAdmin.from("pdf_files").select("*").eq("is_landing_page", true).order("uploaded_at", { ascending: false });
  const url = new URL(Astro2.request.url);
  const message = url.searchParams.get("message");
  const errorMsg = url.searchParams.get("error");
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const title = formData.get("title")?.toString() || "VABOK";
      const intro = formData.get("intro")?.toString() || null;
      const body = formData.get("body")?.toString() || null;
      if (content) {
        const { error } = await supabaseAdmin.from("landing_page_content").update({
          title,
          intro,
          body,
          updated_by: profile.id,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", content.id);
        if (error) {
          console.error("Error updating content:", error);
          return Astro2.redirect("/dashboard/landingpage?error=Update mislukt");
        }
      } else {
        const { error } = await supabaseAdmin.from("landing_page_content").insert({
          title,
          intro,
          body,
          updated_by: profile.id
        });
        if (error) {
          console.error("Error creating content:", error);
          return Astro2.redirect("/dashboard/landingpage?error=Aanmaken mislukt");
        }
      }
      return Astro2.redirect("/dashboard/landingpage?message=saved");
    } catch (error) {
      console.error("Error processing form:", error);
    }
  }
  const currentContent = content || {
    title: "VABOK - Versterken van de Aansluiting in de Beroepskolom",
    intro: "",
    body: ""
  };
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Landingspagina beheren", "profile": profile }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid lg:grid-cols-3 gap-8"> <!-- Formulier --> <div class="lg:col-span-2"> <h1 class="text-2xl font-bold text-firda-gray-900 mb-6">
Landingspagina beheren
</h1> ${message === "saved" && renderTemplate`<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
Wijzigingen succesvol opgeslagen.
</div>`} ${errorMsg && renderTemplate`<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"> ${errorMsg} </div>`} <form method="POST" class="space-y-6"> <!-- Titel --> <div> <label for="title" class="block text-sm font-medium text-firda-gray-700 mb-1">
Titel <span class="text-red-500">*</span> </label> <input type="text" id="title" name="title" required${addAttribute(currentContent.title, "value")} class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Paginatitel"> </div> <!-- Intro --> <div> <label for="intro" class="block text-sm font-medium text-firda-gray-700 mb-1">
Introductie
</label> <textarea id="intro" name="intro" rows="3" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="Korte introductietekst die onder de titel komt...">${currentContent.intro || ""}</textarea> <p class="mt-1 text-sm text-firda-gray-500">
Deze tekst wordt getoond in het hero-gedeelte
</p> </div> <!-- Body --> <div> <label for="body" class="block text-sm font-medium text-firda-gray-700 mb-1">
Hoofdtekst
</label> <textarea id="body" name="body" rows="10" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500" placeholder="De hoofdtekst van de landingspagina...">${currentContent.body || ""}</textarea> <p class="mt-1 text-sm text-firda-gray-500">
Gebruik lege regels om alinea's te scheiden
</p> </div> <!-- Submit buttons --> <div class="flex items-center gap-4 pt-4 border-t border-firda-gray-200"> <button type="submit" class="px-6 py-2 bg-firda-blue-600 text-white font-medium rounded-lg hover:bg-firda-blue-700 transition">
Opslaan
</button> <a href="/" target="_blank" class="px-6 py-2 bg-firda-gray-200 text-firda-gray-700 font-medium rounded-lg hover:bg-firda-gray-300 transition">
Bekijk pagina
</a> </div> </form> </div> <!-- Sidebar met PDF's --> <aside class="space-y-6"> ${renderComponent($$result2, "PdfUpload", $$PdfUpload, { "uploadUrl": "/api/upload-pdf" })} ${renderComponent($$result2, "PdfList", $$PdfList, { "pdfs": pdfs || [], "title": "Documenten", "maxHeight": "400px" })} ${pdfs && pdfs.length > 0 && renderTemplate`<div class="bg-firda-gray-50 rounded-lg p-4"> <h3 class="font-semibold text-firda-gray-800 mb-3">PDF's verwijderen</h3> <div class="space-y-2"> ${pdfs.map((pdf) => renderTemplate`<div class="flex items-center justify-between p-2 bg-white rounded-lg border border-firda-gray-200"> <span class="text-sm text-firda-gray-700 truncate flex-1 mr-2"> ${pdf.filename} </span> <form action="/api/delete-pdf" method="POST" class="inline"> <input type="hidden" name="pdfId"${addAttribute(pdf.id, "value")}> <input type="hidden" name="redirectTo" value="/dashboard/landingpage"> <button type="submit" class="p-1 text-firda-gray-400 hover:text-red-500 transition" onclick="return confirm('Weet je zeker dat je deze PDF wilt verwijderen?')"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </form> </div>`)} </div> </div>`} </aside> </div> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/landingpage.astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/landingpage.astro";
const $$url = "/dashboard/landingpage";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Landingpage,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
