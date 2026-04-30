import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "../../data/store";
import { isSupabaseConfigured, getSupabaseUrl, clearSupabaseCredentials } from "../../lib/supabase";
import SiteLogo from "../../components/SiteLogo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (Auth.isLoggedIn()) nav("/admin", { replace: true });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // If Supabase is configured, require email + password
      // If not, use demo password (pwd field only)
      const result = isSupabaseConfigured
        ? await Auth.loginAsync(email, pwd)
        : await Auth.loginAsync(pwd);
      if (result.ok) {
        nav("/admin", { replace: true });
      } else {
        setError(result.error || "Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setPwd("admin123");
    setError("");
  };

  const disconnect = () => {
    if (confirm("¿Desconectar Supabase y volver al modo demo?")) {
      clearSupabaseCredentials();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 text-white">
          <Link to="/" className="inline-block">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 items-center justify-center shadow-2xl mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20l5-9 4 6 3-4 6 7z" />
                <circle cx="17" cy="7" r="2" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold">ExploraPucón Admin</h1>
          <p className="text-emerald-200 mt-1">Panel de administración</p>
          {isSupabaseConfigured && (
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] bg-green-500/30 backdrop-blur border border-green-300/40 text-green-100 px-3 py-1 rounded-full font-semibold">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Conectado a Supabase
            </div>
          )}
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-2xl">
          {isSupabaseConfigured ? (
            /* ====== SUPABASE LOGIN (email + password) ====== */
            <>
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email del admin
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  placeholder="admin@explorapucon.com"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>
            </>
          ) : (
            /* ====== DEMO LOGIN (password only) ====== */
            <>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Contraseña
              </label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoFocus
                required
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </>
          )}

          {error && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 transition shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          >
            {loading ? "Iniciando..." : "Entrar al panel"}
          </button>

          {/* Supabase connected info */}
          {isSupabaseConfigured ? (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1">
                🔒 Modo Supabase (CMS real)
              </div>
              <p className="text-xs text-emerald-600">
                Ingresa el email y contraseña del usuario admin creado en Supabase Authentication.
              </p>
              <p className="text-[10px] text-emerald-500 mt-2 break-all">
                Proyecto: {getSupabaseUrl()}
              </p>
              <button
                type="button"
                onClick={disconnect}
                className="mt-3 text-xs text-rose-500 hover:text-rose-700 font-semibold underline"
              >
                ⚠️ Desconectar Supabase y volver a modo demo
              </button>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <div className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">
                ⚠️ Modo Demo · Sin Supabase
              </div>
              <div className="text-sm text-amber-900">
                Contraseña: <code className="bg-white px-2 py-0.5 rounded font-bold">admin123</code>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-2 text-xs text-amber-700 hover:text-amber-900 font-semibold underline"
              >
                Click para auto-completar
              </button>
              <Link
                to="/admin/supabase"
                onClick={() => { Auth.login("admin123"); }}
                className="mt-3 block text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline"
              >
                ⚡ Configurar Supabase (CMS multi-usuario)
              </Link>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-white/80 hover:text-white">
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}
