import { useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, setSupabaseCredentials, clearSupabaseCredentials, getSupabaseUrl } from "../../lib/supabase";
import { StoreActions } from "../../data/store";

const SQL = `-- ============================================
-- ExploraPucón · Schema para Supabase
-- ============================================
-- Ejecuta TODO este script en: Supabase Dashboard → SQL Editor → New query

-- 1) Tabla de categorías
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  description text,
  "longDescription" text,
  color text,
  accent text,
  count int default 0,
  image text,
  "iconPath" text,
  created_at timestamptz default now()
);

-- 2) Tabla de servicios
create table if not exists public.services (
  slug text primary key,
  name text not null,
  category text not null references public.categories(slug) on delete cascade,
  type text,
  "shortDesc" text,
  description text,
  image text,
  gallery jsonb default '[]'::jsonb,
  price numeric,
  "priceUnit" text,
  features jsonb default '[]'::jsonb,
  rating numeric default 4.5,
  reviews int default 0,
  duration text,
  level text,
  capacity text,
  location text,
  phone text,
  badge text,
  highlights jsonb default '[]'::jsonb,
  includes jsonb default '[]'::jsonb,
  published boolean default true,
  agency jsonb,
  created_at timestamptz default now()
);

-- 3) Tabla de meta del sitio (single row)
create table if not exists public.site_meta (
  id int primary key default 1,
  data jsonb not null,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 4) Habilitar Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.site_meta enable row level security;

-- 5) Políticas: lectura pública (todos pueden ver el sitio)
drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);

drop policy if exists "Public read services" on public.services;
create policy "Public read services" on public.services for select using (true);

drop policy if exists "Public read meta" on public.site_meta;
create policy "Public read meta" on public.site_meta for select using (true);

-- 6) Políticas: escritura sólo para usuarios autenticados (admins)
drop policy if exists "Auth write categories" on public.categories;
create policy "Auth write categories" on public.categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write services" on public.services;
create policy "Auth write services" on public.services for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Auth write meta" on public.site_meta;
create policy "Auth write meta" on public.site_meta for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 7) Bucket de Storage para imágenes
insert into storage.buckets (id, name, public)
values ('explorapucon', 'explorapucon', true)
on conflict (id) do nothing;

drop policy if exists "Public read images" on storage.objects;
create policy "Public read images" on storage.objects for select
  using (bucket_id = 'explorapucon');

drop policy if exists "Auth upload images" on storage.objects;
create policy "Auth upload images" on storage.objects for insert
  with check (bucket_id = 'explorapucon' and auth.role() = 'authenticated');

drop policy if exists "Auth update images" on storage.objects;
create policy "Auth update images" on storage.objects for update
  using (bucket_id = 'explorapucon' and auth.role() = 'authenticated');

drop policy if exists "Auth delete images" on storage.objects;
create policy "Auth delete images" on storage.objects for delete
  using (bucket_id = 'explorapucon' and auth.role() = 'authenticated');

-- ✅ Listo!
`;

export default function AdminSupabase() {
  const [url, setUrl] = useState(getSupabaseUrl() || "https://djaahxxvfwnfzrhtdfce.supabase.co");
  const [key, setKey] = useState("");
  const [step, setStep] = useState(1);
  const [seedMsg, setSeedMsg] = useState("");
  const [seeding, setSeeding] = useState(false);

  const copySQL = () => {
    navigator.clipboard.writeText(SQL);
    alert("✓ SQL copiado al portapapeles");
  };

  const saveCredentials = () => {
    if (!url || !key) {
      alert("Ingresa la URL y la Anon Key");
      return;
    }
    if (!url.startsWith("https://") || !url.includes("supabase.co")) {
      alert("URL inválida. Debe ser https://xxxxx.supabase.co");
      return;
    }
    setSupabaseCredentials(url, key);
  };

  const seedNow = async () => {
    setSeeding(true);
    setSeedMsg("Subiendo datos demo a Supabase...");
    try {
      const { seedDatabase } = await import("../../data/api");
      const dataJson = StoreActions.exportJSON();
      await seedDatabase(JSON.parse(dataJson));
      setSeedMsg("✅ Datos cargados correctamente. Recarga el sitio público para verlos.");
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : "Error desconocido";
      setSeedMsg("❌ Error: " + m);
    } finally {
      setSeeding(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Configuración Supabase</h1>
        <p className="text-slate-500 mt-1">
          Conecta tu plataforma a una base de datos real para CMS multi-usuario
        </p>
      </div>

      {isSupabaseConfigured ? (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">✅</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Supabase está conectado</h2>
              <p className="text-emerald-100 text-sm mt-1">
                URL: <code className="bg-white/15 px-2 py-0.5 rounded text-xs">{getSupabaseUrl()}</code>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={seedNow}
                  disabled={seeding}
                  className="rounded-lg bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-4 py-2 text-sm disabled:opacity-60"
                >
                  {seeding ? "Subiendo..." : "📤 Subir datos actuales a Supabase"}
                </button>
                <button
                  onClick={() => { if (confirm("¿Desconectar Supabase? Volverás al modo localStorage.")) clearSupabaseCredentials(); }}
                  className="rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 font-semibold px-4 py-2 text-sm"
                >
                  Desconectar
                </button>
              </div>
              {seedMsg && <div className="mt-3 text-sm bg-white/15 px-3 py-2 rounded-lg">{seedMsg}</div>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <strong>Sin Supabase, los datos solo viven en tu navegador.</strong>
              <p className="text-sm mt-1">Sigue los pasos abajo para que el admin sea CMS real con DB compartida y auth de verdad.</p>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-4">
        {/* Step 1 */}
        <Step
          n={1}
          title="Crear cuenta gratis en Supabase"
          open={step === 1}
          onClick={() => setStep(1)}
          done={step > 1}
        >
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>Entra a <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold underline">supabase.com/dashboard</a> y crea una cuenta (gratis, con GitHub).</li>
            <li>Click en <strong>"New Project"</strong>.</li>
            <li>Elige nombre (ej: <code className="bg-slate-100 px-1.5 py-0.5 rounded">explorapucon</code>), región <strong>South America (São Paulo)</strong> y crea una password segura para el DB.</li>
            <li>Espera 1-2 minutos a que se aprovisione tu proyecto.</li>
          </ol>
          <button onClick={() => setStep(2)} className="mt-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 text-sm">
            Listo, siguiente paso →
          </button>
        </Step>

        {/* Step 2 */}
        <Step
          n={2}
          title="Crear las tablas (SQL)"
          open={step === 2}
          onClick={() => setStep(2)}
          done={step > 2}
        >
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside mb-4">
            <li>En tu proyecto, sidebar izquierdo → <strong>SQL Editor</strong> → <strong>"+ New query"</strong>.</li>
            <li>Pega el script SQL completo que está abajo.</li>
            <li>Click en <strong>"Run"</strong> (botón verde abajo a la derecha).</li>
            <li>Verás el mensaje "Success. No rows returned" ✅</li>
          </ol>
          <div className="relative">
            <button
              onClick={copySQL}
              className="absolute top-3 right-3 z-10 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5"
            >
              📋 Copiar SQL
            </button>
            <pre className="bg-slate-900 text-emerald-300 text-[11px] rounded-xl p-4 overflow-auto max-h-80 font-mono">
              <code>{SQL}</code>
            </pre>
          </div>
          <button onClick={() => setStep(3)} className="mt-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 text-sm">
            Listo, siguiente paso →
          </button>
        </Step>

        {/* Step 3 */}
        <Step
          n={3}
          title="Obtener credenciales API"
          open={step === 3}
          onClick={() => setStep(3)}
          done={step > 3}
        >
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>Sidebar izquierdo → <strong>Project Settings</strong> (engranaje) → <strong>Data API</strong>.</li>
            <li>Copia <strong>"Project URL"</strong> (algo como <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">https://xxxxx.supabase.co</code>).</li>
            <li>Copia la <strong>anon public key</strong> (es una key larga que empieza con <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">eyJ...</code>).</li>
            <li className="text-rose-600">⚠️ <strong>NO uses la "service_role" key</strong>, esa es secreta.</li>
          </ol>
          <button onClick={() => setStep(4)} className="mt-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 text-sm">
            Las tengo, siguiente →
          </button>
        </Step>

        {/* Step 4 */}
        <Step
          n={4}
          title="Conectar la plataforma"
          open={step === 4}
          onClick={() => setStep(4)}
          done={isSupabaseConfigured}
        >
          <p className="text-sm text-slate-600 mb-4">Pega aquí las credenciales que obtuviste en el paso 3:</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} className={`${inputCls} mt-1 font-mono text-xs`} placeholder="https://xxxxx.supabase.co" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Anon Public Key</label>
              <input value={key} onChange={(e) => setKey(e.target.value)} className={`${inputCls} mt-1 font-mono text-xs`} placeholder="eyJhbGc..." />
            </div>
            <button onClick={saveCredentials} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 mt-2">
              Guardar y conectar
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Esto guarda las credenciales en localStorage. Para producción en Vercel, mejor usar variables de entorno (ver paso 6).
            </p>
          </div>
        </Step>

        {/* Step 5 */}
        <Step
          n={5}
          title="Crear usuario admin"
          open={step === 5}
          onClick={() => setStep(5)}
          done={false}
        >
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>En Supabase Dashboard → sidebar izq. → <strong>Authentication</strong> → <strong>Users</strong>.</li>
            <li>Click en <strong>"Add user" → "Create new user"</strong>.</li>
            <li>Pon tu email (ej: <code className="bg-slate-100 px-1.5 py-0.5 rounded">admin@explorapucon.com</code>) y una contraseña fuerte.</li>
            <li>Marca <strong>"Auto Confirm User"</strong> ✅</li>
            <li>Click <strong>"Create user"</strong></li>
            <li>Vuelve a <Link to="/admin/login" className="text-emerald-600 font-semibold underline">/admin/login</Link> e inicia sesión con esas credenciales.</li>
          </ol>
        </Step>

        {/* Step 6 */}
        <Step
          n={6}
          title="Producción · Variables de entorno en Vercel"
          open={step === 6}
          onClick={() => setStep(6)}
          done={false}
        >
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>En Vercel → tu proyecto → <strong>Settings → Environment Variables</strong>.</li>
            <li>Agrega 2 variables:
              <pre className="bg-slate-900 text-emerald-300 text-[11px] rounded-lg p-3 mt-2 font-mono overflow-x-auto">
{`VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...`}
              </pre>
            </li>
            <li>Para todos los environments: <strong>Production, Preview, Development</strong>.</li>
            <li>Click <strong>Save</strong>.</li>
            <li>Ve a la pestaña <strong>"Deployments"</strong> → en el último deploy, menú "..." → <strong>Redeploy</strong>.</li>
            <li>¡Listo! Tu sitio en producción ahora usa Supabase ✅</li>
          </ol>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <strong>Tip de seguridad:</strong> La anon key es pública (es seguro tenerla en el frontend). La protección real viene de las políticas RLS que ya configuraste en el SQL.
          </div>
        </Step>
      </div>
    </div>
  );
}

function Step({ n, title, children, open, onClick, done }: { n: number; title: string; children: React.ReactNode; open: boolean; onClick: () => void; done: boolean }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 transition ${open ? "border-emerald-300" : done ? "border-emerald-100" : "border-slate-100"}`}>
      <button onClick={onClick} className="w-full px-6 py-4 flex items-center gap-4 text-left">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${done ? "bg-emerald-500 text-white" : open ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {done ? "✓" : n}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900">{title}</h3>
        </div>
        <span className={`text-xl text-slate-400 transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-slate-100">{children}</div>}
    </div>
  );
}
