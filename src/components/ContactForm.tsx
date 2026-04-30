import { useState } from "react";

type Props = {
  phone?: string;
  serviceName?: string;
};

export default function ContactForm({ phone, serviceName }: Props) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    company: "",
    subject: serviceName ? `Consulta sobre: ${serviceName}` : "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      const text = `Nuevo mensaje desde ExploraPucón.com\n\n*Nombre:* ${form.name}\n*Email:* ${form.email}\n*Teléfono:* ${form.tel}\n*Empresa:* ${form.company || "—"}\n*Asunto:* ${form.subject || "—"}\n\n*Mensaje:*\n${form.message}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    }
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {serviceName && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
          <span className="text-emerald-700 font-semibold">Consultando por:</span>{" "}
          <span className="text-emerald-900 font-bold">{serviceName}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Nombre completo *
          </label>
          <input
            required
            placeholder="Tu nombre"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Email *
          </label>
          <input
            required
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Teléfono
          </label>
          <input
            placeholder="+56 9 XXXX XXXX"
            value={form.tel}
            onChange={(e) => set("tel", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Empresa / Organización
          </label>
          <input
            placeholder="Tu empresa (opcional)"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Asunto
        </label>
        <select
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className={`${inputCls} bg-white`}
        >
          <option value="">Selecciona un asunto</option>
          <option>Consulta general</option>
          <option>Información sobre tours</option>
          <option>Alojamiento</option>
          <option>Transporte / Transfer</option>
          <option>Eventos corporativos</option>
          <option>Propuesta comercial / Alianza</option>
          <option>Reclamo o sugerencia</option>
          <option>Otro</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Mensaje *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Contanos en qué podemos ayudarte..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 transition shadow-lg shadow-emerald-500/30"
      >
        {sent ? "✓ Mensaje enviado correctamente" : "Enviar mensaje"}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Nos pondremos en contacto a la brevedad. Tu información no será compartida con terceros.
      </p>
    </form>
  );
}
