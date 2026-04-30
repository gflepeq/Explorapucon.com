import { Link } from "react-router-dom";
import { useCategories } from "../data/store";

export default function ServicesPage() {
  const categories = useCategories();
  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-white to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-emerald-600">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">Servicios</span>
        </nav>

        <div className="mb-12 max-w-2xl">
          <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">
            Líneas de Negocio
          </span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-black text-slate-900">
            Todos los servicios de Pucón
          </h1>
          <p className="mt-4 text-slate-600">
            Explora todas las categorías del directorio turístico oficial: alojamiento,
            gastronomía, tours, transfer, esquí y mucho más.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/categoria/${c.slug}`}
              className="group relative rounded-2xl overflow-hidden h-72 shadow-lg hover:shadow-2xl transition"
            >
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg w-fit`}>
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d={c.iconPath} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-white/80 uppercase tracking-widest">{c.count} prestadores</div>
                  <h2 className="text-2xl font-bold mt-1">{c.name}</h2>
                  <p className="text-sm text-white/85 mt-2 line-clamp-2">{c.description}</p>
                  <div className="mt-3 inline-flex items-center text-emerald-300 font-semibold text-sm">
                    Ver categoría <span className="ml-1 group-hover:translate-x-1 transition">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
