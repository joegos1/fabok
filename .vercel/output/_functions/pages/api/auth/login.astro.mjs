import { s as supabase } from '../../../chunks/supabaseClient_D_y5VInu.mjs';
import { c as createAuthCookies } from '../../../chunks/auth_DruAOZHN.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!email || !password) {
      return redirect("/login?error=invalid_credentials");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error || !data.session) {
      console.error("Login error:", error);
      return redirect("/login?error=invalid_credentials");
    }
    const cookies = createAuthCookies(
      data.session.access_token,
      data.session.refresh_token
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
        "Set-Cookie": cookies.join(", ")
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return redirect("/login?error=server_error");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
