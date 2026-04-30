import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useStore, StoreActions, fmt } from "../../data/store";

export default function AdminServices() {
  const { services, categories } = useStore();
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || "";
  const [q, setQ] = useState("");

  const filtered = services.filter((s) => {
    if (cat && s.category !== cat) return false;
    if (q && !`${s.name} ${s.type} ${s.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (slug: string, name: string) => {
    if (confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      StoreActions.deleteService(slug);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Servicios</h1>
          <p className="text-slate-500 mt-1">{filtered.length} de {services.length} servicios</p>
        </div>
        <Link
          to="/admin/servicios/nuevo"
          className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg shadow-emerald-500/30 transition"
        >
          + Nuevo servicio
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-5 flex flex-wrap gap-3 items-center">
        <input
          placeholder="🔍 Buscar por nombre, tipo o ubicación..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
        />
        <select
          value={cat}
          onChange={(e) => setParams(e.target.value ? { cat: e.target.value } : {})}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-xs uppercase text-slate-500 tracking-wider">
                <th className="text-left px-4 py-3">Servicio</th>
                <th className="text-left px-4 py-3">Categoría</th>
                <th className="text-right px-4 py-3">Precio</th>
                <th className="text-center px-4 py-3">Estado</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No hay servicios que coincidan
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const c = categories.find((c) => c.slug === s.category);
                  return (
                    <tr key={s.slug} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={s.image} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">{s.name}</div>
                            <div className="text-xs text-slate-500 truncate">{s.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c?.name || s.category}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {s.price ? `${fmt(s.price)} /${s.priceUnit}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {s.published !== false ? (
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">PUBLICADO</span>
                        ) : (
                          <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">BORRADOR</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/servicio/${s.slug}`} target="_blank" className="text-slate-500 hover:text-slate-700 text-xs">👁</Link>
                          <Link to={`/admin/servicios/${s.slug}`} className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs">Editar</Link>
                          <button onClick={() => handleDelete(s.slug, s.name)} className="text-rose-500 hover:text-rose-700 font-semibold text-xs">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
