import { Link } from "react-router-dom";
import { useServicesByCategory } from "../data/store";

const tags = ["Comida típica", "Mariscos y pescados", "Cafeterías", "Cervecerías", "Vegetariana", "Pastelería", "Heladerías", "Sushi"];

export default function Gastronomy() {
  const restaurants = useServicesByCategory("gastronomia");

  return (
    <section id="gastronomia" className="py-20 bg-gradient-to-b from-rose-50/50 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-30 pointer-events-none">
        <img src="/images/gastronomia.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/70 to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <span className="text-rose-600 font-semibold text-sm tracking-widest uppercase">
              Gastronomía
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Sabores del sur en cada esquina
            </h2>
            <p className="mt-4 text-slate-600">
              Desde cocina mapuche ancestral hasta cervecerías artesanales y comida
              fusión. Pucón es un destino imperdible para los foodies.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="text-xs bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full font-medium hover:bg-rose-100 cursor-pointer transition">
                  {t}
                </span>
              ))}
            </div>

            <Link
              to="/categoria/gastronomia"
              className="mt-8 inline-flex items-center rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 transition shadow-lg shadow-rose-500/30"
            >
              Ver los 112 restaurantes →
            </Link>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {restaurants.map((r) => (
              <Link
                to={`/servicio/${r.slug}`}
                key={r.slug}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg border border-slate-100 transition group block"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition">{r.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{r.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs flex-shrink-0">
                    <svg className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z" /></svg>
                    <span className="font-bold text-slate-900">{r.rating}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 inline-flex items-center gap-1 truncate">
                    <svg className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="truncate">{r.location}</span>
                  </span>
                  {r.badge && <span className="font-bold text-emerald-600 flex-shrink-0">{r.badge}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
