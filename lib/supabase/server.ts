import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createBrowserClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createUnauthenticatedClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function createAuthenticatedClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {

          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {

          }
        },
      },
    }
  );
}

// Legacy function for backward compatibility
export async function createClient(useAuth = true) {
  if (!useAuth) {
    return createUnauthenticatedClient();
  }
  return createAuthenticatedClient();
}