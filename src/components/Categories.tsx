const categories = [
  {
    icon: (
      <path d="M3 20l5-9 4 6 3-4 6 7zM17 7a2 2 0 100-4 2 2 0 000 4z" />
    ),
    title: "Aventura",
    desc: "Adrenalina pura entre volcanes, ríos y montañas patagónicas.",
    color: "from-orange-400 to-red-500",
  },
  {
    icon: <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z" />,
    title: "Naturaleza",
    desc: "Bosques milenarios, lagos cristalinos y parques nacionales únicos.",
    color: "from-emerald-400 to-green-600",
  },
  {
    icon: <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />,
    title: "Termas",
    desc: "Relax en aguas termales naturales rodeadas de selva valdiviana.",
    color: "from-cyan-400 to-blue-600",
  },
  {
    icon: <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />,
    title: "Cultura Mapuche",
    desc: "Conoce la cosmovisión y tradiciones del pueblo mapuche.",
    color: "from-amber-400 to-yellow-600",
  },
];

export default function Categories() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">
            Nuestras Experiencias
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Diseñadas para todo tipo de viajero
          </h2>
          <p className="mt-4 text-slate-600">
            Sea cual sea tu estilo de viaje, en Pucón encontrarás la aventura perfecta para ti.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div
              key={c.title}
              className="group relative bg-white rounded-2xl p-7 shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-5 shadow-lg`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {c.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              <div className="mt-5 inline-flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Explorar <span className="ml-1 group-hover:translate-x-1 transition">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
