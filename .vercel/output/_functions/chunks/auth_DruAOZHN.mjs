import { s as supabase, a as supabaseAdmin } from './supabaseClient_D_y5VInu.mjs';

async function getCurrentUser(accessToken) {
  if (!accessToken) {
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    console.error("Error getting user:", error);
    return null;
  }
  return user;
}
async function getUserProfile(userId) {
  const { data, error } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).single();
  if (error) {
    console.error("Error getting profile:", error);
    return null;
  }
  return data;
}
function isAdmin(role) {
  return role === "admin";
}
function isLandingPageEditor(role) {
  return role === "landingpage_editor" || role === "admin";
}
async function canEditProject(userId, projectId) {
  const profile = await getUserProfile(userId);
  if (!profile) return false;
  if (profile.role === "admin") return true;
  if (profile.role !== "project_editor") return false;
  const { data: project } = await supabaseAdmin.from("projects").select("owner_id").eq("id", projectId).single();
  return project?.owner_id === userId;
}
async function requireAuth(request) {
  const cookies = request.headers.get("cookie") || "";
  const accessToken = getCookieValue(cookies, "sb-access-token");
  const refreshToken = getCookieValue(cookies, "sb-refresh-token");
  if (!accessToken) {
    return {
      user: null,
      profile: null,
      accessToken: null,
      redirect: new Response(null, {
        status: 302,
        headers: { Location: "/login" }
      })
    };
  }
  const user = await getCurrentUser(accessToken);
  if (!user) {
    if (refreshToken) {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });
      if (!error && data.user) {
        const profile2 = await getUserProfile(data.user.id);
        return {
          user: data.user,
          profile: profile2,
          accessToken: data.session?.access_token || null
        };
      }
    }
    return {
      user: null,
      profile: null,
      accessToken: null,
      redirect: new Response(null, {
        status: 302,
        headers: { Location: "/login" }
      })
    };
  }
  const profile = await getUserProfile(user.id);
  return {
    user,
    profile,
    accessToken
  };
}
function getCookieValue(cookies, name) {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
function createAuthCookies(accessToken, refreshToken) {
  const maxAge = 60 * 60 * 24 * 7;
  return [
    `sb-access-token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
    `sb-refresh-token=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  ];
}
function clearAuthCookies() {
  return [
    `sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    `sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  ];
}

export { clearAuthCookies as a, isLandingPageEditor as b, createAuthCookies as c, canEditProject as d, isAdmin as i, requireAuth as r };
