import { useSyncExternalStore } from "react";

export type Agency = {
  name: string;
  logo?: string; // URL or empty for auto initials
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  founded?: string; // year
  certifications?: string[];
};

export type Service = {
  slug: string;
  name: string;
  category: string;
  type: string;
  shortDesc: string;
  description: string;
  image: string;
  gallery?: string[];
  price?: number;
  priceUnit?: string;
  features: string[];
  rating: number;
  reviews: number;
  duration?: string;
  level?: string;
  capacity?: string;
  location: string;
  phone: string;
  badge?: string;
  highlights?: string[];
  includes?: string[];
  published?: boolean;
  agency?: Agency;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  color: string;
  accent: string;
  count: number;
  image: string;
  iconPath: string;
};

export type SiteMeta = {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  logo?: string; // URL of the logo image
  logoDark?: string; // URL of the logo for dark backgrounds (optional)
};

export type StoreData = {
  categories: Category[];
  services: Service[];
  meta: SiteMeta;
};

// ------ SEED DATA ------
import seedServices from "./seed";

const SEED: StoreData = seedServices;

// ------ STORAGE ------
const KEY = "explorapucon_data_v1";
const AUTH_KEY = "explorapucon_admin_v1";

function load(): StoreData {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return {
      categories: parsed.categories || SEED.categories,
      services: parsed.services || SEED.services,
      meta: { ...SEED.meta, ...(parsed.meta || {}) },
    };
  } catch {
    return SEED;
  }
}

let state: StoreData = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("localStorage full, could not persist", e);
  }
  listeners.forEach((l) => l());
}

// ------ SUPABASE BOOTSTRAP ------
// On module load, if Supabase is configured, try to fetch fresh data and update state.
let _supabaseLoaded = false;
export async function bootstrapFromSupabase() {
  if (_supabaseLoaded) return;
  _supabaseLoaded = true;
  try {
    const { isSupabaseConfigured } = await import("../lib/supabase");
    if (!isSupabaseConfigured) return;
    const { fetchAll } = await import("./api");
    const data = await fetchAll();
    if (data && data.categories.length > 0) {
      state = data;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
      listeners.forEach((l) => l());
    }
  } catch (err) {
    console.warn("Supabase bootstrap failed, using local data", err);
  }
}

// Trigger automatically in browser
if (typeof window !== "undefined") {
  setTimeout(() => { void bootstrapFromSupabase(); }, 0);
}

async function syncToSupabase(action: "saveService" | "deleteService" | "saveCategory" | "deleteCategory" | "saveMeta", payload: unknown) {
  try {
    const { isSupabaseConfigured } = await import("../lib/supabase");
    if (!isSupabaseConfigured) return;
    const api = await import("./api");
    if (action === "saveService") await api.upsertService(payload as Service);
    else if (action === "deleteService") await api.deleteServiceRow(payload as string);
    else if (action === "saveCategory") await api.upsertCategory(payload as Category);
    else if (action === "deleteCategory") await api.deleteCategoryRow(payload as string);
    else if (action === "saveMeta") await api.upsertMeta(payload as SiteMeta);
  } catch (err) {
    console.error("Supabase sync failed:", err);
    alert("⚠️ Cambio guardado localmente, pero falló sincronización con Supabase. Revisa la consola.");
  }
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return state;
}

// ------ HOOKS ------
export function useStore(): StoreData {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useCategories(): Category[] {
  return useStore().categories;
}

export function useServices(): Service[] {
  return useStore().services.filter((s) => s.published !== false);
}

export function useAllServices(): Service[] {
  return useStore().services;
}

export function useCategory(slug: string): Category | undefined {
  return useCategories().find((c) => c.slug === slug);
}

export function useService(slug: string): Service | undefined {
  return useAllServices().find((s) => s.slug === slug);
}

export function useServicesByCategory(slug: string): Service[] {
  return useServices().filter((s) => s.category === slug);
}

export function useMeta(): SiteMeta {
  return useStore().meta;
}

// ------ MUTATIONS ------
export const StoreActions = {
  saveService(service: Service) {
    const idx = state.services.findIndex((s) => s.slug === service.slug);
    if (idx >= 0) {
      state = { ...state, services: state.services.map((s, i) => (i === idx ? service : s)) };
    } else {
      state = { ...state, services: [service, ...state.services] };
    }
    StoreActions.recountCategories();
    persist();
    void syncToSupabase("saveService", service);
  },
  deleteService(slug: string) {
    state = { ...state, services: state.services.filter((s) => s.slug !== slug) };
    StoreActions.recountCategories();
    persist();
    void syncToSupabase("deleteService", slug);
  },
  saveCategory(category: Category) {
    const idx = state.categories.findIndex((c) => c.slug === category.slug);
    if (idx >= 0) {
      state = { ...state, categories: state.categories.map((c, i) => (i === idx ? category : c)) };
    } else {
      state = { ...state, categories: [...state.categories, category] };
    }
    persist();
    void syncToSupabase("saveCategory", category);
  },
  deleteCategory(slug: string) {
    state = {
      ...state,
      categories: state.categories.filter((c) => c.slug !== slug),
      services: state.services.filter((s) => s.category !== slug),
    };
    persist();
    void syncToSupabase("deleteCategory", slug);
  },
  recountCategories() {
    state = {
      ...state,
      categories: state.categories.map((c) => ({
        ...c,
        count: state.services.filter((s) => s.category === c.slug && s.published !== false).length || c.count,
      })),
    };
  },
  saveMeta(meta: SiteMeta) {
    state = { ...state, meta };
    persist();
    void syncToSupabase("saveMeta", meta);
  },
  resetToSeed() {
    state = JSON.parse(JSON.stringify(SEED));
    persist();
  },
  exportJSON(): string {
    return JSON.stringify(state, null, 2);
  },
  importJSON(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (!data.services || !data.categories) return false;
      state = {
        categories: data.categories,
        services: data.services,
        meta: data.meta || SEED.meta,
      };
      persist();
      return true;
    } catch {
      return false;
    }
  },
};

// ------ AUTH ------
export const Auth = {
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEY) === "1";
  },
  getPassword(): string {
    return localStorage.getItem("explorapucon_admin_pwd") || "admin123";
  },
  // Sync legacy login (demo password)
  login(password: string): boolean {
    if (password === this.getPassword()) {
      localStorage.setItem(AUTH_KEY, "1");
      return true;
    }
    return false;
  },
  // Async login: tries Supabase first if configured, falls back to demo password
  async loginAsync(emailOrPwd: string, password?: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const { isSupabaseConfigured } = await import("../lib/supabase");
      if (isSupabaseConfigured && password) {
        try {
          const { signIn } = await import("./api");
          await signIn(emailOrPwd, password);
          localStorage.setItem(AUTH_KEY, "1");
          return { ok: true };
        } catch (authErr: unknown) {
          // Supabase auth failed — fall through to demo password check
          const msg = authErr instanceof Error ? authErr.message : String(authErr);
          console.warn("Supabase auth failed, trying demo fallback:", msg);
          // If it's a clear "Invalid API key" or network error, offer demo fallback
        }
      }
    } catch {}
    // Fallback: demo password
    const pwd = password || emailOrPwd;
    if (pwd === this.getPassword()) {
      localStorage.setItem(AUTH_KEY, "1");
      return { ok: true };
    }
    return { ok: false, error: "Credenciales incorrectas" };
  },
  async logout() {
    try {
      const { signOut } = await import("./api");
      await signOut();
    } catch {}
    localStorage.removeItem(AUTH_KEY);
  },
  changePassword(oldP: string, newP: string): boolean {
    if (oldP !== this.getPassword()) return false;
    if (newP.length < 4) return false;
    localStorage.setItem("explorapucon_admin_pwd", newP);
    return true;
  },
};

export const fmt = (n: number) => "$" + n.toLocaleString("es-CL");

// ------ Backward compat (sync getters) ------
export const getCategory = (slug: string) => state.categories.find((c) => c.slug === slug);
export const getService = (slug: string) => state.services.find((s) => s.slug === slug);
export const getServicesByCategory = (slug: string) =>
  state.services.filter((s) => s.category === slug && s.published !== false);
export const categories = state.categories;
export const services = state.services;
