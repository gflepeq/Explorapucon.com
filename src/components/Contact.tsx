import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-10 lg:p-14 text-white">
            <span className="text-emerald-200 font-semibold text-sm tracking-widest uppercase">
              Contáctanos
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">
              ¿Listo para vivir tu aventura en Pucón?
            </h2>
            <p className="mt-4 text-emerald-50">
              Cuéntanos qué experiencias te interesan y armamos un plan a tu medida.
              Respondemos en menos de 24 horas.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <div className="text-xs text-emerald-200">WhatsApp / Tel</div>
                  <div className="font-semibold">+56 9 1234 5678</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Email</div>
                  <div className="font-semibold">contacto@explorapucon.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div className="text-xs text-emerald-200">Oficina</div>
                  <div className="font-semibold">Av. O'Higgins 211, Pucón, Chile</div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              {["facebook", "instagram", "youtube", "tiktok"].map((s) => (
                <a key={s} href="#" className="h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
                  <span className="text-xs uppercase font-semibold">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 lg:p-14">
            <h3 className="text-2xl font-bold text-slate-900">Cotiza tu tour</h3>
            <p className="text-slate-500 text-sm mt-1">Completa el formulario y te contactamos.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white"
                defaultValue=""
              >
                <option value="" disabled>Servicio de interés</option>
                <optgroup label="Alojamiento">
                  <option>Hoteles</option>
                  <option>Cabañas</option>
                  <option>Lodge / Apart Hotel</option>
                  <option>Camping / Hostales</option>
                </optgroup>
                <optgroup label="Gastronomía">
                  <option>Reservas en restaurantes</option>
                  <option>Tour gastronómico</option>
                </optgroup>
                <optgroup label="Tours y Excursiones">
                  <option>Ascenso Volcán Villarrica</option>
                  <option>Rafting Río Trancura</option>
                  <option>Termas Geométricas</option>
                  <option>Trekking Huerquehue</option>
                  <option>Ojos del Caburgua</option>
                  <option>Canopy / Canyoning</option>
                </optgroup>
                <optgroup label="Transporte">
                  <option>Rent a Car</option>
                  <option>Transfer Aeropuerto Temuco</option>
                  <option>Transporte privado VIP</option>
                </optgroup>
                <optgroup label="Invierno">
                  <option>Centro de Ski Pucón</option>
                  <option>Clases de esquí / snowboard</option>
                  <option>Arriendo de equipos de nieve</option>
                </optgroup>
                <optgroup label="Otros servicios">
                  <option>Pesca con Mosca</option>
                  <option>Turismo Rural y Mapuche</option>
                  <option>Spa & Bienestar</option>
                  <option>Eventos & Bodas</option>
                  <option>Compras & Artesanía</option>
                  <option>Paquete personalizado</option>
                </optgroup>
              </select>
              <textarea
                rows={4}
                placeholder="Cuéntanos sobre tu viaje..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 transition shadow-lg shadow-emerald-500/30"
              >
                {sent ? "✓ Mensaje enviado" : "Enviar Cotización"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
