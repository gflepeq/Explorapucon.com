import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Try to play (some mobile browsers need an explicit call)
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
    >
      {/* Poster image as instant background (Ken Burns slow zoom) */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          videoReady ? "opacity-0" : "opacity-100"
        } animate-[kenburns_20s_ease-in-out_infinite_alternate]`}
        style={{ backgroundImage: "url('/images/hero-pucon.jpg')" }}
      />

      {/* Background video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/hero-pucon.jpg"
        onCanPlay={() => setVideoReady(true)}
      >
        {/* Aerial drone footage of snow-capped mountains in Chile (Andes) - Pexels CC0 */}
        <source
          src="https://videos.pexels.com/video-files/33655179/14300594_2560_1440_60fps.mp4"
          type="video/mp4"
        />
        {/* Fallback: misty volcano */}
        <source
          src="https://videos.pexels.com/video-files/28002918/12286719_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      {/* Subtle animated grain / particles using CSS */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
           style={{
             backgroundImage:
               "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
             backgroundSize: "3px 3px",
           }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-24 pb-16">
        <span className="inline-block bg-emerald-500/20 backdrop-blur border border-emerald-300/40 text-emerald-100 text-xs font-semibold tracking-[0.25em] uppercase px-4 py-2 rounded-full mb-6 animate-[fadeInUp_0.8s_ease-out_both]">
          Pucón · Región de la Araucanía · Chile
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight animate-[fadeInUp_1s_ease-out_0.15s_both] drop-shadow-2xl">
          Vive la <span className="text-emerald-400">aventura</span> <br className="hidden sm:block" />
          en el corazón del sur de Chile
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-light animate-[fadeInUp_1s_ease-out_0.3s_both] drop-shadow-lg">
          Tours guiados al volcán Villarrica, rafting, termas, parques nacionales y
          mucho más. Diseñamos experiencias inolvidables en Pucón.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-[fadeInUp_1s_ease-out_0.45s_both]">
          <a
            href="/#/categoria/tours"
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 px-8 py-4 text-base font-semibold shadow-xl shadow-emerald-700/40 transition transform hover:-translate-y-0.5"
          >
            Ver Tours Disponibles
          </a>
          <a
            href="/#/contacto"
            className="rounded-full bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 px-8 py-4 text-base font-semibold transition"
          >
            Cotizar mi Viaje
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto animate-[fadeInUp_1s_ease-out_0.6s_both]">
          {[
            { n: "+10", l: "Años de experiencia" },
            { n: "+50", l: "Tours disponibles" },
            { n: "+15K", l: "Viajeros felices" },
            { n: "4.9★", l: "Calificación" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-emerald-300 drop-shadow">{s.n}</div>
              <div className="text-xs sm:text-sm text-white/80 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live "video" indicator */}
      <div className="absolute top-24 right-6 z-10 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase">
          {videoReady ? "Volcán Villarrica · 4K" : "Cargando..."}
        </span>
      </div>

      <a
        href="#tours"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 z-10 animate-bounce"
        aria-label="Bajar"
      >
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
