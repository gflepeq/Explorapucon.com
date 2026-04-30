import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  isSupabaseConfigured,
  setSupabaseCredentials,
  clearSupabaseCredentials,
  getSupabaseUrl,
  getSupabaseKeyPreview,
  diagnose,
} from "../../lib/supabase";
import { StoreActions } from "../../data/store";

// ──────────────────────────────────────────
// SQL para crear las tablas en Supabase
// ──────────────────────────────────────────
const SQL = `-- ==============================================
-- ExploraPucón · Script SQL para Supabase
-- Pega TODO esto en SQL Editor → New query → Run
-- ==============================================

-- 1. Tabla categorías
create table if not exists public.categories (
  slug            text primary key,
  name            text not null,
  description     text,
  "longDescription" text,
  color           text,
  accent          text,
  count           int default 0,
  image           text,
  "iconPath"      text,
  created_at      timestamptz default now()
);

-- 2. Tabla servicios
create table if not exists public.services (
  slug         text primary key,
  name         text not null,
  category     text not null references public.categories(slug) on delete cascade,
  type         text,
  "shortDesc"  text,
  description  text,
  image        text,
  gallery      jsonb default '[]'::jsonb,
  price        numeric,
  "priceUnit"  text,
  features     jsonb default '[]'::jsonb,
  rating       numeric default 4.5,
  reviews      int default 0,
  duration     text,
  level        text,
  capacity     text,
  location     text,
  phone        text,
  badge        text,
  highlights   jsonb default '[]'::jsonb,
  includes     jsonb default '[]'::jsonb,
  published    boolean default true,
  agency       jsonb,
  created_at   timestamptz default now()
);

-- 3. Tabla meta del sitio (fila única)
create table if not exists public.site_meta (
  id         int primary key default 1,
  data       jsonb not null,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 4. Activar Row Level Security
alter table public.categories enable row level security;
alter table public.services    enable row level security;
alter table public.site_meta   enable row level security;

-- 5. Políticas de LECTURA pública (visitantes del sitio)
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories
  for select using (true);

drop policy if exists "Public read services" on public.services;
create policy "Public read services" on public.services
  for select using (true);

drop policy if exists "Public read meta" on public.site_meta;
create policy "Public read meta" on public.site_meta
  for select using (true);

-- 6. Políticas de ESCRITURA para admins autenticados
drop policy if exists "Auth write categories" on public.categories;
create policy "Auth write categories" on public.categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write services" on public.services;
create policy "Auth write services" on public.services
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write meta" on public.site_meta;
create policy "Auth write meta" on public.site_meta
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 7. Bucket de Storage para imágenes
insert into storage.buckets (id, name, public)
  values ('explorapucon', 'explorapucon', true)
  on conflict (id) do nothing;

drop policy if exists "Public read images" on storage.objects;
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'explorapucon');

drop policy if exists "Auth upload images" on storage.objects;
create policy "Auth upload images" on storage.objects
  for insert with check (bucket_id = 'explorapucon' and auth.role() = 'authenticated');

drop policy if exists "Auth update images" on storage.objects;
create policy "Auth update images" on storage.objects
  for update using (bucket_id = 'explorapucon' and auth.role() = 'authenticated');

drop policy if exists "Auth delete images" on storage.objects;
create policy "Auth delete images" on storage.objects
  for delete using (bucket_id = 'explorapucon' and auth.role() = 'authenticated');

-- ✅ Completado
`;

// ──────────────────────────────────────────
export default function AdminSupabase() {
  const [url, setUrl]     = useState("");
  const [key, setKey]     = useState("");
  const [step, setStep]   = useState(isSupabaseConfigured ? 0 : 1);
  const [seedMsg, setSeedMsg]     = useState("");
  const [seeding, setSeeding]     = useState(false);
  const [testMsg, setTestMsg]     = useState("");
  const [testing, setTesting]     = useState(false);
  const [diag, setDiag]           = useState(diagnose());
  const [copied, setCopied]       = useState(false);
  const [diagResult, setDiagResult]   = useState<import("../../data/api").DiagResult | null>(null);
  const [diagRunning, setDiagRunning] = useState(false);

  // Live validation as user types
  const urlOk  = url.startsWith("https://") && url.includes(".supabase.co");
  const keyOk  = key.startsWith("eyJ") && key.replace(/\s/g, "").length > 100
               || key.startsWith("sb_publishable_")
               || key.startsWith("sb_secret_");
  const keyLen = key.replace(/\s/g, "").length;

  useEffect(() => { setDiag(diagnose()); }, []);

  // ── helpers ──────────────────────────────
  const copySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("No se pudo copiar. Selecciona el texto manualmente.");
    }
  };

  const testConnection = async () => {
    if (!url || !key) { setTestMsg("❌ Ingresa URL y Anon Key primero"); return; }
    setTesting(true);
    setTestMsg("Probando conexión...");
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const cleanUrl = url.trim().replace(/[\r\n"'`]/g, "");
      const cleanKey = key.trim().replace(/[\r\n"'`\s]/g, "");
      const client   = createClient(cleanUrl, cleanKey);
      const { error } = await client.from("categories").select("count").limit(1);
      if (error) {
        if (error.message.includes("relation") || error.message.includes("does not exist")) {
          setTestMsg("✅ Conexión OK · Pero las tablas aún no existen. Ejecuta primero el SQL (Paso 2).");
        } else {
          setTestMsg(`❌ Error: ${error.message}`);
        }
      } else {
        setTestMsg("✅ Conexión perfecta · Credenciales válidas y tablas encontradas");
      }
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : String(e);
      setTestMsg(`❌ ${m}`);
    } finally {
      setTesting(false);
    }
  };

  const save = () => {
    const cleanUrl = url.trim().replace(/[\r\n"'`]/g, "");
    const cleanKey = key.trim().replace(/[\r\n"'`\s]/g, "");
    setSupabaseCredentials(cleanUrl, cleanKey); // validates internally
  };

  const runDiag = async () => {
    setDiagRunning(true);
    setDiagResult(null);
    try {
      const { runDiagnostics } = await import("../../data/api");
      const r = await runDiagnostics();
      setDiagResult(r);
    } finally {
      setDiagRunning(false);
    }
  };

  const seedNow = async () => {
    setSeeding(true);
    setSeedMsg("⏳ Subiendo datos a Supabase...");
    try {
      const { seedDatabase } = await import("../../data/api");
      const result = await seedDatabase(JSON.parse(StoreActions.exportJSON()));
      if (result.errors.length === 0) {
        setSeedMsg(`✅ ${result.ok} registros cargados correctamente.`);
      } else {
        setSeedMsg(`⚠️ ${result.ok} OK · ${result.errors.length} errores:\n${result.errors.slice(0, 5).join("\n")}`);
      }
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      if (e?.code === "NO_TABLES") {
        setSeedMsg("❌ Las tablas no existen. Ejecuta primero el SQL del Paso 2.");
      } else if (e?.code === "RLS") {
        setSeedMsg("❌ Sin permisos. Asegúrate de estar autenticado como admin en Supabase.");
      } else {
        setSeedMsg("❌ Error: " + (e?.message || String(err)));
      }
    } finally {
      setSeeding(false);
    }
  };

  const ic = "w-full px-4 py-3 rounded-xl border text-sm outline-none font-mono transition focus:ring-2";
  const icOk  = `${ic} border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100 bg-emerald-50/30`;
  const icErr = `${ic} border-rose-300 focus:border-rose-400 focus:ring-rose-100 bg-rose-50/30`;
  const icDef = `${ic} border-slate-200 focus:border-emerald-500 focus:ring-emerald-100`;

  // ── UI ───────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Configuración Supabase</h1>
        <p className="text-slate-500 mt-1">CMS con base de datos real, Auth y Storage de imágenes</p>
      </div>

      {/* Status banner */}
      {isSupabaseConfigured ? (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
                <span className="font-bold text-lg">Supabase conectado</span>
              </div>
              <div className="text-emerald-100 text-xs space-y-0.5">
                <div>URL: <code className="bg-white/20 px-2 py-0.5 rounded">{getSupabaseUrl()}</code></div>
                <div>Key: <code className="bg-white/20 px-2 py-0.5 rounded">{getSupabaseKeyPreview()}</code></div>
                <div>Fuente: <code className="bg-white/20 px-2 py-0.5 rounded">{diag.source}</code></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <button onClick={seedNow} disabled={seeding} className="rounded-lg bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-2 text-sm disabled:opacity-60 whitespace-nowrap">
                {seeding ? "Subiendo..." : "📤 Subir datos a Supabase"}
              </button>
              <button onClick={() => { if (confirm("¿Desconectar Supabase?")) clearSupabaseCredentials(); }} className="rounded-lg bg-white/20 hover:bg-white/30 border border-white/30 font-semibold px-4 py-2 text-sm whitespace-nowrap">
                Desconectar
              </button>
            </div>
          </div>
          {seedMsg && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm whitespace-pre-line ${seedMsg.startsWith("✅") ? "bg-white/20" : "bg-red-500/30 border border-red-300/40"}`}>
              {seedMsg}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <strong className="text-amber-900">Modo demo · Sin Supabase</strong>
              <p className="text-sm text-amber-800 mt-1">Los datos solo se guardan en tu navegador. Sigue los pasos para activar el CMS real.</p>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostics panel — always visible when connected */}
      {isSupabaseConfigured && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">🔍 Diagnóstico de conexión</h2>
            <button
              onClick={runDiag}
              disabled={diagRunning}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 text-sm disabled:opacity-60"
            >
              {diagRunning ? "Probando..." : "▶ Ejecutar diagnóstico"}
            </button>
          </div>

          {diagResult ? (
            <div className="space-y-2">
              <DiagRow label="Tablas existen" ok={diagResult.tablesExist} value={diagResult.tablesExist ? "✅ Sí" : "❌ No — ejecuta el SQL"} />
              <DiagRow label="Lectura (SELECT)" ok={diagResult.canRead} value={diagResult.canRead ? "✅ OK" : "❌ Falla"} />
              <DiagRow label="Escritura (INSERT)" ok={diagResult.canWrite} value={diagResult.canWrite ? "✅ OK" : "❌ Falla — verifica RLS o sesión"} />
              <DiagRow label="Autenticado" ok={diagResult.isAuthenticated} value={diagResult.isAuthenticated ? "✅ Sí" : "⚠️ No — escribe como anon"} />
              <DiagRow label="Bucket Storage" ok={diagResult.bucketExists} value={diagResult.bucketExists ? "✅ Existe" : "⚠️ No existe — imágenes no subirán"} />
              {diagResult.errors.length > 0 && (
                <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <div className="text-xs font-bold text-rose-800 mb-1">Errores detectados:</div>
                  {diagResult.errors.map((e, i) => (
                    <div key={i} className="text-xs text-rose-700 font-mono mt-0.5">{e}</div>
                  ))}
                </div>
              )}
              {!diagResult.tablesExist && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                  <strong>📋 Solución:</strong> Ve a <a href={`https://supabase.com/dashboard/project/djaahxxvfwnfzrhtdfce/sql/new`} target="_blank" rel="noopener noreferrer" className="underline font-bold">Supabase SQL Editor</a>, copia el SQL del Paso 2 y ejecuta Run.
                </div>
              )}
              {diagResult.tablesExist && !diagResult.canWrite && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                  <strong>🔐 Solución escritura:</strong> El problema es de RLS o sesión. Prueba:<br/>
                  1. <a href="/#/admin/login" className="underline font-semibold">Cerrar sesión y volver a entrar</a><br/>
                  2. En Supabase SQL Editor, ejecuta:<br/>
                  <code className="block mt-1 bg-white px-2 py-1 rounded text-xs font-mono">
                    alter table public.services disable row level security;{"\n"}
                    alter table public.categories disable row level security;{"\n"}
                    alter table public.site_meta disable row level security;
                  </code>
                  <span className="text-xs text-amber-700 mt-1 block">(Solo como prueba temporal. Luego vuelve a habilitarlo con las policies correctas.)</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500 text-center py-6">
              Haz click en <strong>"▶ Ejecutar diagnóstico"</strong> para verificar que todo esté funcionando correctamente.
            </div>
          )}
        </div>
      )}

      {/* Diagnostics — credentials issue */}
      {!isSupabaseConfigured && (diag.source !== "none") && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-sm">
          <h3 className="font-bold text-rose-900 mb-3">🔍 Diagnóstico de credenciales guardadas</h3>
          <div className="space-y-2 font-mono text-xs">
            <DiagRow label="URL guardada" value={diag.url || "(vacía)"} ok={diag.urlValid} />
            <DiagRow label="Key guardada" value={diag.keyPreview} ok={diag.keyValid} />
            <DiagRow label="Fuente" value={diag.source} ok={true} />
          </div>
          <div className="mt-3 p-3 bg-rose-100 rounded-lg text-rose-800 text-xs leading-relaxed">
            <strong>Causas comunes del error "Invalid API key":</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Se pegó con espacios o saltos de línea al inicio/final</li>
              <li>Se usó la <strong>service_role / sb_secret_</strong> en vez de la <strong>anon / sb_publishable_</strong></li>
              <li>Se copió incompleta</li>
              <li>Se usó la key de otro proyecto</li>
            </ul>
          </div>
          <button onClick={clearSupabaseCredentials} className="mt-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 text-xs">
            🗑 Borrar credenciales guardadas e ingresar de nuevo
          </button>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">

        {/* PASO 1 */}
        <Accordion n={1} title="Crear proyecto en Supabase" done open={step === 1} onToggle={() => setStep(step === 1 ? 0 : 1)}>
          <p className="text-sm text-slate-600">Ya completaste este paso ✅ — tu proyecto se llama <strong>Explorapucon.com</strong>.</p>
        </Accordion>

        {/* PASO 2 */}
        <Accordion n={2} title="Ejecutar SQL para crear las tablas" done={false} open={step === 2} onToggle={() => setStep(step === 2 ? 0 : 2)}>
          <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1.5 mb-4">
            <li>En tu proyecto Supabase → sidebar → <strong>SQL Editor</strong> → <strong>+ New query</strong></li>
            <li>Click en <strong>"📋 Copiar SQL"</strong> abajo → pega en el editor → click <strong>Run</strong></li>
            <li>Debe aparecer <strong>"Success. No rows returned"</strong> ✅</li>
          </ol>
          <div className="relative rounded-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
              <span className="text-xs text-slate-400 font-mono">SQL · ExploraPucón schema</span>
              <button onClick={copySQL} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${copied ? "bg-emerald-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                {copied ? "✓ Copiado!" : "📋 Copiar SQL"}
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-300 text-[10px] p-4 overflow-auto max-h-64 font-mono leading-relaxed">
              <code>{SQL}</code>
            </pre>
          </div>
        </Accordion>

        {/* PASO 3 */}
        <Accordion n={3} title="Obtener URL y Anon Key de tu proyecto" done={false} open={step === 3} onToggle={() => setStep(step === 3 ? 0 : 3)}>
          <ol className="text-sm text-slate-700 list-decimal list-inside space-y-2 mb-3">
            <li>En tu proyecto Supabase → sidebar izquierdo → ⚙️ <strong>Project Settings</strong></li>
            <li>Click en <strong>Data API</strong> (o "API" en versiones anteriores)</li>
            <li>Copia la <strong>Project URL</strong> — ej: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">https://abcdefgh.supabase.co</code></li>
            <li>Copia la <strong>anon</strong> / <strong>public</strong> key (empieza con <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">eyJ...</code>)</li>
          </ol>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800">
            ⛔ <strong>NO uses la "service_role" / "sb_secret_" key</strong> — esa es secreta. La que necesitas es la <strong>anon / publishable</strong>.
          </div>
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-900">
            <strong>✅ Formatos válidos de la Anon Key:</strong>
            <ul className="mt-1.5 space-y-1 font-mono text-xs">
              <li>🆕 <code className="bg-white px-1.5 py-0.5 rounded">sb_publishable_XXXXXXXXXXXX</code> <span className="font-sans text-emerald-700">(proyectos nuevos 2024+)</span></li>
              <li>📦 <code className="bg-white px-1.5 py-0.5 rounded">eyJhbGciOiJIUzI1NiIs...</code> <span className="font-sans text-emerald-700">(proyectos anteriores)</span></li>
            </ul>
          </div>
        </Accordion>

        {/* PASO 4 — CONECTAR */}
        <Accordion n={4} title="Conectar la plataforma con Supabase" done={isSupabaseConfigured} open={step === 4} onToggle={() => setStep(step === 4 ? 0 : 4)}>
          <div className="space-y-4">

            {/* URL */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                Project URL
                {url && (urlOk
                  ? <span className="text-emerald-600 font-bold">✓ Válida</span>
                  : <span className="text-rose-500">✗ Debe ser https://xxx.supabase.co</span>
                )}
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`mt-1.5 ${url ? (urlOk ? icOk : icErr) : icDef}`}
                placeholder="https://abcdefghijklmnop.supabase.co"
              />
            </div>

            {/* KEY */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                Anon Public Key
                {key && (keyOk
                  ? <span className="text-emerald-600 font-bold">✓ Válida</span>
                  : <span className="text-rose-500">✗ Formato inválido ({keyLen} chars)</span>
                )}
              </label>
              <textarea
                value={key}
                onChange={(e) => setKey(e.target.value)}
                rows={3}
                className={`mt-1.5 ${key ? (keyOk ? icOk : icErr) : icDef} resize-none`}
                placeholder="sb_publishable_xxxxxxxx  o  eyJhbGciOi..."
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Pega la key completa. Si se pegó en varias líneas no hay problema, se limpiará automáticamente.
              </p>
            </div>

            {/* Test button */}
            <button
              type="button"
              onClick={testConnection}
              disabled={testing || !url || !key}
              className="w-full rounded-xl border-2 border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 font-semibold py-3 text-sm transition disabled:opacity-40"
            >
              {testing ? "Probando..." : "🔌 Probar conexión antes de guardar"}
            </button>

            {testMsg && (
              <div className={`rounded-xl px-4 py-3 text-sm font-medium ${testMsg.startsWith("✅") ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"}`}>
                {testMsg}
              </div>
            )}

            {/* Save */}
            <button
              onClick={save}
              disabled={!urlOk || !keyOk}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 transition shadow-lg shadow-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {urlOk && keyOk ? "✓ Guardar credenciales y conectar" : "Completa los campos correctamente"}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Las credenciales se guardan en tu navegador. Para producción usa variables de entorno en Vercel (Paso 6).
            </p>
          </div>
        </Accordion>

        {/* PASO 5 */}
        <Accordion n={5} title="Crear usuario admin (login real)" done={false} open={step === 5} onToggle={() => setStep(step === 5 ? 0 : 5)}>
          <ol className="text-sm text-slate-700 list-decimal list-inside space-y-2">
            <li>En Supabase → sidebar → <strong>Authentication</strong> → <strong>Users</strong></li>
            <li>Click <strong>"Add user"</strong> → <strong>"Create new user"</strong></li>
            <li>Email: <code className="bg-slate-100 px-2 py-0.5 rounded">motionbrandcl@gmail.com</code> (o el que prefieras)</li>
            <li>Contraseña: una segura (diferente a la de tu cuenta Supabase)</li>
            <li>✅ Marca <strong>"Auto Confirm User"</strong></li>
            <li>Click <strong>"Create user"</strong></li>
            <li>Luego ve a <Link to="/admin/login" className="text-emerald-600 font-semibold underline">Admin Login</Link> e ingresa con esas credenciales</li>
          </ol>
        </Accordion>

        {/* PASO 6 */}
        <Accordion n={6} title="Variables de entorno en Vercel (producción)" done={false} open={step === 6} onToggle={() => setStep(step === 6 ? 0 : 6)}>
          <ol className="text-sm text-slate-700 list-decimal list-inside space-y-2 mb-4">
            <li>En Vercel → tu proyecto → <strong>Settings → Environment Variables</strong></li>
            <li>Agrega estas 2 variables (para Production + Preview + Development):</li>
          </ol>
          <div className="relative bg-slate-900 rounded-xl p-4 mb-4">
            <pre className="text-emerald-300 text-xs font-mono leading-relaxed">{`VITE_SUPABASE_URL       = ${getSupabaseUrl() || "https://xxxxxxxx.supabase.co"}
VITE_SUPABASE_ANON_KEY  = eyJhbGc...`}</pre>
          </div>
          <ol start={3} className="text-sm text-slate-700 list-decimal list-inside space-y-2">
            <li>Click <strong>Save</strong></li>
            <li>Ve a <strong>Deployments</strong> → menú "..." → <strong>Redeploy</strong></li>
            <li>✅ Tu sitio en producción ahora usa Supabase para todos</li>
          </ol>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-900">
            💡 Con las variables de entorno, <strong>no necesitas</strong> guardar las credenciales en el navegador. Las variables se compilan en el bundle al hacer build.
          </div>
        </Accordion>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────
function Accordion({ n, title, done, open, onToggle, children }: {
  n: number; title: string; done: boolean; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border-2 transition-colors ${open ? "border-emerald-300 shadow-md" : done ? "border-emerald-100" : "border-slate-100"}`}>
      <button onClick={onToggle} className="w-full px-6 py-4 flex items-center gap-4 text-left">
        <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${done ? "bg-emerald-500 text-white" : open ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {done ? "✓" : n}
        </div>
        <span className={`flex-1 font-bold ${open ? "text-emerald-700" : "text-slate-900"}`}>{title}</span>
        <span className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}

function DiagRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span className={ok ? "text-emerald-600" : "text-rose-500"}>{ok ? "✓" : "✗"}</span>
      <span className="text-slate-500 w-28 flex-shrink-0">{label}:</span>
      <span className="text-slate-800 break-all">{value}</span>
    </div>
  );
}
