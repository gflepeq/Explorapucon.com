import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "../../data/store";

export default function AdminLogin() {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  // If already logged in, go directly to dashboard
  useEffect(() => {
    if (Auth.isLoggedIn()) {
      nav("/admin", { replace: true });
    }
  }, [nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (Auth.login(pwd)) {
      nav("/admin", { replace: true });
    } else {
      setError("Contraseña incorrecta. La contraseña por defecto es: admin123");
    }
  };

  const fillDemo = () => {
    setPwd("admin123");
    setError("");
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
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-2xl">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contraseña
          </label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoFocus
            placeholder="Ingresa tu contraseña"
            className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
          {error && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 transition shadow-lg shadow-emerald-500/30"
          >
            Entrar al panel
          </button>

          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <div className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-1">
              🔑 Modo Demo
            </div>
            <div className="text-sm text-emerald-900">
              Contraseña: <code className="bg-white px-2 py-0.5 rounded font-bold">admin123</code>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline"
            >
              Click para auto-completar
            </button>
          </div>
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
