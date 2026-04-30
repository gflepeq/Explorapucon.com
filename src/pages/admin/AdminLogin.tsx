import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "../../data/store";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd]     = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      if (Auth.isLoggedIn()) { nav("/admin", { replace: true }); return; }
      if (isSupabaseConfigured) {
        try {
          const { supabase } = await import("../../lib/supabase");
          if (supabase) {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              localStorage.setItem("explorapucon_admin_v1", "1");
              nav("/admin", { replace: true });
            }
          }
        } catch {}
      }
    }
    void checkSession();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8 text-white">
          <Link to="/">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 items-center justify-center shadow-2xl mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20l5-9 4 6 3-4 6 7z" />
                <circle cx="17" cy="7" r="2" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold">ExploraPucón</h1>
          <p className="text-emerald-200 mt-1 text-sm">Panel de administración</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-4">
          {isSupabaseConfigured && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
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
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contraseña
            </label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              autoFocus={!isSupabaseConfigured}
              required
              placeholder="••••••••"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 transition shadow-lg shadow-emerald-500/30 disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-white/70 hover:text-white transition">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
