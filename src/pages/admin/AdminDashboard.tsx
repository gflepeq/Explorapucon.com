import { Link } from "react-router-dom";
import { useStore } from "../../data/store";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function AdminDashboard() {
  const { services, categories } = useStore();
  const published = services.filter((s) => s.published !== false).length;
  const drafts = services.length - published;
  const avgRating = (services.reduce((a, s) => a + s.rating, 0) / Math.max(services.length, 1)).toFixed(1);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Resumen general de tu plataforma</p>
        </div>
        {isSupabaseConfigured ? (
          <Link to="/admin/supabase" className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Conectado a Supabase
          </Link>
        ) : (
          <Link to="/admin/supabase" className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-amber-100">
            ⚠️ Modo demo · Conectar Supabase →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Servicios" value={services.length} icon="🎯" color="bg-emerald-500" />
        <Stat label="Publicados" value={published} icon="✅" color="bg-blue-500" />
        <Stat label="Borradores" value={drafts} icon="📝" color="bg-amber-500" />
        <Stat label="Categorías" value={categories.length} icon="📁" color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Calificación promedio</div>
          <div className="mt-2 text-4xl font-extrabold text-slate-900">⭐ {avgRating}</div>
          <div className="text-xs text-slate-500 mt-1">en {services.length} servicios</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Total reseñas</div>
          <div className="mt-2 text-4xl font-extrabold text-slate-900">
            {services.reduce((a, s) => a + s.reviews, 0).toLocaleString("es-CL")}
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-xs uppercase tracking-wider text-emerald-100">Acciones rápidas</div>
          <Link to="/admin/servicios/nuevo" className="mt-3 block bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-3 py-2 font-semibold text-sm transition">
            + Nuevo servicio
          </Link>
          <Link to="/admin/categorias" className="mt-2 block bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-3 py-2 font-semibold text-sm transition">
            + Nueva categoría
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Servicios por categoría</h2>
          <Link to="/admin/servicios" className="text-sm text-emerald-600 font-semibold hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => {
            const count = services.filter((s) => s.category === c.slug).length;
            return (
              <Link
                to={`/admin/servicios?cat=${c.slug}`}
                key={c.slug}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition"
              >
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.iconPath} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm truncate">{c.name}</div>
                  <div className="text-xs text-slate-500">{count} servicio{count !== 1 ? "s" : ""}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}
