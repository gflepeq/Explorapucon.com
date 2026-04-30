const destinations = [
  { name: "Volcán Villarrica", img: "/images/volcano-trek.jpg", tours: 8 },
  { name: "Lago Caburgua", img: "/images/ojos-caburgua.jpg", tours: 5 },
  { name: "P.N. Huerquehue", img: "/images/huerquehue.jpg", tours: 6 },
  { name: "Termas Geométricas", img: "/images/termas.jpg", tours: 4 },
];

export default function Destinations() {
  return (
    <section id="destinos" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.6),transparent_60%)]" />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
            Destinos
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Lugares mágicos para descubrir
          </h2>
          <p className="mt-4 text-slate-300">
            Pucón es la puerta de entrada a algunos de los paisajes más impresionantes de Chile.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((d) => (
            <a
              key={d.name}
              href="/#/categoria/tours"
              className="group relative rounded-2xl overflow-hidden h-72 block shadow-xl"
            >
              <img
                src={d.img}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="text-xs text-emerald-300 font-semibold uppercase tracking-widest">
                  {d.tours} tours
                </div>
                <h3 className="text-xl font-bold mt-1">{d.name}</h3>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-emerald-300 opacity-0 group-hover:opacity-100 transition">
                  Explorar →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
