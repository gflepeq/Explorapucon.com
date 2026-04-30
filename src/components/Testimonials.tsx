const testimonials = [
  {
    name: "Camila Rodríguez",
    location: "Santiago, Chile",
    rating: 5,
    text: "El ascenso al volcán Villarrica fue una experiencia que cambió mi vida. Los guías son profesionales, el equipo de primera y el paisaje espectacular. ¡100% recomendado!",
    initials: "CR",
  },
  {
    name: "Martín Suárez",
    location: "Buenos Aires, Argentina",
    rating: 5,
    text: "Hicimos rafting y luego termas el mismo día. Una combinación perfecta. La gente de ExploraPucón es muy cálida y conoce cada rincón de la zona. Volveré sin dudas.",
    initials: "MS",
  },
  {
    name: "Sophie Laurent",
    location: "Lyon, Francia",
    rating: 5,
    text: "Increíble agencia. Organizaron todo nuestro viaje de 5 días y fue impecable. El trekking en Huerquehue entre araucarias fue mágico. ¡Mil gracias por todo el equipo!",
    initials: "SL",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-600 font-semibold text-sm tracking-widest uppercase">
            Testimonios
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
            Lo que dicen nuestros viajeros
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl border border-slate-100 transition relative"
            >
              <svg className="h-10 w-10 text-emerald-100 absolute top-5 right-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.17 6C5.78 6.91 4 9.51 4 13.5V18h6v-6H6.84c.42-2.31 1.69-3.6 4.16-4.36L9.17 6zm10 0c-3.39.91-5.17 3.51-5.17 7.5V18h6v-6h-3.16c.42-2.31 1.69-3.6 4.16-4.36L19.17 6z"/>
              </svg>
              <div className="flex gap-0.5 text-amber-400 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z"/>
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-100">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
