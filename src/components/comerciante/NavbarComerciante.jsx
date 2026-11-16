/**
 * Componente: NavbarComerciante
 * Barra superior del panel de control del comerciante con estilo oficial SpotMarket
 * Incluye selector de tema claro/oscuro y enlace a Inicio.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoNavbar from '../../assets/LogoNavbar.svg';

export default function NavbarComerciante({ usuario, onLogout }) {
  const [tema, setTema] = useState(() => {
    try {
      return localStorage.getItem('theme') || localStorage.getItem('tema') || 'oscuro';
    } catch {
      return 'oscuro';
    }
  });

  useEffect(() => {
    if (tema === 'claro') {
      document.documentElement.classList.add('tema-claro');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.remove('tema-claro');
      document.documentElement.style.colorScheme = 'dark';
    }
    try {
      localStorage.setItem('theme', tema);
      localStorage.setItem('tema', tema);
    } catch {}
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-negro/95 backdrop-blur-md shadow-md">
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
          {/* Selector de Modo Oscuro / Claro con icono de Sol/Luna */}
          <button
            type="button"
            onClick={alternarTema}
            aria-label={`Cambiar a tema ${tema === 'oscuro' ? 'claro' : 'oscuro'}`}
            className="shrink-0 cursor-pointer rounded-full p-2 text-gris-azulado transition hover:text-amarillo"
            title={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {tema === 'oscuro' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

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
