import { Link } from "react-router-dom";
import SiteLogo from "./SiteLogo";
// Link is used in nav sections below

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          <div>
            <SiteLogo variant="footer" className="mb-4" />
            <p className="text-sm leading-relaxed">
              Plataforma oficial de turismo de Pucón. Conectamos viajeros con +450
              prestadores certificados de la Araucanía.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categoria/alojamiento" className="hover:text-emerald-400">Alojamiento</Link></li>
              <li><Link to="/categoria/gastronomia" className="hover:text-emerald-400">Gastronomía</Link></li>
              <li><Link to="/categoria/tours" className="hover:text-emerald-400">Tours y Excursiones</Link></li>
              <li><Link to="/categoria/termas" className="hover:text-emerald-400">Termas</Link></li>
              <li><Link to="/categoria/rent-a-car" className="hover:text-emerald-400">Rent a Car</Link></li>
              <li><Link to="/categoria/transfer" className="hover:text-emerald-400">Transfer & Transporte</Link></li>
              <li><Link to="/categoria/nieve" className="hover:text-emerald-400">Esquí & Nieve</Link></li>
              <li><Link to="/servicios" className="hover:text-emerald-400 font-semibold text-emerald-400">Ver todas →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400">Inicio</Link></li>
              <li><Link to="/servicios" className="hover:text-emerald-400">Servicios</Link></li>
              <li><Link to="/contacto" className="hover:text-emerald-400">Contacto</Link></li>
              <li><a href="#" className="hover:text-emerald-400">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-emerald-400">Política de privacidad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Recibe ofertas y novedades sobre Pucón.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2.5 rounded-l-lg bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-emerald-500 min-w-0"
              />
              <button className="px-4 rounded-r-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold">
                →
              </button>
            </form>
            <div className="mt-5 flex gap-2 text-xs">
              <span className="px-2 py-1 bg-slate-800 rounded">Sernatur</span>
              <span className="px-2 py-1 bg-slate-800 rounded">Turismo Aventura</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div>© {new Date().getFullYear()} ExploraPucón.com — Todos los derechos reservados.</div>
          <div>Hecho con 🌋 en Pucón, Chile</div>
        </div>
      </div>
    </footer>
  );
}
