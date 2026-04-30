import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Read env vars (Vite prefixes them with VITE_)
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (typeof window !== "undefined" ? localStorage.getItem("VITE_SUPABASE_URL") || "" : "");

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (typeof window !== "undefined" ? localStorage.getItem("VITE_SUPABASE_ANON_KEY") || "" : "");

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export function setSupabaseCredentials(url: string, anon: string) {
  const cleanUrl = url.trim();
  const cleanAnon = anon.trim();
  if (!cleanUrl.startsWith("https://") || !cleanUrl.includes("supabase.co")) {
    alert('URL inválida. Debe ser algo como https://xxxxx.supabase.co — NO el link del dashboard.');
    return;
  }
  if (!cleanAnon.startsWith("eyJ") && !cleanAnon.startsWith("sb_")) {
    alert('Anon Key inválida. Debe empezar con "eyJ..." o "sb_publishable_...". Asegúrate de copiar la "anon public" key.');
    return;
  }
  localStorage.setItem("VITE_SUPABASE_URL", cleanUrl);
  localStorage.setItem("VITE_SUPABASE_ANON_KEY", cleanAnon);
  window.location.reload();
}

export function clearSupabaseCredentials() {
  localStorage.removeItem("VITE_SUPABASE_URL");
  localStorage.removeItem("VITE_SUPABASE_ANON_KEY");
  window.location.reload();
}

export function getSupabaseUrl(): string {
  return SUPABASE_URL;
}
