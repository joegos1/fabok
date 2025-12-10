/**
 * Auth Utilities
 * ==============
 * Helper functies voor authenticatie en autorisatie
 */

import { supabase, supabaseAdmin } from '../database/supabase';
import type { UserRole, Profile } from '../../types/database';
import type { User } from '@supabase/supabase-js';

/**
 * Haal de huidige gebruiker op uit de session
 */
export async function getCurrentUser(accessToken?: string): Promise<User | null> {
  if (!accessToken) {
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return user;
}

/**
 * Haal het profiel van een gebruiker op
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Haal de rol van een gebruiker op
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const profile = await getUserProfile(userId);
  return profile?.role || null;
}

/**
 * Controleer of een gebruiker een bepaalde rol heeft
 */
export function hasRole(userRole: UserRole | null, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Controleer of een gebruiker admin is
 */
export function isAdmin(role: UserRole | null): boolean {
  return role === 'admin';
}

/**
 * Controleer of een gebruiker landingpage_editor is
 */
export function isLandingPageEditor(role: UserRole | null): boolean {
  return role === 'landingpage_editor' || role === 'admin';
}

/**
 * Controleer of een gebruiker project_editor is
 */
export function isProjectEditor(role: UserRole | null): boolean {
  return role === 'project_editor' || role === 'admin';
}

/**
 * Controleer of een gebruiker een specifiek project mag bewerken
 */
export async function canEditProject(userId: string, projectId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  
  if (!profile) return false;
  if (profile.role === 'admin') return true;
  if (profile.role !== 'project_editor') return false;
  
  // Check of de gebruiker eigenaar is van het project
  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single();
  
  return project?.owner_id === userId;
}

/**
 * Middleware helper voor het beschermen van routes
 */
export async function requireAuth(request: Request): Promise<{
  user: User | null;
  profile: Profile | null;
  accessToken: string | null;
  redirect?: Response;
}> {
  const cookies = request.headers.get('cookie') || '';
  const accessToken = getCookieValue(cookies, 'sb-access-token');
  const refreshToken = getCookieValue(cookies, 'sb-refresh-token');
  
  if (!accessToken) {
    return {
      user: null,
      profile: null,
      accessToken: null,
      redirect: new Response(null, {
        status: 302,
        headers: { Location: '/login' },
      }),
    };
  }
  
  let user = await getCurrentUser(accessToken);
  let newAccessToken = accessToken;
  
  if (!user) {
    // Probeer token te vernieuwen
    if (refreshToken) {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      
      if (!error && data.user) {
        user = data.user;
        newAccessToken = data.session?.access_token || null;
      }
    }
    
    if (!user) {
      return {
        user: null,
        profile: null,
        accessToken: null,
        redirect: new Response(null, {
          status: 302,
          headers: { Location: '/login' },
        }),
      };
    }
  }
  
  const profile = await getUserProfile(user.id);

  // Check account status
  if (profile && profile.account_status !== 'approved') {
    // Clear cookies to prevent infinite redirect loop
    const cookies = clearAuthCookies();
    const headers = new Headers();
    headers.set('Location', '/login?error=account_' + (profile.account_status || 'pending'));
    cookies.forEach(cookie => headers.append('Set-Cookie', cookie));

    return {
      user: null,
      profile: null,
      accessToken: null,
      redirect: new Response(null, {
        status: 302,
        headers,
      }),
    };
  }
  
  return {
    user,
    profile,
    accessToken: newAccessToken,
  };
}

/**
 * Helper om cookie waarde te krijgen
 */
function getCookieValue(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

/**
 * Maak auth cookies
 */
export function createAuthCookies(accessToken: string, refreshToken: string): string[] {
  const maxAge = 60 * 60 * 24 * 7; // 7 dagen
  const isProduction = import.meta.env.PROD;
  const secure = isProduction ? 'Secure;' : '';
  
  return [
    `sb-access-token=${accessToken}; Path=/; HttpOnly; ${secure} SameSite=Lax; Max-Age=${maxAge}`,
    `sb-refresh-token=${refreshToken}; Path=/; HttpOnly; ${secure} SameSite=Lax; Max-Age=${maxAge}`,
  ];
}

/**
 * Verwijder auth cookies
 */
export function clearAuthCookies(): string[] {
  const isProduction = import.meta.env.PROD;
  const secure = isProduction ? 'Secure;' : '';
  
  return [
    `sb-access-token=; Path=/; HttpOnly; ${secure} SameSite=Lax; Max-Age=0`,
    `sb-refresh-token=; Path=/; HttpOnly; ${secure} SameSite=Lax; Max-Age=0`,
  ];
}
