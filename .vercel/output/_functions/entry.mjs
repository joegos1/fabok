import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CP8V1nCE.mjs';
import { manifest } from './manifest_B-4jQ1rW.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/login.astro.mjs');
const _page2 = () => import('./pages/api/auth/logout.astro.mjs');
const _page3 = () => import('./pages/api/delete-pdf.astro.mjs');
const _page4 = () => import('./pages/api/projects/archive.astro.mjs');
const _page5 = () => import('./pages/api/projects/restore.astro.mjs');
const _page6 = () => import('./pages/api/upload-pdf.astro.mjs');
const _page7 = () => import('./pages/api/users/update-role.astro.mjs');
const _page8 = () => import('./pages/dashboard/gebruikers.astro.mjs');
const _page9 = () => import('./pages/dashboard/landingpage.astro.mjs');
const _page10 = () => import('./pages/dashboard/mijn-projecten.astro.mjs');
const _page11 = () => import('./pages/dashboard/projecten/nieuw.astro.mjs');
const _page12 = () => import('./pages/dashboard/projecten/_id_.astro.mjs');
const _page13 = () => import('./pages/dashboard/projecten.astro.mjs');
const _page14 = () => import('./pages/dashboard.astro.mjs');
const _page15 = () => import('./pages/login.astro.mjs');
const _page16 = () => import('./pages/projecten/_id_.astro.mjs');
const _page17 = () => import('./pages/projecten.astro.mjs');
const _page18 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/login.ts", _page1],
    ["src/pages/api/auth/logout.ts", _page2],
    ["src/pages/api/delete-pdf.ts", _page3],
    ["src/pages/api/projects/archive.ts", _page4],
    ["src/pages/api/projects/restore.ts", _page5],
    ["src/pages/api/upload-pdf.ts", _page6],
    ["src/pages/api/users/update-role.ts", _page7],
    ["src/pages/dashboard/gebruikers.astro", _page8],
    ["src/pages/dashboard/landingpage.astro", _page9],
    ["src/pages/dashboard/mijn-projecten.astro", _page10],
    ["src/pages/dashboard/projecten/nieuw.astro", _page11],
    ["src/pages/dashboard/projecten/[id].astro", _page12],
    ["src/pages/dashboard/projecten/index.astro", _page13],
    ["src/pages/dashboard/index.astro", _page14],
    ["src/pages/login.astro", _page15],
    ["src/pages/projecten/[id].astro", _page16],
    ["src/pages/projecten/index.astro", _page17],
    ["src/pages/index.astro", _page18]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "08063d94-b540-4e43-9be5-f7f5a29fde9e",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
