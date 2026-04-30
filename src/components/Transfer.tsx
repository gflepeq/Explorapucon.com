const services = [
  {
    title: "Transfer Aeropuerto Temuco",
    route: "ZCO ↔ Pucón",
    duration: "1h 45min",
    pax: "Hasta 12 pax",
    price: 18000,
    perPerson: true,
    badge: "Compartido",
  },
  {
    title: "Transporte Privado VIP",
    route: "Origen a destino",
    duration: "Flexible",
    pax: "Hasta 8 pax",
    price: 95000,
    perPerson: false,
    badge: "Privado",
  },
  {
    title: "Transfer a Termas",
    route: "Pucón ↔ Geométricas",
    duration: "3 hrs",
    pax: "Hasta 10 pax",
    price: 12000,
    perPerson: true,
    badge: "Tour",
  },
  {
    title: "Excursión Día Completo",
    route: "Pucón + alrededores",
    duration: "8 hrs",
    pax: "Hasta 15 pax",
    price: 150000,
    perPerson: false,
    badge: "Full day",
  },
];

const fmt = (n: number) => "$" + n.toLocaleString("es-CL");

export default function Transfer() {
  return (
    <section id="transfer" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 relative">
            <img
              src="/images/transfer.jpg"
              alt="Transfer Pucón"
              className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl px-5 py-4 border border-slate-100 hidden md:block">
              <div className="text-3xl font-extrabold text-indigo-600">24/7</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">Atención</div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <span className="text-indigo-600 font-semibold text-sm tracking-widest uppercase">
              Transfer & Transporte
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Llega y muévete sin preocupaciones
            </h2>
            <p className="mt-4 text-slate-600">
              Coordinamos tus traslados desde el aeropuerto de Temuco (ZCO),
              transporte privado VIP y excursiones con conductor. Vehículos modernos
              y conductores bilingües.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-lg transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                      {s.title}
                    </h3>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                      {s.badge}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {s.route}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 7v5l3 2"/></svg>
                        {s.duration}
                      </span>
                      <span>· {s.pax}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-lg font-extrabold text-slate-900">{fmt(s.price)}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {s.perPerson ? "por persona" : "por servicio"}
                      </div>
                    </div>
                    <a href="/#/categoria/transfer" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                      Reservar →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
