import { useState, useRef } from "react";
import { useStore, StoreActions, Auth, useMeta } from "../../data/store";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function AdminSite() {
  const { meta } = useStore();
  const currentMeta = useMeta();
  const [form, setForm] = useState(currentMeta);
  const [saved, setSaved] = useState(false);
  const [pwd, setPwd] = useState({ old: "", new: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    StoreActions.saveMeta(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.new !== pwd.confirm) { setPwdMsg("Las contraseñas no coinciden"); return; }
    if (Auth.changePassword(pwd.old, pwd.new)) {
      setPwdMsg("✓ Contraseña actualizada");
      setPwd({ old: "", new: "", confirm: "" });
    } else {
      setPwdMsg("Contraseña actual incorrecta o nueva muy corta");
    }
    setTimeout(() => setPwdMsg(""), 4000);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "favicon"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      // Try Supabase Storage first
      if (isSupabaseConfigured) {
        const { uploadImage } = await import("../../data/api");
        const url = await uploadImage(file, field === "logo" ? "logos" : "favicons");
        if (url) {
          setForm((f) => ({ ...f, [field]: url }));
          setUploading(null);
          return;
        }
      }
      // Fallback: base64
      if (file.size > 2 * 1024 * 1024) {
        alert("Archivo muy grande (máx 2MB). Conecta Supabase para archivos más grandes.");
        setUploading(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setForm((f) => ({ ...f, [field]: reader.result as string }));
        setUploading(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploading(null);
    }
  };

  const ic = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm";
  const lc = "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Configuración del sitio</h1>
        <p className="text-slate-500 mt-1">Personaliza el logo, nombre y datos de contacto</p>
      </div>

      {/* ── LOGO ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-bold text-slate-900 text-lg mb-1">🖼️ Logo del sitio</h2>
        <p className="text-sm text-slate-500 mb-5">
          Sube tu logo en PNG, JPG o SVG. Se mostrará en el Header y Footer.
          Fondo transparente (PNG) recomendado.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo principal */}
          <div>
            <label className={lc}>Logo principal</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-emerald-300 transition">
              {form.logo ? (
                <div className="w-full">
                  {/* Preview en fondo claro */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-center mb-2" style={{ minHeight: 80 }}>
                    <img
                      src={form.logo}
                      alt="Logo preview"
                      style={{ maxWidth: form.logoWidth || 200, maxHeight: 80 }}
                      className="object-contain"
                    />
                  </div>
                  {/* Preview en fondo oscuro */}
                  <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-center mb-3">
                    <img
                      src={form.logo}
                      alt="Logo en oscuro"
                      style={{ maxWidth: form.logoWidth || 200, maxHeight: 80 }}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => logoRef.current?.click()}
                      className="flex-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 py-2 font-semibold"
                    >
                      {uploading === "logo" ? "⏳ Subiendo..." : "🔄 Cambiar logo"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, logo: undefined }))}
                      className="text-xs rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-2 font-semibold"
                    >
                      ✕ Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-3xl">
                    🖼️
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">Arrastra tu logo aquí</p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, SVG · Max 2MB</p>
                    <p className="text-xs text-emerald-600 mt-0.5">PNG con fondo transparente recomendado</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => logoRef.current?.click()}
                    className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 text-sm transition"
                  >
                    {uploading === "logo" ? "⏳ Subiendo..." : "Seleccionar archivo"}
                  </button>
                </>
              )}
              <input
                ref={logoRef}
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "logo")}
              />
            </div>

            {/* Logo URL manual */}
            <div className="mt-3">
              <label className={lc}>O pega una URL de imagen</label>
              <input
                value={form.logo || ""}
                onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value || undefined }))}
                className={ic}
                placeholder="https://tu-sitio.com/logo.png"
              />
            </div>

            {/* Width */}
            <div className="mt-3">
              <label className={lc}>Ancho del logo en header (px)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={60}
                  max={280}
                  value={form.logoWidth || 140}
                  onChange={(e) => setForm((f) => ({ ...f, logoWidth: Number(e.target.value) }))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="text-sm font-bold text-slate-700 w-12 text-right">
                  {form.logoWidth || 140}px
                </span>
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div>
            <label className={lc}>Favicon (ícono del navegador)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-emerald-300 transition">
              {form.favicon ? (
                <div className="text-center">
                  <div className="bg-white border rounded-xl p-4 flex items-center justify-center gap-3 mb-3">
                    <img src={form.favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                    <img src={form.favicon} alt="Favicon 16px" className="h-4 w-4 object-contain opacity-75" />
                    <span className="text-xs text-slate-400">16px · 32px</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => faviconRef.current?.click()}
                      className="flex-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 py-2 font-semibold"
                    >
                      {uploading === "favicon" ? "⏳ Subiendo..." : "🔄 Cambiar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, favicon: undefined }))}
                      className="text-xs rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-2 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-3xl">
                    🌐
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">Favicon del sitio</p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG cuadrado · 32×32 o 512×512</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Aparece en la pestaña del navegador</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => faviconRef.current?.click()}
                    className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2 text-sm transition"
                  >
                    {uploading === "favicon" ? "⏳ Subiendo..." : "Seleccionar archivo"}
                  </button>
                </>
              )}
              <input
                ref={faviconRef}
                type="file"
                accept="image/png,image/jpeg,image/ico,image/svg+xml"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "favicon")}
              />
            </div>

            {/* Favicon URL */}
            <div className="mt-3">
              <label className={lc}>O pega URL del favicon</label>
              <input
                value={form.favicon || ""}
                onChange={(e) => setForm((f) => ({ ...f, favicon: e.target.value || undefined }))}
                className={ic}
                placeholder="https://tu-sitio.com/favicon.png"
              />
            </div>

            {/* Preview box */}
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Preview pestaña navegador</div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700">
                {form.favicon
                  ? <img src={form.favicon} alt="" className="h-4 w-4" />
                  : <span>🌐</span>
                }
                <span className="truncate">{form.siteName || "ExploraPucón"} | Tours y Aventuras en Pucón</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guardar logo */}
        <form onSubmit={handleSave} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 transition shadow-lg shadow-emerald-500/30"
          >
            {saved ? "✓ Logo guardado" : "Guardar logo"}
          </button>
        </form>
      </div>

      {/* ── INFO GENERAL ─────────────────────────── */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-bold text-slate-900 text-lg mb-5">📋 Información general</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={lc}>Nombre del sitio</label>
              <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className={ic} />
            </div>
            <div>
              <label className={lc}>Tagline / slogan</label>
              <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={ic} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={lc}>Teléfono</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={ic} />
            </div>
            <div>
              <label className={lc}>WhatsApp (sin +, sin espacios)</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })} className={`${ic} font-mono`} />
            </div>
          </div>
          <div>
            <label className={lc}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={ic} />
          </div>
          <div>
            <label className={lc}>Dirección</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={ic} />
          </div>
        </div>
        <button type="submit" className="mt-6 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 shadow-lg shadow-emerald-500/30">
          {saved ? "✓ Guardado" : "Guardar información"}
        </button>
      </form>

      {/* ── CONTRASEÑA ───────────────────────────── */}
      {!isSupabaseConfigured && (
        <form onSubmit={handleChangePwd} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg mb-5">🔑 Cambiar contraseña demo</h2>
          <div className="space-y-4">
            <div>
              <label className={lc}>Contraseña actual</label>
              <input type="password" value={pwd.old} onChange={(e) => setPwd({ ...pwd, old: e.target.value })} className={ic} />
            </div>
            <div>
              <label className={lc}>Nueva contraseña (mín 4 chars)</label>
              <input type="password" value={pwd.new} onChange={(e) => setPwd({ ...pwd, new: e.target.value })} className={ic} />
            </div>
            <div>
              <label className={lc}>Confirmar nueva contraseña</label>
              <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={ic} />
            </div>
            {pwdMsg && (
              <div className={`text-sm font-semibold px-4 py-2 rounded-lg ${pwdMsg.startsWith("✓") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {pwdMsg}
              </div>
            )}
            <button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5">
              Cambiar contraseña
            </button>
          </div>
        </form>
      )}

      {isSupabaseConfigured && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
          <strong>🔑 Gestión de contraseñas con Supabase:</strong>
          <p className="mt-1">Cambia la contraseña del admin en <a href="https://supabase.com/dashboard/project/djaahxxvfwnfzrhtdfce/auth/users" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Supabase → Authentication → Users</a> → menú "..." junto al usuario → "Send password recovery".</p>
        </div>
      )}

      {/* ── Meta no actualizado aviso ────────────── */}
      {JSON.stringify(form) !== JSON.stringify(meta) && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-yellow-400">●</span>
          <span className="text-sm font-medium">Tienes cambios sin guardar</span>
          <button
            onClick={handleSave as unknown as React.MouseEventHandler}
            className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-bold"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
