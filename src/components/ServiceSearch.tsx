import { useState } from "react";

const categories = [
  "Alojamiento",
  "Gastronomía",
  "Tours y Excursiones",
  "Termas",
  "Turismo Aventura",
  "Turismo Rural y Mapuche",
  "Rent a Car",
  "Transfer & Transporte",
  "Esquí & Nieve",
  "Pesca con Mosca",
  "Eventos & Bodas",
  "Salud & Bienestar",
  "Entretención & Casino",
  "Compras & Artesanía",
  "Inmobiliaria",
];

const subcategoriesMap: Record<string, string[]> = {
  Alojamiento: ["Hoteles", "Cabañas", "Apart Hotel", "Lodge", "Hostales", "Camping", "Hospedaje", "Complejos Turísticos", "Glamping"],
  Gastronomía: ["Restaurantes", "Comida Típica", "Cafeterías", "Cervecerías", "Mariscos y Pescados", "Vegetariana / Vegana", "Pastelería", "Heladerías", "Sushi", "Comida Fusión", "Carnes / Parrilla", "Comida Rápida"],
  "Tours y Excursiones": ["Ascenso Volcán Villarrica", "Rafting Trancura", "Canopy", "Canyoning", "Trekking", "Tour en Bicicleta", "Cabalgatas", "Navegación lacustre", "City Tour"],
  Termas: ["Termas Geométricas", "Termas Los Pozones", "Termas de Huife", "Termas San Luis", "Termas Peumayen", "Termas Menetúe", "Termas Quimey-Co"],
  "Turismo Aventura": ["Volcán", "Parques Nacionales", "Hydrospeed", "Kayak", "Stand Up Paddle", "Parapente", "Buggies", "Bungee"],
  "Turismo Rural y Mapuche": ["Comunidades Mapuche", "Turismo Rural", "Artesanía", "Cocina Ancestral", "Telar y Tejido"],
  "Rent a Car": ["Autos económicos", "SUV / 4x4", "Camionetas", "Motos", "Bicicletas eléctricas"],
  "Transfer & Transporte": ["Transfer Aeropuerto Temuco", "Transfer Aeropuerto Santiago", "Transporte privado VIP", "Vans grupales", "Buses turísticos", "Taxis"],
  "Esquí & Nieve": ["Centro de Ski Pucón", "Arriendo de equipos", "Clases de esquí", "Snowboard", "Snow tour"],
  "Pesca con Mosca": ["Río Trancura", "Río Liucura", "Lago Caburgua", "Lago Villarrica", "Lagos cordilleranos", "Guías especializados"],
  "Eventos & Bodas": ["Bodas en Pucón", "Salones de eventos", "Catering", "Wedding planners", "Fotografía de bodas"],
  "Salud & Bienestar": ["Spa", "Masajes", "Yoga & Meditación", "Centros médicos", "Farmacias 24/7", "Dentistas"],
  "Entretención & Casino": ["Casino Enjoy Pucón", "Bares y pubs", "Discotecas", "Karaoke", "Bowling", "Cines"],
  "Compras & Artesanía": ["Boutiques", "Artesanía mapuche", "Delicatessen y Gourmet", "Souvenirs", "Outdoor / Trekking", "Mercados"],
  Inmobiliaria: ["Cabañas en arriendo", "Casas vacacionales", "Corredores de propiedades", "Proyectos inmobiliarios"],
};

export default function ServiceSearch() {
  const [category, setCategory] = useState("Alojamiento");
  const [sub, setSub] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Map category to slug
    const slugMap: Record<string, string> = {
      Alojamiento: "alojamiento",
      Gastronomía: "gastronomia",
      "Tours y Excursiones": "tours",
      Termas: "termas",
      "Turismo Aventura": "tours",
      "Turismo Rural y Mapuche": "tours",
      "Rent a Car": "rent-a-car",
      "Transfer & Transporte": "transfer",
      "Esquí & Nieve": "nieve",
      "Pesca con Mosca": "tours",
      "Eventos & Bodas": "tours",
      "Salud & Bienestar": "tours",
      "Entretención & Casino": "tours",
      "Compras & Artesanía": "tours",
      Inmobiliaria: "tours",
    };
    const slug = slugMap[category] || "alojamiento";
    window.location.hash = `#/categoria/${slug}`;
    // also keep date/sub state for future use
    void date; void sub;
  };

  return (
    <section className="relative -mt-16 z-30 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <h2 className="font-bold text-slate-900 text-base sm:text-lg">
            Buscador de servicios turísticos
          </h2>
          <span className="ml-auto text-xs text-slate-500 hidden sm:block">+450 prestadores · 15 categorías</span>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              ¿Qué buscas?
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSub("");
              }}
              className="mt-1 w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Subcategoría
            </label>
            <select
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="mt-1 w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            >
              <option value="">Todas</option>
              {(subcategoriesMap[category] || []).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 transition shadow-lg shadow-emerald-500/30"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="text-slate-500">Populares:</span>
          {["Hoteles", "Restaurantes", "Ascenso Volcán Villarrica", "Termas Geométricas", "Cabañas", "Rafting Trancura", "Transfer Aeropuerto Temuco", "Centro de Ski Pucón"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const map: Record<string, string> = {
                  Hoteles: "Alojamiento",
                  Restaurantes: "Gastronomía",
                  "Ascenso Volcán Villarrica": "Tours y Excursiones",
                  "Termas Geométricas": "Termas",
                  Cabañas: "Alojamiento",
                  "Rafting Trancura": "Tours y Excursiones",
                  "Transfer Aeropuerto Temuco": "Transfer & Transporte",
                  "Centro de Ski Pucón": "Esquí & Nieve",
                };
                setCategory(map[tag]);
                setSub(tag);
              }}
              className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
