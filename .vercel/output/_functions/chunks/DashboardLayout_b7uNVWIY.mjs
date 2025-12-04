import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, o as renderSlot } from './astro/server_CsBBwtW8.mjs';
import 'piccolore';
import { $ as $$Layout } from './Layout_JNDdhiWt.mjs';

const $$Astro = createAstro();
const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { title, profile } = Astro2.props;
  const currentPath = Astro2.url.pathname;
  const isAdmin = profile.role === "admin";
  const isLandingPageEditor = profile.role === "landingpage_editor" || isAdmin;
  const isProjectEditor = profile.role === "project_editor" || isAdmin;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="flex flex-col lg:flex-row gap-8"> <!-- Sidebar --> <aside class="lg:w-64 flex-shrink-0"> <div class="bg-white rounded-xl shadow-sm p-6"> <!-- Gebruiker info --> <div class="mb-6 pb-6 border-b border-firda-gray-200"> <p class="text-sm text-firda-gray-500">Ingelogd als</p> <p class="font-semibold text-firda-gray-800 truncate"> ${profile.full_name || profile.email} </p> <span class="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-firda-blue-100 text-firda-blue-700"> ${profile.role} </span> </div> <!-- Navigatie --> <nav class="space-y-2"> <a href="/dashboard"${addAttribute([
    "flex items-center px-3 py-2 rounded-lg transition",
    currentPath === "/dashboard" ? "bg-firda-blue-50 text-firda-blue-700" : "hover:bg-firda-gray-100 text-firda-gray-700"
  ], "class:list")}> <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path> </svg>
Dashboard
</a> ${isAdmin && renderTemplate`<a href="/dashboard/projecten"${addAttribute([
    "flex items-center px-3 py-2 rounded-lg transition",
    currentPath.startsWith("/dashboard/projecten") ? "bg-firda-blue-50 text-firda-blue-700" : "hover:bg-firda-gray-100 text-firda-gray-700"
  ], "class:list")}> <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg>
Alle projecten
</a>`} ${isProjectEditor && !isAdmin && renderTemplate`<a href="/dashboard/mijn-projecten"${addAttribute([
    "flex items-center px-3 py-2 rounded-lg transition",
    currentPath.startsWith("/dashboard/mijn-projecten") ? "bg-firda-blue-50 text-firda-blue-700" : "hover:bg-firda-gray-100 text-firda-gray-700"
  ], "class:list")}> <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg>
Mijn projecten
</a>`} ${isLandingPageEditor && renderTemplate`<a href="/dashboard/landingpage"${addAttribute([
    "flex items-center px-3 py-2 rounded-lg transition",
    currentPath.startsWith("/dashboard/landingpage") ? "bg-firda-blue-50 text-firda-blue-700" : "hover:bg-firda-gray-100 text-firda-gray-700"
  ], "class:list")}> <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path> </svg>
Landingspagina
</a>`} ${isAdmin && renderTemplate`<a href="/dashboard/gebruikers"${addAttribute([
    "flex items-center px-3 py-2 rounded-lg transition",
    currentPath.startsWith("/dashboard/gebruikers") ? "bg-firda-blue-50 text-firda-blue-700" : "hover:bg-firda-gray-100 text-firda-gray-700"
  ], "class:list")}> <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path> </svg>
Gebruikers
</a>`} </nav> <!-- Uitloggen --> <div class="mt-6 pt-6 border-t border-firda-gray-200"> <a href="/api/auth/logout" class="flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"> <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path> </svg>
Uitloggen
</a> </div> </div> </aside> <!-- Main content area --> <div class="flex-1"> <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8"> ${renderSlot($$result2, $$slots["default"])} </div> </div> </div> </div> ` })}`;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/layouts/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };
