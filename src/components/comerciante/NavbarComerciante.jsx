/**
 * Componente: NavbarComerciante
 * Barra superior del panel de control del comerciante con Logo oficial.
 */
import { Link } from 'react-router-dom';
import LogoCompleto from '../../assets/Logo.svg';

export default function NavbarComerciante({ usuario, onLogout }) {
  return (
    <header className="bg-[#0B111E] border-b border-white/10 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-[#0B1220] border border-white/10 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform overflow-hidden shadow">
              <img src={LogoCompleto} alt="Spot Market Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline font-black tracking-tight text-lg leading-none">
                <span className="text-white">Spot</span>
                <span className="text-[#FFB800] ml-0.5">Market</span>
              </div>
              <span className="text-[9px] tracking-widest text-gray-400 uppercase font-semibold">Panel de Comerciante</span>
            </div>
          </Link>
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
