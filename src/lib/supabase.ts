import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const LS_URL = "VITE_SUPABASE_URL";
const LS_KEY = "VITE_SUPABASE_ANON_KEY";

function clean(s: string): string {
  // Remove whitespace, newlines, quotes and BOM characters that appear when pasting
  return s.trim().replace(/[\r\n\t"'`]/g, "").replace(/\s+/g, "");
}

function readUrl(): string {
  const env = import.meta.env.VITE_SUPABASE_URL;
  if (env) return clean(env);
  if (typeof window === "undefined") return "";
  return clean(localStorage.getItem(LS_URL) || "");
}

function readKey(): string {
  const env = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (env) return clean(env);
  if (typeof window === "undefined") return "";
  return clean(localStorage.getItem(LS_KEY) || "");
}

const SUPABASE_URL = readUrl();
const SUPABASE_ANON_KEY = readKey();

function isValidUrl(u: string): boolean {
  return u.startsWith("https://") && u.includes(".supabase.co");
}

function isValidKey(k: string): boolean {
  // Old format: JWT starting with "eyJ" (100+ chars)
  // New format (2024+): "sb_publishable_" prefix
  return (k.startsWith("eyJ") && k.length > 100) ||
         k.startsWith("sb_publishable_") ||
         k.startsWith("sb_secret_");
}

export const isSupabaseConfigured =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  isValidUrl(SUPABASE_URL) &&
  isValidKey(SUPABASE_ANON_KEY);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "explorapucon_auth",
      },
    });
  } catch (e) {
    console.error("Failed to create Supabase client:", e);
  }
}

// Validation diagnostics (used in admin panel)
export function diagnose(): {
  url: string;
  keyPreview: string;
  urlValid: boolean;
  keyValid: boolean;
  configured: boolean;
  source: "env" | "localStorage" | "none";
} {
  const url = readUrl();
  const key = readKey();
  const fromEnv = Boolean(
    import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const fromLS = Boolean(
    typeof window !== "undefined" &&
      (localStorage.getItem(LS_URL) || localStorage.getItem(LS_KEY))
  );

  return {
    url,
    keyPreview: key ? key.slice(0, 20) + "..." + key.slice(-10) : "(vacía)",
    urlValid: isValidUrl(url),
    keyValid: isValidKey(key),
    configured: isSupabaseConfigured,
    source: fromEnv ? "env" : fromLS ? "localStorage" : "none",
  };
}

export function setSupabaseCredentials(url: string, anon: string) {
  const cleanUrl = clean(url);
  const cleanKey = clean(anon);

  if (!isValidUrl(cleanUrl)) {
    alert("❌ URL inválida. Debe ser: https://xxxxxxxx.supabase.co");
    return;
  }
  if (!isValidKey(cleanKey)) {
    alert("❌ Anon Key inválida. Debe empezar con 'eyJ' y tener más de 100 caracteres.\n\nAsegúrate de copiar la 'anon public' key completa, sin espacios ni saltos de línea.");
    return;
  }

  localStorage.setItem(LS_URL, cleanUrl);
  localStorage.setItem(LS_KEY, cleanKey);
  window.location.reload();
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(LS_URL);
  localStorage.removeItem(LS_KEY);
  window.location.reload();
}

export function getSupabaseUrl(): string {
  return SUPABASE_URL;
}

export function getSupabaseKeyPreview(): string {
  if (!SUPABASE_ANON_KEY) return "";
  return SUPABASE_ANON_KEY.slice(0, 20) + "..." + SUPABASE_ANON_KEY.slice(-8);
}
