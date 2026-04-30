import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { type Service, useStore, StoreActions } from "../../data/store";

const empty: Service = {
  slug: "",
  name: "",
  category: "alojamiento",
  type: "",
  shortDesc: "",
  description: "",
  image: "",
  gallery: [],
  price: undefined,
  priceUnit: "noche",
  features: [],
  rating: 4.5,
  reviews: 0,
  duration: "",
  level: "",
  capacity: "",
  location: "",
  phone: "56912345678",
  badge: "",
  highlights: [],
  includes: [],
  published: true,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function AdminServiceEdit() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { services, categories } = useStore();
  const isNew = !slug || slug === "nuevo";

  const [form, setForm] = useState<Service>(empty);
  const [originalSlug, setOriginalSlug] = useState<string>("");

  useEffect(() => {
    if (!isNew && slug) {
      const existing = services.find((s) => s.slug === slug);
      if (existing) {
        setForm(existing);
        setOriginalSlug(existing.slug);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isNew]);

  const set = <K extends keyof Service>(k: K, v: Service[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Imagen muy grande (máx 1.5MB). Usa una URL externa para imágenes pesadas.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      if (field === "image") set("image", url);
      else set("gallery", [...(form.gallery || []), url]);
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let s = form.slug || slugify(form.name);
    if (isNew && services.find((x) => x.slug === s)) {
      s = `${s}-${Date.now().toString(36)}`;
    }
    if (!isNew && s !== originalSlug) {
      // slug changed → ensure unique
      if (services.find((x) => x.slug === s && x.slug !== originalSlug)) {
        s = `${s}-${Date.now().toString(36)}`;
      }
      // delete old, save new
      StoreActions.deleteService(originalSlug);
    }
    StoreActions.saveService({ ...form, slug: s });
    nav("/admin/servicios");
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm";
  const labelCls = "text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 block";

  const handleArrayInput = (field: "features" | "highlights" | "includes" | "gallery", value: string) => {
    set(field, value.split("\n").map((s) => s.trim()).filter(Boolean) as never);
  };

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/servicios" className="text-xs text-slate-500 hover:text-emerald-600">← Volver a servicios</Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            {isNew ? "Nuevo servicio" : "Editar servicio"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/servicios" className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 font-semibold text-sm text-slate-700">
            Cancelar
          </Link>
          <button type="submit" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 shadow-lg shadow-emerald-500/30">
            Guardar
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Básico */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Información básica</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Nombre del servicio *</label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Ej: Hotel Boutique Antawara" />
              </div>
              <div>
                <label className={labelCls}>Categoría *</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={`${inputCls} bg-white`} required>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Subcategoría / Tipo</label>
                <input value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls} placeholder="Ej: Hotel Boutique" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Descripción corta (1 línea)</label>
                <input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} className={inputCls} maxLength={120} placeholder="Aparece en las cards de listado" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Descripción completa</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={5} className={`${inputCls} resize-none`} placeholder="Descripción detallada del servicio..." />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Imágenes</h2>

            <label className={labelCls}>Imagen principal *</label>
            <div className="flex items-center gap-4">
              {form.image ? (
                <img src={form.image} alt="" className="h-24 w-32 rounded-lg object-cover border" />
              ) : (
                <div className="h-24 w-32 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-3xl">📷</div>
              )}
              <div className="flex-1 space-y-2">
                <input value={form.image} onChange={(e) => set("image", e.target.value)} className={inputCls} placeholder="URL de imagen (ej: /images/foto.jpg o https://...)" />
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" onChange={(e) => handleImage(e, "image")} className="text-xs" />
                  <span className="text-[11px] text-slate-400">Máx 1.5MB</span>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className={labelCls}>Galería adicional (una URL por línea)</label>
              <textarea
                value={(form.gallery || []).join("\n")}
                onChange={(e) => handleArrayInput("gallery", e.target.value)}
                rows={3}
                className={`${inputCls} resize-none font-mono text-xs`}
                placeholder="/images/foto1.jpg&#10;https://..."
              />
              <div className="flex items-center gap-2 mt-2">
                <input type="file" accept="image/*" onChange={(e) => handleImage(e, "gallery")} className="text-xs" />
                <span className="text-[11px] text-slate-400">o subir archivos a la galería</span>
              </div>
              {form.gallery && form.gallery.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {form.gallery.map((g, i) => (
                    <div key={i} className="relative group">
                      <img src={g} alt="" className="h-16 w-20 rounded-lg object-cover border" />
                      <button type="button" onClick={() => set("gallery", form.gallery!.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-xs opacity-0 group-hover:opacity-100">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detalles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Detalles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Duración</label>
                <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} placeholder="Ej: 1 día · 8 hrs" />
              </div>
              <div>
                <label className={labelCls}>Nivel</label>
                <input value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls} placeholder="Ej: Moderado" />
              </div>
              <div>
                <label className={labelCls}>Capacidad</label>
                <input value={form.capacity} onChange={(e) => set("capacity", e.target.value)} className={inputCls} placeholder="Ej: Hasta 6 personas" />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Características (una por línea)</label>
              <textarea
                value={form.features.join("\n")}
                onChange={(e) => handleArrayInput("features", e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Wi-Fi&#10;Estacionamiento&#10;Pet friendly"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelCls}>Lo más destacado (uno por línea)</label>
                <textarea
                  value={(form.highlights || []).join("\n")}
                  onChange={(e) => handleArrayInput("highlights", e.target.value)}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls}>¿Qué incluye? (uno por línea)</label>
                <textarea
                  value={(form.includes || []).join("\n")}
                  onChange={(e) => handleArrayInput("includes", e.target.value)}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estado */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Estado</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.published !== false} onChange={(e) => set("published", e.target.checked)} className="h-5 w-5 accent-emerald-500" />
              <div>
                <div className="font-semibold text-sm text-slate-900">Publicado</div>
                <div className="text-xs text-slate-500">Visible en el sitio público</div>
              </div>
            </label>

            <div className="mt-4">
              <label className={labelCls}>Slug (URL)</label>
              <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={`${inputCls} font-mono text-xs`} placeholder="se genera del nombre" />
              <div className="text-[10px] text-slate-400 mt-1">/servicio/{form.slug || slugify(form.name) || "..."}</div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Badge / Etiqueta</label>
              <input value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls} placeholder="Ej: Más popular, Nuevo, $$" />
            </div>
          </div>

          {/* Precio */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Precio</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Precio (CLP)</label>
                <input type="number" value={form.price ?? ""} onChange={(e) => set("price", e.target.value ? Number(e.target.value) : undefined)} className={inputCls} placeholder="50000" />
              </div>
              <div>
                <label className={labelCls}>Por</label>
                <select value={form.priceUnit} onChange={(e) => set("priceUnit", e.target.value)} className={`${inputCls} bg-white`}>
                  <option value="persona">persona</option>
                  <option value="noche">noche</option>
                  <option value="día">día</option>
                  <option value="servicio">servicio</option>
                  <option value="grupo">grupo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Contacto</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>WhatsApp (sin +, sin espacios) *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} className={`${inputCls} font-mono`} placeholder="56912345678" />
              </div>
              <div>
                <label className={labelCls}>Ubicación / Dirección *</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} placeholder="Av. O'Higgins 211, Pucón" />
              </div>
            </div>
          </div>

          {/* Reseñas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">Calificación</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Rating (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => set("rating", Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Reseñas</label>
                <input type="number" min="0" value={form.reviews} onChange={(e) => set("reviews", Number(e.target.value))} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Agencia (sólo tours / transfer / nieve) */}
          {(form.category === "tours" || form.category === "transfer" || form.category === "nieve") && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900">Agencia / Operador</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Empresa que presta el servicio</p>
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.agency}
                    onChange={(e) => set("agency", e.target.checked ? { name: "" } : undefined)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">Activar</span>
                </label>
              </div>

              {form.agency && (
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Nombre de la agencia *</label>
                    <input
                      value={form.agency.name}
                      onChange={(e) => set("agency", { ...form.agency!, name: e.target.value })}
                      className={inputCls}
                      placeholder="Ej: Aguaventura Expediciones"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Logo</label>
                    <div className="flex items-center gap-3">
                      {form.agency.logo ? (
                        <img src={form.agency.logo} alt="" className="h-14 w-14 rounded-xl object-cover border" />
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-lg">
                          {form.agency.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?"}
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <input
                          value={form.agency.logo || ""}
                          onChange={(e) => set("agency", { ...form.agency!, logo: e.target.value })}
                          className={inputCls}
                          placeholder="URL del logo (opcional)"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 500 * 1024) {
                              alert("Logo muy grande (máx 500KB)");
                              return;
                            }
                            const r = new FileReader();
                            r.onload = () => set("agency", { ...form.agency!, logo: r.result as string });
                            r.readAsDataURL(file);
                          }}
                          className="text-xs"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Si no subes logo, se usarán las iniciales con un color generado.</p>
                  </div>

                  <div>
                    <label className={labelCls}>Descripción</label>
                    <textarea
                      value={form.agency.description || ""}
                      onChange={(e) => set("agency", { ...form.agency!, description: e.target.value })}
                      rows={2}
                      className={`${inputCls} resize-none`}
                      placeholder="Breve descripción de la agencia..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Año fundación</label>
                      <input
                        value={form.agency.founded || ""}
                        onChange={(e) => set("agency", { ...form.agency!, founded: e.target.value })}
                        className={inputCls}
                        placeholder="2010"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Teléfono</label>
                      <input
                        value={form.agency.phone || ""}
                        onChange={(e) => set("agency", { ...form.agency!, phone: e.target.value })}
                        className={inputCls}
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>WhatsApp (sin +)</label>
                    <input
                      value={form.agency.whatsapp || ""}
                      onChange={(e) => set("agency", { ...form.agency!, whatsapp: e.target.value.replace(/\D/g, "") })}
                      className={`${inputCls} font-mono`}
                      placeholder="56912345678"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      value={form.agency.email || ""}
                      onChange={(e) => set("agency", { ...form.agency!, email: e.target.value })}
                      className={inputCls}
                      placeholder="contacto@agencia.com"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Sitio web</label>
                    <input
                      value={form.agency.website || ""}
                      onChange={(e) => set("agency", { ...form.agency!, website: e.target.value })}
                      className={inputCls}
                      placeholder="www.agencia.com"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Dirección</label>
                    <input
                      value={form.agency.address || ""}
                      onChange={(e) => set("agency", { ...form.agency!, address: e.target.value })}
                      className={inputCls}
                      placeholder="Av. O'Higgins 211, Pucón"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Certificaciones (una por línea)</label>
                    <textarea
                      value={(form.agency.certifications || []).join("\n")}
                      onChange={(e) => set("agency", { ...form.agency!, certifications: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                      rows={2}
                      className={`${inputCls} resize-none`}
                      placeholder="Sernatur&#10;Turismo Aventura&#10;UIAGM"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
