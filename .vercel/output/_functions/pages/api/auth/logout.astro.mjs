import { s as supabase } from '../../../chunks/supabaseClient_D_y5VInu.mjs';
import { a as clearAuthCookies } from '../../../chunks/auth_DruAOZHN.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ redirect }) => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }
  const cookies = clearAuthCookies();
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login?message=logged_out",
      "Set-Cookie": cookies.join(", ")
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
