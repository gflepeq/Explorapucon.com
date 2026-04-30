import { useRef, useState } from "react";
import { StoreActions } from "../../data/store";

export default function AdminPublish() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const exportData = () => {
    const json = StoreActions.exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `explorapucon-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const txt = reader.result as string;
      if (StoreActions.importJSON(txt)) {
        setMsg("✓ Datos importados correctamente");
      } else {
        setMsg("✗ Archivo inválido");
      }
      setTimeout(() => setMsg(""), 4000);
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (confirm("¿Restaurar a los datos demo iniciales? Perderás todos tus cambios.")) {
      StoreActions.resetToSeed();
      setMsg("✓ Datos restaurados a demo");
      setTimeout(() => setMsg(""), 4000);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Publicar y respaldar</h1>
      <p className="text-slate-500 mb-8">Gestiona tus datos y publica tu sitio en internet</p>

      {msg && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${msg.startsWith("✓") ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {msg}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Backup */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="text-3xl mb-3">💾</div>
          <h2 className="font-bold text-slate-900 mb-2">Respaldo de datos</h2>
          <p className="text-sm text-slate-600 mb-4">
            Descarga un archivo JSON con todos tus servicios, categorías y configuración.
            Importante para mover los datos entre dispositivos o publicar.
          </p>
          <div className="flex gap-2">
            <button onClick={exportData} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 text-sm">
              ⬇ Descargar backup
            </button>
            <button onClick={() => fileRef.current?.click()} className="rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold px-4 py-2.5 text-sm">
              ⬆ Importar JSON
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={importData} className="hidden" />
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="text-3xl mb-3">🔄</div>
          <h2 className="font-bold text-slate-900 mb-2">Restaurar demo</h2>
          <p className="text-sm text-slate-600 mb-4">
            Si quieres empezar de cero o ver los datos demo iniciales, puedes restaurar
            todo a la versión inicial. Tus cambios se perderán.
          </p>
          <button onClick={reset} className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2.5 text-sm">
            Restaurar a datos demo
          </button>
        </div>
      </div>

      {/* Publishing guide */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚀</span>
          <h2 className="text-2xl font-bold">Cómo publicar tu sitio en internet</h2>
        </div>
        <p className="text-emerald-100 mb-6">
          Tu sitio está construido como una SPA (single-page app). Tienes 3 formas de publicarlo:
        </p>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold mb-2">Opción 1 · Vercel (recomendado)</h3>
            <ol className="text-sm space-y-1 text-emerald-50 list-decimal list-inside">
              <li>Sube el código a GitHub</li>
              <li>Conecta el repo en <a href="https://vercel.com" target="_blank" className="underline">vercel.com</a></li>
              <li>Vercel detecta Vite y publica automáticamente</li>
              <li>Tu sitio queda en <code className="text-xs">tu-app.vercel.app</code></li>
              <li>Conecta dominio explorapucon.com</li>
            </ol>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-bold mb-2">Opción 2 · Netlify</h3>
            <ol className="text-sm space-y-1 text-emerald-50 list-decimal list-inside">
              <li>Ejecuta <code className="text-xs">npm run build</code></li>
              <li>Arrastra carpeta <code className="text-xs">dist/</code> a <a href="https://app.netlify.com/drop" target="_blank" className="underline">netlify.com/drop</a></li>
              <li>Listo en segundos</li>
              <li>Configura dominio personalizado</li>
            </ol>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-5">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-bold mb-2">Opción 3 · Hosting tradicional</h3>
            <ol className="text-sm space-y-1 text-emerald-50 list-decimal list-inside">
              <li>Ejecuta <code className="text-xs">npm run build</code></li>
              <li>El archivo <code className="text-xs">dist/index.html</code> es autocontenido</li>
              <li>Súbelo a tu hosting (cPanel, FTP, etc.)</li>
              <li>Funciona en cualquier servidor</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 bg-amber-500/20 border border-amber-300/40 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div className="text-sm">
              <strong className="block text-amber-100 mb-1">Importante sobre los datos</strong>
              <p className="text-amber-50/90">
                En esta versión demo, los datos se guardan en el navegador del usuario (localStorage).
                Para una versión multi-usuario en producción donde todos vean los mismos datos,
                debes integrar un backend como <strong>Supabase</strong> (recomendado, gratis, fácil)
                o <strong>Firebase</strong>. La estructura de datos ya está lista para esa migración.
                Mientras tanto, usa el botón "Descargar backup" para exportar tus datos como JSON
                e incluirlos en el código fuente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
