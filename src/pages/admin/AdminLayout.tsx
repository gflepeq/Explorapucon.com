import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Auth } from "../../data/store";

export default function AdminLayout() {
  const nav = useNavigate();
  const logged = Auth.isLoggedIn();

  if (!logged) {
    return <Navigate to="/admin/login" replace />;
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-emerald-500 text-white shadow" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20l5-9 4 6 3-4 6 7z" />
                <circle cx="17" cy="7" r="2" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">ExploraPucón</div>
              <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Super Admin</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={linkCls}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/servicios" className={linkCls}>
            <span>🎯</span> Servicios
          </NavLink>
          <NavLink to="/admin/categorias" className={linkCls}>
            <span>📁</span> Categorías
          </NavLink>
          <NavLink to="/admin/sitio" className={linkCls}>
            <span>⚙️</span> Sitio
          </NavLink>
          <NavLink to="/admin/publicar" className={linkCls}>
            <span>🚀</span> Publicar
          </NavLink>

          <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
            <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
              <span>👁️</span> Ver sitio público
            </Link>
            <button
              onClick={() => { Auth.logout(); nav("/admin/login"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <span>↩️</span> Cerrar sesión
            </button>
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-slate-100 text-[10px] text-slate-400">
          Versión 1.0 · Modo demo (localStorage)
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
