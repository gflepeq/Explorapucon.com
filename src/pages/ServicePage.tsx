import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useCategory, useService, useServicesByCategory, fmt } from "../data/store";
import WhatsAppButton from "../components/WhatsAppButton";
import ContactForm from "../components/ContactForm";
import AgencyCard, { AgencyLogo } from "../components/AgencyCard";

export default function ServicePage() {
  const { slug = "" } = useParams();
  const service = useService(slug);
  const category = useCategory(service?.category || "");
  const related = useServicesByCategory(service?.category || "").filter((s) => s.slug !== slug).slice(0, 3);
  const [activeImg, setActiveImg] = useState(0);

  if (!service || !category) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center min-h-screen">
        <h1 className="text-3xl font-bold text-slate-900">Servicio no encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-emerald-600 hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const gallery = service.gallery && service.gallery.length > 0 ? service.gallery : [service.image];
  const waMessage = `Hola, me interesa el servicio "${service.name}" que vi en ExploraPucón.com. ¿Podrían darme más información?`;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-slate-500">
          <Link to="/" className="hover:text-emerald-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to={`/categoria/${category.slug}`} className="hover:text-emerald-600">{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">{service.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="relative h-[280px] sm:h-[420px] bg-slate-100">
              <img src={gallery[activeImg]} alt={service.name} className="w-full h-full object-cover" />
              {service.badge && (
                <span className={`absolute top-4 left-4 bg-gradient-to-r ${category.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider`}>
                  {service.badge}
                </span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="p-3 flex gap-2 overflow-x-auto">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition ${
                      activeImg === i ? "border-emerald-500" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={g} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/categoria/${category.slug}`}
                  className={`text-xs font-semibold ${category.accent} uppercase tracking-widest hover:underline`}
                >
                  {category.name} · {service.type}
                </Link>
                <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {service.name}
                </h1>
                {service.agency && (
                  <button
                    onClick={() => scrollTo("agency")}
                    className="mt-3 inline-flex items-center gap-2 group cursor-pointer"
                  >
                    <AgencyLogo agency={service.agency} size={28} />
                    <span className="text-xs text-slate-500">
                      Operado por <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition">{service.agency.name}</span>
                    </span>
                  </button>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z" /></svg>
                    <span className="font-bold text-slate-900">{service.rating}</span>
                    <span className="text-slate-500">({service.reviews} reseñas)</span>
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {service.location}
                  </span>
                </div>
              </div>

              {service.price && (
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Desde</div>
                  <div className="text-3xl font-extrabold text-slate-900">{fmt(service.price)}</div>
                  <div className="text-xs text-slate-500">por {service.priceUnit}</div>
                </div>
              )}
            </div>

            {/* Quick info */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {service.duration && <InfoChip icon="⏱" label="Duración" value={service.duration} />}
              {service.level && <InfoChip icon="📊" label="Nivel" value={service.level} />}
              {service.capacity && <InfoChip icon="👥" label="Capacidad" value={service.capacity} />}
              <InfoChip icon="✓" label="Verificado" value="Sernatur" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Descripción</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{service.description}</p>

            {service.highlights && service.highlights.length > 0 && (
              <>
                <h3 className="mt-6 text-base font-bold text-slate-900">Lo más destacado</h3>
                <ul className="mt-3 space-y-2">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-slate-700">
                      <span className={`${category.accent} font-bold flex-shrink-0`}>★</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Includes */}
          {service.includes && service.includes.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">¿Qué incluye?</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {service.includes.map((it) => (
                  <div key={it} className="flex gap-3 items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm text-slate-700">{it}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Características</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.features.map((f) => (
                <span key={f} className="bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-full font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Agency card */}
          {service.agency && (
            <div id="agency">
              <AgencyCard agency={service.agency} accent={category.accent} />
            </div>
          )}

          {/* Contact form */}
          <div id="contact-form" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Solicitar información</h2>
            <p className="text-sm text-slate-500 mt-1">
              Completa el formulario y te contactaremos por WhatsApp en menos de 1 hora.
            </p>
            <div className="mt-6">
              <ContactForm serviceName={service.name} category={category.name} phone={service.phone} />
            </div>
          </div>
        </div>

        {/* SIDEBAR (sticky on desktop) */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Booking card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              {service.price && (
                <>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Desde</div>
                  <div className="text-3xl font-extrabold text-slate-900">{fmt(service.price)}</div>
                  <div className="text-xs text-slate-500 mb-5">por {service.priceUnit}</div>
                </>
              )}

              <WhatsAppButton phone={service.phone} message={waMessage} className="w-full" size="lg">
                Consultar por WhatsApp
              </WhatsAppButton>

              <button
                onClick={() => scrollTo("contact-form")}
                className="mt-3 w-full inline-flex items-center justify-center rounded-full border-2 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 font-semibold px-5 py-3 text-sm transition"
              >
                Enviar formulario ↓
              </button>

              <div className="mt-5 pt-5 border-t border-slate-100 space-y-3 text-sm">
                <Row icon="📍" label="Ubicación" value={service.location} />
                <Row icon="📞" label="Atención" value="24/7" />
                <Row icon="🛡️" label="Pago seguro" value="Reserva sin tarjeta" />
                <Row icon="↩️" label="Cancelación" value="Flexible 24h antes" />
              </div>
            </div>

            {/* Trust */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-emerald-900 text-sm">Prestador verificado</div>
                  <div className="text-xs text-emerald-800 mt-1">
                    Cumple normativa Sernatur y cuenta con seguros vigentes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-white border-t border-slate-100 py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Otros servicios en {category.name}</h2>
              <Link to={`/categoria/${category.slug}`} className={`text-sm font-semibold ${category.accent} hover:underline`}>
                Ver todos →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.slug} to={`/servicio/${r.slug}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition">
                  <div className="h-40 overflow-hidden">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">{r.type}</div>
                    <h3 className={`font-bold text-slate-900 group-hover:${category.accent} transition mt-0.5`}>{r.name}</h3>
                    {r.price && <div className="mt-2 text-sm font-bold text-slate-900">Desde {fmt(r.price)}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-sm font-semibold text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-sm text-slate-900 font-medium">{value}</div>
      </div>
    </div>
  );
}
