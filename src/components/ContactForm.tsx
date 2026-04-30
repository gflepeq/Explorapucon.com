import { useState } from "react";

type Props = {
  serviceName?: string;
  category?: string;
  phone?: string;
  compact?: boolean;
};

export default function ContactForm({ serviceName, category, phone, compact = false }: Props) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    tel: "",
    date: "",
    pax: "2",
    message: serviceName
      ? `Hola, me interesa el servicio "${serviceName}". Quisiera más información.`
      : "",
  });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      const text = `Nueva consulta desde ExploraPucón.com\n\n*Servicio:* ${serviceName || "—"}\n*Nombre:* ${form.name}\n*Email:* ${form.email}\n*Teléfono:* ${form.tel}\n*Fecha:* ${form.date || "Por definir"}\n*Personas:* ${form.pax}\n\n*Mensaje:*\n${form.message}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    }
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm bg-white";

  return (
    <form onSubmit={handle} className="space-y-3">
      {serviceName && !compact && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
          <span className="text-emerald-700 font-semibold">Consultando por:</span>{" "}
          <span className="text-emerald-900 font-bold">{serviceName}</span>
          {category && <span className="block text-xs text-emerald-700 mt-0.5">Categoría: {category}</span>}
        </div>
      )}

      <div className={compact ? "" : "grid sm:grid-cols-2 gap-3"}>
        <input required placeholder="Nombre completo" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <input placeholder="Teléfono / WhatsApp" value={form.tel} onChange={(e) => set("tel", e.target.value)} className={inputCls} />
        <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
        <select value={form.pax} onChange={(e) => set("pax", e.target.value)} className={inputCls}>
          {["1", "2", "3", "4", "5", "6", "7", "8+"].map((n) => (
            <option key={n}>{n} pax</option>
          ))}
        </select>
      </div>

      <textarea
        rows={compact ? 3 : 4}
        placeholder="Cuéntanos más sobre tu consulta..."
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        className={`${inputCls} resize-none`}
      />

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 transition shadow-lg shadow-emerald-500/30"
      >
        {sent ? "✓ Enviado · Te contactaremos pronto" : phone ? "Enviar consulta por WhatsApp" : "Enviar consulta"}
      </button>

      <p className="text-[11px] text-slate-500 text-center">
        Al enviar aceptas nuestros términos y política de privacidad.
      </p>
    </form>
  );
}
