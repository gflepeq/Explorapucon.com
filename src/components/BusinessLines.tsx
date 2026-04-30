import { Link } from "react-router-dom";

const lines = [
  { title: "Alojamiento", count: 89, desc: "Hoteles, cabañas, lodges, apart hotel, hostales y camping.", color: "from-amber-400 to-orange-600", href: "/categoria/alojamiento", icon: (<><path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>) },
  { title: "Gastronomía", count: 112, desc: "Restaurantes, cafeterías, cervecerías, comida típica y mariscos.", color: "from-rose-400 to-red-600", href: "/categoria/gastronomia", icon: <path d="M6 2v8a4 4 0 008 0V2M10 2v6M14 2v6M18 2c1 0 2 1 2 3v6a2 2 0 01-2 2v9" /> },
  { title: "Tours y Excursiones", count: 67, desc: "Operadores turísticos, ascenso al volcán y aventura outdoor.", color: "from-emerald-400 to-green-600", href: "/categoria/tours", icon: <path d="M3 20l5-9 4 6 3-4 6 7zM17 7a2 2 0 100-4 2 2 0 000 4z" /> },
  { title: "Termas", count: 12, desc: "Centros termales en plena selva valdiviana para relajarte.", color: "from-cyan-400 to-blue-600", href: "/categoria/termas", icon: <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0" /> },
  { title: "Turismo Aventura", count: 45, desc: "Rafting, canopy, canyoning, kayak y deportes outdoor.", color: "from-orange-400 to-red-500", href: "/categoria/tours", icon: <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z" /> },
  { title: "Turismo Rural y Mapuche", count: 18, desc: "Comunidades, artesanía y cocina ancestral mapuche.", color: "from-amber-500 to-yellow-700", href: "/categoria/tours", icon: <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" /> },
  { title: "Rent a Car", count: 14, desc: "Arrienda autos, 4x4, camionetas y motos para tu viaje.", color: "from-slate-500 to-slate-800", href: "/categoria/rent-a-car", icon: (<><path d="M5 17h14M3 17l2-7h14l2 7M7 17v3M17 17v3" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>) },
  { title: "Transfer & Transporte", count: 22, desc: "Traslados desde aeropuerto Temuco, transporte privado y vans.", color: "from-indigo-400 to-blue-700", href: "/categoria/transfer", icon: (<><path d="M8 6v6M16 6v6M2 12h20l-2-6H4l-2 6zM4 12v6h16v-6" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></>) },
  { title: "Esquí & Nieve", count: 8, desc: "Centro de Ski Pucón, arriendo de equipos y clases en el volcán.", color: "from-sky-300 to-blue-500", href: "/categoria/nieve", icon: <path d="M2 12h20M12 2v20M5 5l14 14M19 5L5 19" /> },
  { title: "Pesca con Mosca", count: 11, desc: "Guías expertos en ríos Trancura, Liucura y lagos cordilleranos.", color: "from-teal-400 to-cyan-700", href: "/categoria/tours", icon: <path d="M2 12c4-6 10-6 14-3 2 1 4 3 6 3-2 0-4 2-6 3-4 3-10 3-14-3z" /> },
  { title: "Eventos & Bodas", count: 15, desc: "Organizadores, salones de eventos, catering y bodas en Pucón.", color: "from-pink-400 to-fuchsia-600", href: "/contacto", icon: <path d="M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v2M2 13a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zM12 9v4" /> },
  { title: "Salud & Bienestar", count: 19, desc: "Spa, masajes, yoga, centros médicos y farmacias 24/7.", color: "from-green-400 to-teal-600", href: "/contacto", icon: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /> },
  { title: "Entretención & Casino", count: 9, desc: "Casino Enjoy Pucón, vida nocturna y eventos culturales.", color: "from-purple-400 to-fuchsia-700", href: "/contacto", icon: <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" /> },
  { title: "Compras & Artesanía", count: 27, desc: "Boutiques, artesanía mapuche, delicatessen y souvenirs.", color: "from-yellow-400 to-amber-600", href: "/contacto", icon: <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /> },
  { title: "Inmobiliaria", count: 13, desc: "Corredores, arriendos por temporada y proyectos en Pucón.", color: "from-stone-400 to-stone-700", href: "/contacto", icon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /> },
  { title: "Datos Útiles", count: 0, desc: "Hospital, farmacias, correos, bancos y servicios esenciales.", color: "from-slate-400 to-slate-600", href: "/contacto", icon: <path d="M12 22a10 10 0 100-20 10 10 0 000 20zM12 16v-4M12 8h.01" /> },
];

export default function BusinessLines() {
  const total = lines.reduce((acc, l) => acc + l.count, 0);

  return (
    <section id="lineas" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">
            Líneas de Negocio
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Todo Pucón en una sola plataforma
          </h2>
          <p className="mt-4 text-slate-600">
            Conectamos viajeros con los mejores prestadores turísticos certificados de
            Pucón y la Araucanía. Más de <strong className="text-emerald-600">{total}+</strong> servicios
            organizados en <strong className="text-emerald-600">{lines.length} categorías</strong>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {lines.map((l) => (
            <Link
              key={l.title}
              to={l.href}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${l.color} opacity-10 group-hover:opacity-25 transition`} />

              <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${l.color} flex items-center justify-center mb-4 shadow-lg`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {l.icon}
                </svg>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{l.title}</h3>
                  {l.count > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {l.count}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{l.desc}</p>
                <div className="mt-4 inline-flex items-center text-emerald-600 font-semibold text-xs group-hover:gap-2 transition-all">
                  Ver más <span className="ml-1 group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
