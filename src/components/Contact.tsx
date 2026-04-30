import { useMeta } from "../data/store";
import ContactForm from "./ContactForm";
import WhatsAppButton from "./WhatsAppButton";

export default function Contact() {
  const { phone, email, address, whatsapp } = useMeta();
  const wa = whatsapp || (phone ? phone.replace(/\D/g, "") : "");

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-10 lg:p-14 text-white">
            <span className="text-emerald-200 font-semibold text-sm tracking-widest uppercase">
              Contáctanos
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
              ¿En qué podemos ayudarte?
            </h2>
            <p className="mt-4 text-emerald-50">
              Consultas, alianzas comerciales, información o cualquier inquietud.
              Te respondemos en menos de 24 horas.
            </p>

            <div className="mt-10 space-y-5">
              {phone && (
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-200">Teléfono</div>
                    <div className="font-semibold">{phone}</div>
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-200">Email</div>
                    <div className="font-semibold">{email}</div>
                  </div>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-200">Oficina</div>
                    <div className="font-semibold">{address}</div>
                  </div>
                </div>
              )}
            </div>

            {wa && (
              <div className="mt-8">
                <WhatsAppButton phone={wa} size="lg">Contactar por WhatsApp</WhatsAppButton>
              </div>
            )}
          </div>

          <div className="bg-white p-10 lg:p-14">
            <h3 className="text-2xl font-bold text-slate-900">Envianos un mensaje</h3>
            <p className="text-slate-500 text-sm mt-1">Completa el formulario y te contactamos a la brevedad.</p>
            <div className="mt-6">
              <ContactForm phone={wa || undefined} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
