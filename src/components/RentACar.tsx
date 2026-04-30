import { Link } from "react-router-dom";
import { useServicesByCategory, fmt } from "../data/store";

export default function RentACar() {
  const fleet = useServicesByCategory("rent-a-car");

  return (
    <section id="rentacar" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src="/images/rentacar.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
              Rent a Car
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white leading-tight">
              Recorre Pucón a tu ritmo
            </h2>
            <p className="mt-4 text-slate-300">
              Te ayudamos a coordinar el arriendo del vehículo perfecto para tu aventura:
              autos urbanos, 4x4 para terrenos exigentes y camionetas para grupos grandes.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: "🛡️", t: "Seguro incluido" },
                { icon: "🛣️", t: "Kilometraje libre" },
                { icon: "📍", t: "Entrega en aeropuerto" },
                { icon: "🕐", t: "24/7 asistencia" },
              ].map((b) => (
                <div key={b.t} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl px-4 py-3 text-white text-sm">
                  <span className="mr-2">{b.icon}</span>{b.t}
                </div>
              ))}
            </div>

            <Link
              to="/categoria/rent-a-car"
              className="mt-8 inline-flex items-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 transition shadow-lg shadow-emerald-500/30"
            >
              Ver flota completa →
            </Link>
          </div>

          <div className="space-y-3">
            {fleet.map((v) => (
              <Link
                to={`/servicio/${v.slug}`}
                key={v.slug}
                className="bg-white rounded-2xl p-5 shadow-2xl flex items-center gap-5 hover:scale-[1.02] transition group"
              >
                <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17h14M3 17l2-7h14l2 7" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">{v.type}</div>
                  <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition">{v.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{v.shortDesc}</div>
                </div>
                {v.price && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] text-slate-500 uppercase">Desde</div>
                    <div className="font-extrabold text-slate-900">{fmt(v.price)}</div>
                    <div className="text-[10px] text-slate-500">/día</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
