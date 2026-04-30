import { useMeta } from "../data/store";
import ContactForm from "../components/ContactForm";
import WhatsAppButton from "../components/WhatsAppButton";

export default function ContactPage() {
  const { phone, email, address, whatsapp } = useMeta();
  const wa = whatsapp || (phone ? phone.replace(/\D/g, "") : "");

  return (
    <div className="pt-28 pb-20 bg-gradient-to-b from-white to-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="text-xs text-slate-500 mb-4">
          <a href="/#/" className="hover:text-emerald-600">Inicio</a>
          <span className="mx-2">/</span>
          <span className="text-slate-900">Contacto</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-10 lg:p-14 text-white">
            <span className="text-emerald-200 font-semibold text-sm tracking-widest uppercase">Contacto</span>
            <h1 className="mt-2 text-4xl font-bold leading-tight">Hablemos de tu próximo viaje</h1>
            <p className="mt-4 text-emerald-50">Te respondemos en menos de 24 horas. Para consultas urgentes, contáctanos directo por WhatsApp.</p>

            <div className="mt-8 space-y-4 text-sm">
              {phone && (
                <div className="flex items-center gap-3"><span className="text-xl">📞</span> {phone}</div>
              )}
              {email && (
                <div className="flex items-center gap-3"><span className="text-xl">✉️</span> {email}</div>
              )}
              {address && (
                <div className="flex items-center gap-3"><span className="text-xl">📍</span> {address}</div>
              )}
            </div>

            {wa && (
              <div className="mt-8">
                <WhatsAppButton phone={wa} size="lg">Contactar por WhatsApp</WhatsAppButton>
              </div>
            )}
          </div>
          <div className="bg-white p-10 lg:p-14">
            <h2 className="text-2xl font-bold text-slate-900">Envíanos un mensaje</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">Completa el formulario y te contactamos pronto.</p>
            <ContactForm phone={wa || undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
