import { Link } from "react-router-dom";
import { useServicesByCategory, fmt } from "../data/store";

export default function Accommodation() {
  const stays = useServicesByCategory("alojamiento").slice(0, 4);

  return (
    <section id="alojamiento" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
              Alojamiento
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
              Donde dormir en Pucón
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl">
              Desde lodges de lujo frente al volcán hasta cabañas familiares en el bosque nativo.
            </p>
          </div>
          <Link to="/categoria/alojamiento" className="text-amber-600 font-semibold hover:text-amber-700 inline-flex items-center">
            Ver todos (89) →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stays.map((s) => (
            <Link
              to={`/servicio/${s.slug}`}
              key={s.slug}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {s.type}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                  <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z" /></svg>
                  <span className="font-bold text-slate-900">{s.rating}</span>
                  <span>({s.reviews} reseñas)</span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition">{s.name}</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  {s.price && (
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Desde</div>
                      <div className="text-lg font-extrabold text-slate-900">
                        {fmt(s.price)}
                        <span className="text-xs font-normal text-slate-500"> /noche</span>
                      </div>
                    </div>
                  )}
                  <span className="rounded-lg bg-amber-500 group-hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 transition">
                    Reservar
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
