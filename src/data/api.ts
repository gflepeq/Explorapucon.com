import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Category, Service, SiteMeta, StoreData } from "./store";

const BUCKET = "explorapucon";

// ─── Error classifier ──────────────────────────────────────────────
export type ApiError = {
  code: "NO_TABLES" | "RLS" | "AUTH" | "NETWORK" | "UNKNOWN";
  message: string;
  raw?: unknown;
};

function extractMessage(err: unknown): string {
  if (!err) return "Error desconocido";
  if (typeof err === "string") return err;
  const e = err as Record<string, unknown>;
  const parts: string[] = [];
  if (e.message && typeof e.message === "string") parts.push(e.message);
  if (e.details && typeof e.details === "string") parts.push(e.details);
  if (e.hint    && typeof e.hint    === "string") parts.push(e.hint);
  if (parts.length) return parts.join(" — ");
  try { return JSON.stringify(err); } catch { return String(err); }
}

function classify(err: unknown): ApiError {
  const msg    = extractMessage(err);
  const e      = err as Record<string, unknown>;
  const code_  = (e?.code as string) || "";
  const status = (e?.status as number) || 0;

  const low = msg.toLowerCase();

  if (low.includes("does not exist") || code_ === "42P01")
    return { code: "NO_TABLES", message: "Las tablas no existen. Ejecuta el SQL en Supabase.", raw: err };

  if (low.includes("row-level security") || low.includes("rls") || code_ === "42501" || status === 403)
    return { code: "RLS", message: "Sin permisos de escritura (RLS). Inicia sesión como admin o desactiva RLS temporalmente.", raw: err };

  if (low.includes("jwt") || low.includes("invalid api key") || low.includes("apikey") ||
      low.includes("unauthorized") || status === 401)
    return { code: "AUTH", message: "Sesión expirada o API key inválida. Vuelve a iniciar sesión.", raw: err };

  if (low.includes("failed to fetch") || low.includes("networkerror") || low.includes("econnrefused"))
    return { code: "NETWORK", message: "Error de red. Verifica tu conexión a internet.", raw: err };

  return { code: "UNKNOWN", message: msg, raw: err };
}

// ─── Diagnostics ───────────────────────────────────────────────────
export type DiagResult = {
  tablesExist: boolean;
  canRead: boolean;
  canWrite: boolean;
  isAuthenticated: boolean;
  bucketExists: boolean;
  errors: string[];
};

export async function runDiagnostics(): Promise<DiagResult> {
  const result: DiagResult = {
    tablesExist: false,
    canRead: false,
    canWrite: false,
    isAuthenticated: false,
    bucketExists: false,
    errors: [],
  };
  if (!supabase) { result.errors.push("Supabase no configurado"); return result; }

  // Auth check
  try {
    const { data } = await supabase.auth.getUser();
    result.isAuthenticated = !!data.user;
  } catch { result.errors.push("No se pudo verificar autenticación"); }

  // Read check
  try {
    const { data, error } = await supabase.from("categories").select("slug").limit(1);
    if (error) { result.errors.push(`Lectura categories: ${error.message}`); }
    else { result.tablesExist = true; result.canRead = true; void data; }
  } catch (e) { result.errors.push(`Lectura exception: ${e}`); }

  // Write check (upsert a test row then delete)
  if (result.tablesExist) {
    try {
      const testSlug = "__diag_test__";
      const { error: upsertErr } = await supabase.from("categories").upsert(
        { slug: testSlug, name: "test", description: "", longDescription: "",
          color: "", accent: "", count: 0, image: "", iconPath: "" },
        { onConflict: "slug" }
      );
      if (upsertErr) {
        result.errors.push(`Escritura categories: ${upsertErr.message} (code: ${upsertErr.code})`);
      } else {
        await supabase.from("categories").delete().eq("slug", testSlug);
        result.canWrite = true;
      }
    } catch (e) { result.errors.push(`Escritura exception: ${e}`); }
  }

  // Storage bucket check
  try {
    const { data } = await supabase.storage.getBucket(BUCKET);
    result.bucketExists = !!data;
  } catch { /* bucket may not exist yet */ }

  return result;
}

// ─── Fetch all ─────────────────────────────────────────────────────
export async function fetchAll(): Promise<StoreData | null> {
  if (!supabase) return null;
  try {
    const [catsRes, srvRes, metaRes] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("services").select("*").order("name"),
      supabase.from("site_meta").select("*").limit(1).maybeSingle(),
    ]);

    if (catsRes.error) throw catsRes.error;
    if (srvRes.error) throw srvRes.error;

    const categories = (catsRes.data || []) as Category[];
    const services   = (srvRes.data  || []) as Service[];
    const meta       = (metaRes.data?.data as SiteMeta) || null;

    if (!meta && categories.length === 0) return null;

    return {
      categories,
      services,
      meta: meta || ({
        siteName: "ExploraPucón", tagline: "Aventura · Naturaleza",
        phone: "", email: "", address: "", whatsapp: "",
      } as SiteMeta),
    };
  } catch (err) {
    const e = classify(err);
    console.error("[Supabase fetchAll]", e.code, e.message, e.raw);
    throw e;
  }
}

// ─── Categories ────────────────────────────────────────────────────
export async function upsertCategory(c: Category) {
  if (!supabase) return;
  await ensureAuth();
  const { error } = await supabase.from("categories").upsert(c, { onConflict: "slug" });
  if (error) {
    console.error("[upsertCategory RAW]", JSON.stringify(error, null, 2));
    const e = classify(error);
    throw e;
  }
}

export async function deleteCategoryRow(slug: string) {
  if (!supabase) return;
  await ensureAuth();
  await supabase.from("services").delete().eq("category", slug);
  const { error } = await supabase.from("categories").delete().eq("slug", slug);
  if (error) { const e = classify(error); console.error("[deleteCategoryRow]", e); throw e; }
}

// ─── Services ──────────────────────────────────────────────────────
export async function upsertService(s: Service) {
  if (!supabase) return;
  await ensureAuth();
  const { error } = await supabase.from("services").upsert(s, { onConflict: "slug" });
  if (error) {
    // Log full raw error so we can see it in console
    console.error("[upsertService RAW]", JSON.stringify(error, null, 2));
    const e = classify(error);
    console.error("[upsertService classified]", e);
    throw e;
  }
}

export async function deleteServiceRow(slug: string) {
  if (!supabase) return;
  await ensureAuth();
  const { error } = await supabase.from("services").delete().eq("slug", slug);
  if (error) { const e = classify(error); console.error("[deleteServiceRow]", e); throw e; }
}

// ─── Meta ──────────────────────────────────────────────────────────
export async function upsertMeta(meta: SiteMeta) {
  if (!supabase) return;
  await ensureAuth();
  const { error } = await supabase.from("site_meta").upsert({ id: 1, data: meta });
  if (error) {
    console.error("[upsertMeta RAW]", JSON.stringify(error, null, 2));
    const e = classify(error);
    throw e;
  }
}

// ─── Auth helpers ──────────────────────────────────────────────────
async function ensureAuth() {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw classify({ message: "No hay sesión activa. Inicia sesión nuevamente." });
  }
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase no configurado");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw classify(error);
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

// ─── Storage ───────────────────────────────────────────────────────
export async function uploadImage(file: File, folder = "uploads"): Promise<string | null> {
  if (!supabase) return null;
  const ext  = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) { console.error("[uploadImage]", classify(error)); throw classify(error); }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ─── Seed ──────────────────────────────────────────────────────────
export async function seedDatabase(data: StoreData): Promise<{ ok: number; errors: string[] }> {
  if (!supabase) throw new Error("Supabase no configurado");

  let ok = 0;
  const errors: string[] = [];

  // 1. Meta first
  try {
    const { error } = await supabase.from("site_meta").upsert({ id: 1, data: data.meta });
    if (error) errors.push(`Meta: ${classify(error).message}`);
    else ok++;
  } catch (e) { errors.push(`Meta excepción: ${e}`); }

  // 2. Categories
  for (const c of data.categories) {
    try {
      const { error } = await supabase.from("categories").upsert(c, { onConflict: "slug" });
      if (error) errors.push(`Cat "${c.name}": ${classify(error).message}`);
      else ok++;
    } catch (e) { errors.push(`Cat "${c.name}" exc: ${e}`); }
  }

  // 3. Services
  for (const s of data.services) {
    try {
      const { error } = await supabase.from("services").upsert(s, { onConflict: "slug" });
      if (error) errors.push(`Srv "${s.name}": ${classify(error).message}`);
      else ok++;
    } catch (e) { errors.push(`Srv "${s.name}" exc: ${e}`); }
  }

  return { ok, errors };
}

export { isSupabaseConfigured };
