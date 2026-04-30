const winterActivities = [
  {
    title: "Centro de Ski Pucón",
    desc: "Ubicado en las laderas del volcán Villarrica, con vistas únicas al lago.",
    icon: "⛷️",
    detail: "9 pistas · 800m desnivel",
    price: "$45.000 ticket día",
  },
  {
    title: "Snowboard & Freestyle",
    desc: "Park con cajones y rampas para riders intermedios y avanzados.",
    icon: "🏂",
    detail: "Snowpark abierto",
    price: "Pase + equipo $65.000",
  },
  {
    title: "Clases con instructores",
    desc: "Aprende a esquiar o mejora tu técnica con instructores certificados.",
    icon: "🎿",
    detail: "Grupales o privadas",
    price: "Desde $35.000",
  },
  {
    title: "Arriendo de equipos",
    desc: "Esquís, tablas, botas, cascos y ropa técnica de alta gama.",
    icon: "🥽",
    detail: "Equipo completo",
    price: "Desde $25.000/día",
  },
];

export default function Winter() {
  return (
    <section
      id="nieve"
      className="py-20 relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #0c4a6e 0%, #075985 40%, #0369a1 100%)",
      }}
    >
      {/* Decorative snowflakes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(white 1px, transparent 1.5px), radial-gradient(white 1px, transparent 1.5px)",
          backgroundSize: "60px 60px, 90px 90px",
          backgroundPosition: "0 0, 30px 30px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sky-200 font-semibold text-sm tracking-widest uppercase">
              <span className="text-xl">❄️</span> Temporada de Nieve · Jun – Oct
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
              Esquí en pleno volcán activo
            </h2>
            <p className="mt-4 text-sky-100">
              El Centro de Ski Pucón es uno de los más espectaculares de Sudamérica:
              imagina deslizarte mientras observas el lago Villarrica desde la cumbre
              de un volcán humeante.
            </p>
          </div>
          <a
            href="/#/categoria/nieve"
            className="inline-flex items-center rounded-full bg-white text-sky-900 hover:bg-sky-100 font-bold px-6 py-3 transition shadow-xl"
          >
            Ver servicios de nieve →
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {winterActivities.map((w) => (
            <div
              key={w.title}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-3">{w.icon}</div>
              <h3 className="font-bold text-lg">{w.title}</h3>
              <p className="text-sm text-sky-100 mt-2 leading-relaxed">{w.desc}</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="text-xs text-sky-200">{w.detail}</div>
                <div className="font-bold text-white mt-0.5">{w.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
