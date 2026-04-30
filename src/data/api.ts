import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Category, Service, SiteMeta, StoreData } from "./store";

const BUCKET = "explorapucon";

// ========== FETCH ==========
export async function fetchAll(): Promise<StoreData | null> {
  if (!supabase) return null;
  const [catsRes, srvRes, metaRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("services").select("*").order("name"),
    supabase.from("site_meta").select("*").limit(1).maybeSingle(),
  ]);

  if (catsRes.error) console.error("Supabase categories error:", catsRes.error);
  if (srvRes.error) console.error("Supabase services error:", srvRes.error);
  if (metaRes.error) console.error("Supabase meta error:", metaRes.error);

  const categories = (catsRes.data || []) as Category[];
  const services = (srvRes.data || []) as Service[];
  const meta = (metaRes.data?.data as SiteMeta) || null;

  if (!meta) return null;

  return { categories, services, meta };
}

// ========== CATEGORIES ==========
export async function upsertCategory(c: Category) {
  if (!supabase) return;
  const { error } = await supabase.from("categories").upsert(c, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteCategoryRow(slug: string) {
  if (!supabase) return;
  // Cascade: also delete services in that category
  await supabase.from("services").delete().eq("category", slug);
  const { error } = await supabase.from("categories").delete().eq("slug", slug);
  if (error) throw error;
}

// ========== SERVICES ==========
export async function upsertService(s: Service) {
  if (!supabase) return;
  const { error } = await supabase.from("services").upsert(s, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteServiceRow(slug: string) {
  if (!supabase) return;
  const { error } = await supabase.from("services").delete().eq("slug", slug);
  if (error) throw error;
}

// ========== META ==========
export async function upsertMeta(meta: SiteMeta) {
  if (!supabase) return;
  // Single row table with id=1 and json column "data"
  const { error } = await supabase.from("site_meta").upsert({ id: 1, data: meta });
  if (error) throw error;
}

// ========== AUTH ==========
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ========== STORAGE (image upload) ==========
export async function uploadImage(file: File, folder: string = "uploads"): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) {
    console.error("Upload error:", error);
    throw error;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ========== SEED ==========
export async function seedDatabase(data: StoreData) {
  if (!supabase) throw new Error("Supabase no configurado");
  // Insert categories
  for (const c of data.categories) {
    await supabase.from("categories").upsert(c, { onConflict: "slug" });
  }
  // Insert services
  for (const s of data.services) {
    await supabase.from("services").upsert(s, { onConflict: "slug" });
  }
  // Meta
  await supabase.from("site_meta").upsert({ id: 1, data: data.meta });
}

export { isSupabaseConfigured };
