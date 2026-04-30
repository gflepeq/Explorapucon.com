import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Auth } from "../../data/store";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type AuthState = "checking" | "ok" | "denied";

export default function AdminLayout() {
  const nav = useNavigate();
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // 1. Fast check: localStorage flag
      if (Auth.isLoggedIn()) {
        if (!cancelled) setAuthState("ok");
        return;
      }

      // 2. If Supabase is configured, verify session with API
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.access_token) {
            // Valid Supabase session — mark logged in
            localStorage.setItem("explorapucon_admin_v1", "1");
            if (!cancelled) setAuthState("ok");
            return;
          }
        } catch {
          // Network error — fallback to localStorage
        }
      }

      // 3. No valid session found
      if (!cancelled) setAuthState("denied");
    }

    void check();
    return () => { cancelled = true; };
  }, []);

  // Loading spinner while checking
  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 items-center justify-center shadow-2xl mb-4 animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20l5-9 4 6 3-4 6 7z" />
              <circle cx="17" cy="7" r="2" />
            </svg>
          </div>
          <p className="text-slate-600 font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (authState === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  // ── Authenticated ─────────────────────────────────
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-emerald-500 text-white shadow"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30 shadow-sm">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20l5-9 4 6 3-4 6 7z" />
                <circle cx="17" cy="7" r="2" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm truncate">ExploraPucón</div>
              <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                Super Admin
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavLink to="/admin" end className={linkCls}>
            <span className="text-base">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/servicios" className={linkCls}>
            <span className="text-base">🎯</span>
            <span>Servicios</span>
          </NavLink>
          <NavLink to="/admin/categorias" className={linkCls}>
            <span className="text-base">📁</span>
            <span>Categorías</span>
          </NavLink>
          <NavLink to="/admin/sitio" className={linkCls}>
            <span className="text-base">⚙️</span>
            <span>Sitio & Logo</span>
          </NavLink>
          <NavLink to="/admin/supabase" className={linkCls}>
            <span className="text-base">🗄️</span>
            <span>Supabase</span>
            {isSupabaseConfigured && (
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
            )}
          </NavLink>
          <NavLink to="/admin/publicar" className={linkCls}>
            <span className="text-base">🚀</span>
            <span>Publicar</span>
          </NavLink>
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-3 space-y-0.5 border-t border-slate-100 pt-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <span className="text-base">👁️</span>
            <span>Ver sitio público</span>
            <span className="ml-auto text-xs text-slate-400">↗</span>
          </Link>
          <button
            onClick={async () => {
              await Auth.logout();
              nav("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <span className="text-base">↩️</span>
            <span>Cerrar sesión</span>
          </button>
        </div>

        <div className="px-5 py-2.5 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>v2.0</span>
            {isSupabaseConfigured
              ? <span className="text-emerald-500 font-semibold">● Supabase activo</span>
              : <span className="text-amber-500 font-semibold">⚠ Demo mode</span>
            }
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">ExploraPucón</span>
            {" · "}Panel de administración
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {isSupabaseConfigured
              ? <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Supabase conectado</span>
              : <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">⚠ Modo demo</span>
            }
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
