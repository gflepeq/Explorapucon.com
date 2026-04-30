const features = [
  {
    icon: <path d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z" />,
    title: "Guías certificados",
    desc: "Todos nuestros guías cuentan con certificación Sernatur y formación en primeros auxilios.",
  },
  {
    icon: <path d="M3 12l3 3 6-6M3 18l3 3 6-6M14 7l7 0M14 13l7 0M14 19l7 0" />,
    title: "Equipamiento premium",
    desc: "Trabajamos con marcas internacionales para garantizar tu seguridad y comodidad.",
  },
  {
    icon: <path d="M20 21v-2a4 4 0 00-3-3.87M4 21v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M9 11a4 4 0 100-8 4 4 0 000 8z" />,
    title: "Grupos pequeños",
    desc: "Máximo 10 personas por tour para una experiencia personalizada y segura.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/huerquehue.jpg"
              alt="Bosque"
              className="rounded-2xl h-64 w-full object-cover shadow-xl"
            />
            <img
              src="/images/termas.jpg"
              alt="Termas"
              className="rounded-2xl h-64 w-full object-cover shadow-xl translate-y-8"
            />
            <img
              src="/images/volcano-trek.jpg"
              alt="Volcán"
              className="rounded-2xl h-64 w-full object-cover shadow-xl"
            />
            <img
              src="/images/ojos-caburgua.jpg"
              alt="Cascadas"
              className="rounded-2xl h-64 w-full object-cover shadow-xl translate-y-8"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-emerald-500 text-white p-5 rounded-2xl shadow-2xl hidden md:block">
            <div className="text-3xl font-extrabold">+10</div>
            <div className="text-xs uppercase tracking-wider">años explorando Pucón</div>
          </div>
        </div>

        <div>
          <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">
            Sobre Nosotros
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Apasionados por mostrarte el verdadero Pucón
          </h2>
          <p className="mt-5 text-slate-600 leading-relaxed">
            En <strong>ExploraPucón</strong> somos una agencia de turismo local con más de
            una década diseñando aventuras inolvidables en la Araucanía. Conocemos cada
            sendero, cada laguna oculta y cada secreto de nuestro territorio. Nuestra
            misión es conectarte con la naturaleza, la cultura mapuche y la energía
            única del sur de Chile.
          </p>

          <div className="mt-8 space-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {f.icon}
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{f.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
