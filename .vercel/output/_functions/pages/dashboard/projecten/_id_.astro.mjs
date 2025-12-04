/* empty css                                            */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../../../chunks/DashboardLayout_b7uNVWIY.mjs';
import { $ as $$PdfList } from '../../../chunks/PdfList_C4Nno7qd.mjs';
import { $ as $$PdfUpload } from '../../../chunks/PdfUpload__OwjtNzD.mjs';
import { r as requireAuth, d as canEditProject } from '../../../chunks/auth_DruAOZHN.mjs';
import { a as supabaseAdmin } from '../../../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const auth = await requireAuth(Astro2.request);
  if (auth.redirect) {
    return auth.redirect;
  }
  const { profile, user } = auth;
  if (!profile || !user) {
    return Astro2.redirect("/login");
  }
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/dashboard");
  }
  const canEdit = await canEditProject(user.id, id);
  if (!canEdit) {
    return Astro2.redirect("/dashboard");
  }
  const { data: project, error: projectError } = await supabaseAdmin.from("projects").select("*").eq("id", id).single();
  if (projectError || !project) {
    return Astro2.redirect("/dashboard/projecten");
  }
  const { data: pdfs } = await supabaseAdmin.from("pdf_files").select("*").eq("project_id", id).order("uploaded_at", { ascending: false });
  const isAdmin = profile.role === "admin";
  let users = [];
  if (isAdmin) {
    const { data } = await supabaseAdmin.from("profiles").select("id, email, full_name, role").in("role", ["admin", "project_editor"]).order("full_name");
    users = data || [];
  }
  const url = new URL(Astro2.request.url);
  const message = url.searchParams.get("message");
  const errorMsg = url.searchParams.get("error");
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const title = formData.get("title")?.toString() || project.title;
      const shortDescription = formData.get("short_description")?.toString() || null;
      const fullDescription = formData.get("full_description")?.toString() || null;
      const goals = formData.get("goals")?.toString() || null;
      const targetAudience = formData.get("target_audience")?.toString() || null;
      const contactPerson = formData.get("contact_person")?.toString() || null;
      const tagsString = formData.get("tags")?.toString() || "";
      const ownerId = isAdmin ? formData.get("owner_id")?.toString() || project.owner_id : project.owner_id;
      const tags = tagsString.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
      const { error } = await supabaseAdmin.from("projects").update({
        title,
        short_description: shortDescription,
        full_description: fullDescription,
        goals,
        target_audience: targetAudience,
        contact_person: contactPerson,
        tags,
        owner_id: ownerId,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id);
      if (error) {
        console.error("Error updating project:", error);
        return Astro2.redirect(`/dashboard/projecten/${id}?error=Update mislukt`);
      } else {
        return Astro2.redirect(`/dashboard/projecten/${id}?message=updated`);
      }
    } catch (error) {
      console.error("Error processing form:", error);
    }
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": `Bewerk: ${project.title}`, "profile": profile }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="grid lg:grid-cols-3 gap-8"> <!-- Formulier --> <div class="lg:col-span-2"> <div class="flex items-center mb-6"> <a${addAttribute(isAdmin ? "/dashboard/projecten" : "/dashboard/mijn-projecten", "href")} class="text-firda-gray-500 hover:text-firda-gray-700 mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg> </a> <h1 class="text-2xl font-bold text-firda-gray-900">
Project bewerken
</h1> </div> ${message === "updated" && renderTemplate`<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
Project succesvol bijgewerkt.
</div>`} ${errorMsg && renderTemplate`<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"> ${errorMsg} </div>`} <form method="POST" class="space-y-6"> <!-- Titel --> <div> <label for="title" class="block text-sm font-medium text-firda-gray-700 mb-1">
Titel <span class="text-red-500">*</span> </label> <input type="text" id="title" name="title" required${addAttribute(project.title, "value")} class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> </div> <!-- Korte beschrijving --> <div> <label for="short_description" class="block text-sm font-medium text-firda-gray-700 mb-1">
Korte beschrijving
</label> <input type="text" id="short_description" name="short_description"${addAttribute(project.short_description || "", "value")} class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> </div> <!-- Uitgebreide beschrijving --> <div> <label for="full_description" class="block text-sm font-medium text-firda-gray-700 mb-1">
Uitgebreide beschrijving
</label> <textarea id="full_description" name="full_description" rows="6" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500">${project.full_description || ""}</textarea> </div> <!-- Doelen --> <div> <label for="goals" class="block text-sm font-medium text-firda-gray-700 mb-1">
Doelen
</label> <textarea id="goals" name="goals" rows="4" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500">${project.goals || ""}</textarea> </div> <!-- Doelgroep --> <div> <label for="target_audience" class="block text-sm font-medium text-firda-gray-700 mb-1">
Doelgroep
</label> <input type="text" id="target_audience" name="target_audience"${addAttribute(project.target_audience || "", "value")} class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> </div> <!-- Contactpersoon --> <div> <label for="contact_person" class="block text-sm font-medium text-firda-gray-700 mb-1">
Contactpersoon
</label> <input type="text" id="contact_person" name="contact_person"${addAttribute(project.contact_person || "", "value")} class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> </div> <!-- Tags --> <div> <label for="tags" class="block text-sm font-medium text-firda-gray-700 mb-1">
Tags
</label> <input type="text" id="tags" name="tags"${addAttribute((project.tags || []).join(", "), "value")} class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> <p class="mt-1 text-sm text-firda-gray-500">
Scheid tags met komma's
</p> </div> <!-- Eigenaar (alleen voor admin) --> ${isAdmin && renderTemplate`<div> <label for="owner_id" class="block text-sm font-medium text-firda-gray-700 mb-1">
Projecteigenaar
</label> <select id="owner_id" name="owner_id" class="w-full px-4 py-2 border border-firda-gray-300 rounded-lg focus:ring-2 focus:ring-firda-blue-500 focus:border-firda-blue-500"> ${users.map((u) => renderTemplate`<option${addAttribute(u.id, "value")}${addAttribute(u.id === project.owner_id, "selected")}> ${u.full_name || u.email} (${u.role})
</option>`)} </select> </div>`} <!-- Submit buttons --> <div class="flex items-center gap-4 pt-4 border-t border-firda-gray-200"> <button type="submit" class="px-6 py-2 bg-firda-blue-600 text-white font-medium rounded-lg hover:bg-firda-blue-700 transition">
Opslaan
</button> <a${addAttribute(`/projecten/${id}`, "href")} target="_blank" class="px-6 py-2 bg-firda-gray-200 text-firda-gray-700 font-medium rounded-lg hover:bg-firda-gray-300 transition">
Bekijk op site
</a> </div> </form> </div> <!-- Sidebar met PDF's --> <aside class="space-y-6"> ${renderComponent($$result2, "PdfUpload", $$PdfUpload, { "projectId": id, "uploadUrl": "/api/upload-pdf" })} ${renderComponent($$result2, "PdfList", $$PdfList, { "pdfs": pdfs || [], "title": "Projectdocumenten", "maxHeight": "400px" })} ${pdfs && pdfs.length > 0 && renderTemplate`<div class="bg-firda-gray-50 rounded-lg p-4"> <h3 class="font-semibold text-firda-gray-800 mb-3">PDF's verwijderen</h3> <p class="text-sm text-firda-gray-600 mb-4">
Klik op de prullenbak om een PDF te verwijderen.
</p> <div class="space-y-2"> ${pdfs.map((pdf) => renderTemplate`<div class="flex items-center justify-between p-2 bg-white rounded-lg border border-firda-gray-200"> <span class="text-sm text-firda-gray-700 truncate flex-1 mr-2"> ${pdf.filename} </span> <form action="/api/delete-pdf" method="POST" class="inline"> <input type="hidden" name="pdfId"${addAttribute(pdf.id, "value")}> <input type="hidden" name="redirectTo"${addAttribute(`/dashboard/projecten/${id}`, "value")}> <button type="submit" class="p-1 text-firda-gray-400 hover:text-red-500 transition" onclick="return confirm('Weet je zeker dat je deze PDF wilt verwijderen?')"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path> </svg> </button> </form> </div>`)} </div> </div>`} </aside> </div> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/projecten/[id].astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/projecten/[id].astro";
const $$url = "/dashboard/projecten/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
