import { e as createComponent, f as createAstro, h as addAttribute, p as renderHead, o as renderSlot, l as renderScript, k as renderComponent, r as renderTemplate, n as Fragment } from './astro/server_CsBBwtW8.mjs';
import 'piccolore';
/* empty css                              */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "VABOK - Versterken van de Aansluiting in de Beroepskolom" } = Astro2.props;
  const cookies = Astro2.request.headers.get("cookie") || "";
  const isLoggedIn = cookies.includes("sb-access-token");
  return renderTemplate`<html lang="nl"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title} | VABOK</title>${renderHead()}</head> <body class="min-h-screen bg-firda-gray-50 text-firda-gray-900"> <!-- Header / Navigatie --> <header class="bg-firda-blue-600 text-white shadow-lg"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-16"> <!-- Logo / Site naam --> <a href="/" class="flex items-center space-x-3 hover:opacity-90 transition"> <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path> </svg> <span class="font-bold text-xl">VABOK</span> </a> <!-- Navigatie links --> <nav class="hidden md:flex items-center space-x-6"> <a href="/" class="hover:text-firda-green-300 transition font-medium">
Home
</a> <a href="/projecten" class="hover:text-firda-green-300 transition font-medium">
Projecten
</a> ${isLoggedIn ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="/dashboard" class="hover:text-firda-green-300 transition font-medium">
Dashboard
</a> <a href="/api/auth/logout" class="bg-firda-blue-700 hover:bg-firda-blue-800 px-4 py-2 rounded-lg transition font-medium">
Uitloggen
</a> ` })}` : renderTemplate`<a href="/login" class="bg-firda-green-500 hover:bg-firda-green-600 px-4 py-2 rounded-lg transition font-medium">
Inloggen
</a>`} </nav> <!-- Mobile menu button --> <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-firda-blue-700 transition" aria-label="Menu openen"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> <!-- Mobile menu --> <nav id="mobile-menu" class="hidden md:hidden pb-4"> <div class="flex flex-col space-y-2"> <a href="/" class="hover:bg-firda-blue-700 px-3 py-2 rounded-lg transition">
Home
</a> <a href="/projecten" class="hover:bg-firda-blue-700 px-3 py-2 rounded-lg transition">
Projecten
</a> ${isLoggedIn ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <a href="/dashboard" class="hover:bg-firda-blue-700 px-3 py-2 rounded-lg transition">
Dashboard
</a> <a href="/api/auth/logout" class="hover:bg-firda-blue-700 px-3 py-2 rounded-lg transition">
Uitloggen
</a> ` })}` : renderTemplate`<a href="/login" class="bg-firda-green-500 hover:bg-firda-green-600 px-3 py-2 rounded-lg transition">
Inloggen
</a>`} </div> </nav> </div> </header> <!-- Main content --> <main class="flex-grow"> ${renderSlot($$result, $$slots["default"])} </main> <!-- Footer --> <footer class="bg-firda-gray-800 text-firda-gray-300 mt-auto"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <div class="flex flex-col md:flex-row justify-between items-center"> <div class="mb-4 md:mb-0"> <p class="text-sm">
&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} VABOK - Versterken van de Aansluiting in de Beroepskolom
</p> </div> <div class="flex space-x-6 text-sm"> <a href="/" class="hover:text-white transition">Home</a> <a href="/projecten" class="hover:text-white transition">Projecten</a> <a href="/login" class="hover:text-white transition">Inloggen</a> </div> </div> </div> </footer> <!-- Mobile menu script --> ${renderScript($$result, "C:/Users/jorgt/Documents/Piele/fabok/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} </body> </html> `;
}, "C:/Users/jorgt/Documents/Piele/fabok/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
