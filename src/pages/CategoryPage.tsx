import { Link, useParams } from "react-router-dom";
import { useCategories, useCategory, useServicesByCategory, fmt } from "../data/store";
import { AgencyLogo } from "../components/AgencyCard";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const category = useCategory(slug);
  const services = useServicesByCategory(slug);
  const categories = useCategories();

  if (!category) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center min-h-screen">
        <h1 className="text-3xl font-bold text-slate-900">Categoría no encontrada</h1>
        <Link to="/" className="mt-4 inline-block text-emerald-600 hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero categoría */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-white w-full">
          {/* Breadcrumb */}
          <nav className="text-xs mb-4 text-white/80">
            <Link to="/" className="hover:text-emerald-300">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/servicios" className="hover:text-emerald-300">Servicios</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-3">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-xl`}>
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d={category.iconPath} />
              </svg>
            </div>
            <span className="bg-white/15 backdrop-blur border border-white/30 text-xs font-semibold px-3 py-1.5 rounded-full">
              {category.count} prestadores
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{category.name}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{category.longDescription}</p>
        </div>
      </section>

      {/* Listado */}
      <section className="py-14 bg-slate-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {services.length} {services.length === 1 ? "servicio destacado" : "servicios destacados"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Selecciona un servicio para ver el detalle completo y contactar al prestador.</p>
            </div>
            <Link to="/servicios" className="text-sm text-emerald-600 font-semibold hover:underline hidden sm:inline">
              ← Ver todas las categorías
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
              <p className="text-slate-600">Próximamente publicaremos prestadores en esta categoría.</p>
              <Link to="/contacto" className="mt-4 inline-block text-emerald-600 font-semibold hover:underline">
                Solicitar información →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to={`/servicio/${s.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    {s.badge && (
                      <span className={`absolute top-3 left-3 bg-gradient-to-r ${category.color} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}>
                        {s.badge}
                      </span>
                    )}
                    {s.price && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-slate-900 text-sm font-bold px-3 py-1.5 rounded-full">
                        Desde {fmt(s.price)}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">{s.type}</div>
                    <h3 className={`mt-1 font-bold text-slate-900 group-hover:${category.accent} transition`}>{s.name}</h3>

                    <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                      <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z" /></svg>
                      <span className="font-bold text-slate-900">{s.rating}</span>
                      <span>({s.reviews})</span>
                      <span>·</span>
                      <span className="truncate">{s.location}</span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">{s.shortDesc}</p>

                    {s.agency && (
                      <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100">
                        <AgencyLogo agency={s.agency} size={28} />
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Operado por</div>
                          <div className="text-xs font-bold text-slate-700 truncate">{s.agency.name}</div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className={`text-sm font-semibold ${category.accent} group-hover:gap-2 inline-flex items-center transition`}>
                        Ver detalle <span className="ml-1 group-hover:translate-x-1 transition">→</span>
                      </span>
                      <span className="text-xs text-slate-400">{s.duration || s.capacity || ""}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Otras categorías */}
      <section className="py-14 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xl font-bold text-slate-900 mb-5">Explora otras categorías</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.filter((c) => c.slug !== slug).slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                to={`/categoria/${c.slug}`}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl p-4 transition group"
              >
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center mb-2`}>
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.iconPath} />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">{c.name}</div>
                <div className="text-[11px] text-slate-500">{c.count} prestadores</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
