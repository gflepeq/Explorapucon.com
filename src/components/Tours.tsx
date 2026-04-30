import { Link } from "react-router-dom";
import { useServicesByCategory, fmt } from "../data/store";

export default function Tours() {
  const tours = useServicesByCategory("tours").slice(0, 6);

  return (
    <section id="tours" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">
              Tours Destacados
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              Vive lo mejor de Pucón
            </h2>
          </div>
          <Link
            to="/categoria/tours"
            className="text-emerald-600 font-semibold hover:text-emerald-700 inline-flex items-center"
          >
            Ver todos los tours →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {tours.map((t) => (
            <Link
              to={`/servicio/${t.slug}`}
              key={t.slug}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                {t.badge && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {t.badge}
                  </span>
                )}
                {t.price && (
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-slate-900 text-sm font-bold px-3 py-1.5 rounded-full">
                    Desde {fmt(t.price)}
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                  {t.duration && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 2" /></svg>
                      {t.duration}
                    </span>
                  )}
                  {t.level && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 20l5-9 4 6 3-4 6 7z" /></svg>
                      {t.level}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition">{t.name}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">{t.shortDesc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500 group-hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 transition shadow-md shadow-emerald-500/30">
                    Reservar
                  </span>
                  <span className="text-sm text-slate-600 group-hover:text-emerald-600 font-medium">
                    Ver detalle →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
