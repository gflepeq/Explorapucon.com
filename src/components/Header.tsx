import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteLogo from "./SiteLogo";

const navLinks = [
  { label: "Servicios", to: "/servicios" },
  { label: "Alojamiento", to: "/categoria/alojamiento" },
  { label: "Gastronomía", to: "/categoria/gastronomia" },
  { label: "Tours", to: "/categoria/tours" },
  { label: "Transfer", to: "/categoria/transfer" },
  { label: "Nieve", to: "/categoria/nieve" },
  { label: "Contacto", to: "/contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAdmin) return null;

  const solid = scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-white/95 shadow-md backdrop-blur py-3"
          : "bg-gradient-to-b from-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <SiteLogo light={!solid} />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                solid ? "text-slate-700 hover:text-emerald-600" : "text-white/90 hover:text-emerald-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contacto"
            className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-emerald-500/30 transition"
          >
            Reservar
          </Link>
        </nav>

        <button
          aria-label="Menú"
          onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 rounded-md ${solid ? "text-slate-800" : "text-white"}`}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-slate-700 font-medium py-1.5 hover:text-emerald-600"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-emerald-500 text-white text-center font-semibold px-5 py-2.5"
            >
              Reservar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
