/**
 * Componente: NavbarComerciante
 * Barra superior del panel de control del comerciante con estilo oficial SpotMarket
 * Inspirado en Daiana45/proyect (fuentes Lobster/Inter, paleta negro/amarillo/gris-oscuro).
 */
import { Link } from 'react-router-dom';
import LogoNavbar from '../../assets/LogoNavbar.svg';

export default function NavbarComerciante({ usuario, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-negro/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={LogoNavbar} alt="SpotMarket" className="h-9 w-9 shrink-0 object-contain group-hover:scale-105 transition-transform" />
            <div className="flex items-baseline">
              <span className="font-marca text-2xl text-blanco">
                Spot<span className="text-amarillo">Market</span>
              </span>
              <span className="hidden sm:inline-block ml-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amarillo/10 text-amarillo border border-amarillo/20">
                Panel Comerciante
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-amarillo">{usuario?.nombre_local || 'Mi Comercio'}</p>
            <p className="text-[10px] text-gris-azulado">{usuario?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 cursor-pointer rounded-br-2xl border border-borde px-3.5 py-1.5 text-xs font-semibold text-gris-azulado hover:text-blanco hover:border-blanco transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
