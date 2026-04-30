import { useState } from "react";
import { type Category, useStore, StoreActions } from "../../data/store";

const colors = [
  "from-amber-400 to-orange-600",
  "from-rose-400 to-red-600",
  "from-emerald-400 to-green-600",
  "from-cyan-400 to-blue-600",
  "from-slate-500 to-slate-800",
  "from-indigo-400 to-blue-700",
  "from-sky-400 to-blue-600",
  "from-purple-400 to-fuchsia-700",
  "from-pink-400 to-fuchsia-600",
  "from-yellow-400 to-amber-600",
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

const empty: Category = {
  slug: "", name: "", description: "", longDescription: "",
  color: colors[0], accent: "text-emerald-600", count: 0,
  image: "/images/hero-pucon.jpg",
  iconPath: "M3 20l5-9 4 6 3-4 6 7z",
};

export default function AdminCategories() {
  const { categories } = useStore();
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const onEdit = (c: Category) => { setEditing(c); setShowForm(true); };
  const onNew = () => { setEditing({ ...empty }); setShowForm(true); };
  const onDelete = (c: Category) => {
    if (confirm(`¿Eliminar categoría "${c.name}"? También se eliminarán todos sus servicios.`)) {
      StoreActions.deleteCategory(c.slug);
    }
  };
  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const slug = editing.slug || slugify(editing.name);
    StoreActions.saveCategory({ ...editing, slug });
    setShowForm(false);
    setEditing(null);
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Categorías</h1>
          <p className="text-slate-500 mt-1">{categories.length} categorías activas</p>
        </div>
        <button onClick={onNew} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg shadow-emerald-500/30">
          + Nueva categoría
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.slug} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={c.iconPath} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{c.name}</h3>
                <div className="text-xs text-slate-500">/{c.slug} · {c.count} prestadores</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">{c.description}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => onEdit(c)} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Editar</button>
              <button onClick={() => onDelete(c)} className="text-xs font-semibold text-rose-500 hover:text-rose-700">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <form onSubmit={onSave} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editing.slug ? "Editar categoría" : "Nueva categoría"}</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre *</label>
                <input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</label>
                <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} className={`${inputCls} font-mono text-xs`} placeholder="se genera del nombre" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción corta</label>
                <input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción larga</label>
                <textarea value={editing.longDescription} onChange={(e) => setEditing({ ...editing, longDescription: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Imagen (URL)</label>
                <input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Color</label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {colors.map((c) => (
                    <button key={c} type="button" onClick={() => setEditing({ ...editing, color: c })} className={`h-10 rounded-lg bg-gradient-to-br ${c} ${editing.color === c ? "ring-2 ring-offset-2 ring-slate-900" : ""}`} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SVG path del ícono (opcional)</label>
                <input value={editing.iconPath} onChange={(e) => setEditing({ ...editing, iconPath: e.target.value })} className={`${inputCls} font-mono text-xs`} />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-slate-200 font-semibold text-sm">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
