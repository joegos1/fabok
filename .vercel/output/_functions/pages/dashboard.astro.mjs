/* empty css                                      */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, n as Fragment } from '../chunks/astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_b7uNVWIY.mjs';
import { r as requireAuth } from '../chunks/auth_DruAOZHN.mjs';
import { a as supabaseAdmin } from '../chunks/supabaseClient_D_y5VInu.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const auth = await requireAuth(Astro2.request);
  if (auth.redirect) {
    return auth.redirect;
  }
  const { profile } = auth;
  if (!profile) {
    return Astro2.redirect("/login");
  }
  const isAdmin = profile.role === "admin";
  const isLandingPageEditor = profile.role === "landingpage_editor" || isAdmin;
  const isProjectEditor = profile.role === "project_editor" || isAdmin;
  let projectCount = 0;
  let pdfCount = 0;
  let myProjectCount = 0;
  if (isAdmin) {
    const { count: pc } = await supabaseAdmin.from("projects").select("*", { count: "exact", head: true });
    projectCount = pc || 0;
    const { count: pdfc } = await supabaseAdmin.from("pdf_files").select("*", { count: "exact", head: true });
    pdfCount = pdfc || 0;
  }
  if (isProjectEditor && !isAdmin) {
    const { count: mpc } = await supabaseAdmin.from("projects").select("*", { count: "exact", head: true }).eq("owner_id", profile.id);
    myProjectCount = mpc || 0;
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard", "profile": profile }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-2xl font-bold text-firda-gray-900 mb-6">
Welkom, ${profile.full_name || profile.email} </h1>  <div class="mb-8 p-4 bg-firda-blue-50 rounded-lg"> <p class="text-sm text-firda-blue-800">
Je bent ingelogd als <strong class="font-semibold">${profile.role}</strong>.
${profile.role === "viewer" && "Je kunt alle content bekijken, maar niets aanpassen."} ${profile.role === "project_editor" && "Je kunt je eigen projecten beheren."} ${profile.role === "landingpage_editor" && "Je kunt de landingspagina beheren."} ${profile.role === "admin" && "Je hebt volledige toegang tot alle functies."} </p> </div>  ${isAdmin && renderTemplate`<div class="grid sm:grid-cols-3 gap-4 mb-8"> <div class="bg-firda-gray-50 rounded-lg p-6"> <div class="flex items-center justify-between"> <div> <p class="text-sm text-firda-gray-500">Totaal projecten</p> <p class="text-3xl font-bold text-firda-gray-900">${projectCount}</p> </div> <div class="p-3 bg-firda-blue-100 rounded-lg"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div> </div> </div> <div class="bg-firda-gray-50 rounded-lg p-6"> <div class="flex items-center justify-between"> <div> <p class="text-sm text-firda-gray-500">Totaal PDF's</p> <p class="text-3xl font-bold text-firda-gray-900">${pdfCount}</p> </div> <div class="p-3 bg-firda-green-100 rounded-lg"> <svg class="w-6 h-6 text-firda-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path> </svg> </div> </div> </div> <div class="bg-firda-gray-50 rounded-lg p-6"> <div class="flex items-center justify-between"> <div> <p class="text-sm text-firda-gray-500">Je rol</p> <p class="text-xl font-bold text-firda-gray-900 capitalize">${profile.role}</p> </div> <div class="p-3 bg-firda-blue-100 rounded-lg"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path> </svg> </div> </div> </div> </div>`} ${isProjectEditor && !isAdmin && renderTemplate`<div class="mb-8 p-6 bg-firda-gray-50 rounded-lg"> <div class="flex items-center justify-between"> <div> <p class="text-sm text-firda-gray-500">Mijn projecten</p> <p class="text-3xl font-bold text-firda-gray-900">${myProjectCount}</p> </div> <a href="/dashboard/mijn-projecten" class="px-4 py-2 bg-firda-blue-600 text-white rounded-lg hover:bg-firda-blue-700 transition">
Beheren
</a> </div> </div>`} <h2 class="text-lg font-semibold text-firda-gray-900 mb-4">Snelkoppelingen</h2> <div class="grid sm:grid-cols-2 gap-4"> ${isAdmin && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <a href="/dashboard/projecten" class="flex items-center p-4 bg-white border border-firda-gray-200 rounded-lg hover:border-firda-blue-300 hover:shadow-sm transition"> <div class="p-3 bg-firda-blue-50 rounded-lg mr-4"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div> <div> <h3 class="font-semibold text-firda-gray-900">Projecten beheren</h3> <p class="text-sm text-firda-gray-500">Bekijk, bewerk of archiveer projecten</p> </div> </a> <a href="/dashboard/gebruikers" class="flex items-center p-4 bg-white border border-firda-gray-200 rounded-lg hover:border-firda-blue-300 hover:shadow-sm transition"> <div class="p-3 bg-firda-green-50 rounded-lg mr-4"> <svg class="w-6 h-6 text-firda-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path> </svg> </div> <div> <h3 class="font-semibold text-firda-gray-900">Gebruikers beheren</h3> <p class="text-sm text-firda-gray-500">Rollen toekennen en wijzigen</p> </div> </a> ` })}`} ${isLandingPageEditor && renderTemplate`<a href="/dashboard/landingpage" class="flex items-center p-4 bg-white border border-firda-gray-200 rounded-lg hover:border-firda-blue-300 hover:shadow-sm transition"> <div class="p-3 bg-firda-blue-50 rounded-lg mr-4"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path> </svg> </div> <div> <h3 class="font-semibold text-firda-gray-900">Landingspagina</h3> <p class="text-sm text-firda-gray-500">Tekst en PDF's bewerken</p> </div> </a>`} ${isProjectEditor && !isAdmin && renderTemplate`<a href="/dashboard/mijn-projecten" class="flex items-center p-4 bg-white border border-firda-gray-200 rounded-lg hover:border-firda-blue-300 hover:shadow-sm transition"> <div class="p-3 bg-firda-blue-50 rounded-lg mr-4"> <svg class="w-6 h-6 text-firda-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <div> <h3 class="font-semibold text-firda-gray-900">Mijn projecten</h3> <p class="text-sm text-firda-gray-500">Beheer je eigen projecten</p> </div> </a>`} <!-- Algemene link naar publieke site --> <a href="/" class="flex items-center p-4 bg-white border border-firda-gray-200 rounded-lg hover:border-firda-blue-300 hover:shadow-sm transition"> <div class="p-3 bg-firda-gray-100 rounded-lg mr-4"> <svg class="w-6 h-6 text-firda-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </div> <div> <h3 class="font-semibold text-firda-gray-900">Bekijk website</h3> <p class="text-sm text-firda-gray-500">Open de publieke VABOK site</p> </div> </a> </div> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/index.astro", void 0);

const $$file = "C:/Users/jorgt/Documents/Piele/fabok/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
