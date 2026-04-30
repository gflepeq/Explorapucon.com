import type { Agency } from "../data/store";

type Props = {
  agency: Agency;
  variant?: "default" | "compact";
  accent?: string; // tailwind text color class for the category accent
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function colorFromName(name: string): string {
  const palette = [
    "from-emerald-500 to-teal-700",
    "from-indigo-500 to-blue-700",
    "from-orange-500 to-rose-600",
    "from-purple-500 to-fuchsia-700",
    "from-amber-500 to-yellow-700",
    "from-cyan-500 to-blue-700",
    "from-rose-500 to-pink-700",
    "from-slate-600 to-slate-900",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

function AgencyLogo({ agency, size = 56 }: { agency: Agency; size?: number }) {
  if (agency.logo) {
    return (
      <img
        src={agency.logo}
        alt={agency.name}
        className="rounded-xl object-cover bg-white border border-slate-200"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = getInitials(agency.name);
  const grad = colorFromName(agency.name);
  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-extrabold shadow-md`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export default function AgencyCard({ agency, variant = "default", accent = "text-emerald-600" }: Props) {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3">
        <AgencyLogo agency={agency} size={40} />
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Operado por</div>
          <div className="font-bold text-slate-900 text-sm truncate">{agency.name}</div>
        </div>
      </div>
    );
  }

  const waLink = agency.whatsapp
    ? `https://wa.me/${agency.whatsapp}?text=${encodeURIComponent("Hola, vi su agencia en ExploraPucón.com")}`
    : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Operado por</h2>
        {agency.founded && (
          <span className={`text-xs font-semibold ${accent} bg-slate-50 px-3 py-1 rounded-full`}>
            Desde {agency.founded}
          </span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <AgencyLogo agency={agency} size={64} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{agency.name}</h3>
          {agency.description && (
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{agency.description}</p>
          )}
        </div>
      </div>

      {agency.certifications && agency.certifications.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {agency.certifications.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-5 border-t border-slate-100 grid sm:grid-cols-2 gap-3 text-sm">
        {agency.phone && (
          <a href={`tel:${agency.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition">
            <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">📞</span>
            <span className="truncate">{agency.phone}</span>
          </a>
        )}
        {agency.email && (
          <a href={`mailto:${agency.email}`} className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition">
            <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">✉️</span>
            <span className="truncate">{agency.email}</span>
          </a>
        )}
        {agency.website && (
          <a href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition">
            <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">🌐</span>
            <span className="truncate">{agency.website.replace(/^https?:\/\//, "")}</span>
          </a>
        )}
        {agency.address && (
          <div className="flex items-center gap-2 text-slate-700">
            <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">📍</span>
            <span className="truncate">{agency.address}</span>
          </div>
        )}
      </div>

      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-sm transition shadow-md shadow-green-500/30"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
          </svg>
          Contactar agencia por WhatsApp
        </a>
      )}
    </div>
  );
}

export { AgencyLogo };
