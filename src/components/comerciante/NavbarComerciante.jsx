/**
 * Componente: NavbarComerciante
 * Barra superior del panel de control del comerciante.
 */
import { Link } from 'react-router-dom';

export default function NavbarComerciante({ usuario, onLogout }) {
  return (
    <header className="bg-[#0B111E] border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 font-black text-lg">
            <span className="text-red-500">📍</span>
            <span className="text-white">Spot</span>
            <span className="text-[#FFB800]">Market</span>
          </Link>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="text-xs font-bold text-gray-300 hidden sm:inline">
            Panel de Administración
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#FFB800]">{usuario?.nombre_local || 'Mi Comercio'}</p>
            <p className="text-[10px] text-gray-400">{usuario?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-bold bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
