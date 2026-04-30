import { useState } from "react";
import { useStore, StoreActions, Auth } from "../../data/store";
import SiteLogo from "../../components/SiteLogo";

export default function AdminSite() {
  const { meta } = useStore();
  const [form, setForm] = useState(meta);
  const [pwd, setPwd] = useState({ old: "", new: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    StoreActions.saveMeta(form);
    alert("✓ Configuración guardada");
  };

  const changePwd = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.new !== pwd.confirm) { setPwdMsg("Las contraseñas no coinciden"); return; }
    if (Auth.changePassword(pwd.old, pwd.new)) {
      setPwdMsg("✓ Contraseña actualizada");
      setPwd({ old: "", new: "", confirm: "" });
    } else {
      setPwdMsg("Contraseña actual incorrecta o nueva contraseña muy corta");
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm";
  const labelCls = "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block";

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Configuración del sitio</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LOGO */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-4">Logotipo del sitio</h2>
          <p className="text-xs text-slate-500 mb-4">Se muestra en el header, footer y login. Tamaño recomendado: 200×60px, PNG o SVG con fondo transparente.</p>

          <div className="flex items-center gap-6 mb-4">
            <div className="bg-slate-100 rounded-xl p-4 border">
              <SiteLogo size="lg" />
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border">
              <SiteLogo size="lg" light />
            </div>
          </div>

          {form.logo && (
            <div className="mb-4 flex items-center gap-3">
              <img src={form.logo} alt="Logo actual" className="h-12 object-contain" />
              <button
                type="button"
                onClick={() => { const m = { ...form }; delete m.logo; setForm(m); }}
                className="text-xs text-rose-500 font-semibold hover:underline"
              >
                Eliminar logo
              </button>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">URL del logo</label>
              <input
                value={form.logo || ""}
                onChange={(e) => setForm({ ...form, logo: e.target.value || undefined })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">O subir archivo</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    alert("Máximo 2MB");
                    return;
                  }
                  // Try Supabase Storage
                  try {
                    const { isSupabaseConfigured } = await import("../../lib/supabase");
                    if (isSupabaseConfigured) {
                      const { uploadImage } = await import("../../data/api");
                      const url = await uploadImage(file, "logo");
                      if (url) { setForm({ ...form, logo: url }); return; }
                    }
                  } catch {}
                  // Fallback base64
                  const reader = new FileReader();
                  reader.onload = () => setForm({ ...form, logo: reader.result as string });
                  reader.readAsDataURL(file);
                }}
                className="text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-1">PNG, SVG, JPG o WebP. Máximo 2MB.</p>
            </div>
          </div>

          <button
            onClick={() => { StoreActions.saveMeta(form); alert("✓ Logo guardado"); }}
            className="mt-4 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 shadow-lg shadow-emerald-500/30"
          >
            Guardar logo
          </button>
        </div>

        <form onSubmit={save} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-4">Información general</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nombre del sitio</label>
              <input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp (sin +)</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })} className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Dirección</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
            </div>
          </div>
          <button className="mt-6 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 shadow-lg shadow-emerald-500/30">
            Guardar cambios
          </button>
        </form>

        <form onSubmit={changePwd} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-900 mb-4">Cambiar contraseña</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Contraseña actual</label>
              <input type="password" value={pwd.old} onChange={(e) => setPwd({ ...pwd, old: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Nueva contraseña (mín 4 chars)</label>
              <input type="password" value={pwd.new} onChange={(e) => setPwd({ ...pwd, new: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Confirmar nueva contraseña</label>
              <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={inputCls} />
            </div>
            {pwdMsg && (
              <div className={`text-sm ${pwdMsg.startsWith("✓") ? "text-emerald-600" : "text-rose-600"}`}>{pwdMsg}</div>
            )}
            <button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3">
              Cambiar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
