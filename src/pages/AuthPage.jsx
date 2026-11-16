/**
 * Página: AuthPage
 * Pantalla de autenticación de SpotMarket:
 * - Fondo con mapa interactivo de Formosa Capital con pines de comercios registrados.
 * - Tarjeta central para Iniciar Sesión con opción de "(Recuperar contraseña)".
 * - Permite alternar hacia el Registro Dual (Usuarios y Comerciantes).
 */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoginForm from '../components/auth/LoginForm.jsx';
import RegisterComercioForm from '../components/auth/RegisterComercioForm.jsx';
import LogoNavbar from '../assets/LogoNavbar.svg';
import { api } from '../services/api.js';

const FORMOSA = [-26.1849, -58.1731];

// Icono personalizado con el pin oficial de SpotMarket y el nombre del local comercial
function crearIconoComercio(nombre) {
  return L.divIcon({
    className: 'custom-spotmarket-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="background: rgba(10, 20, 40, 0.95); color: #f4f7ff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 8px; border: 1.5px solid #ffc72c; box-shadow: 0 4px 12px rgba(0,0,0,0.7); white-space: nowrap; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span style="color: #ffc72c;">●</span> ${nombre}
        </div>
        <div style="width: 36px; height: 36px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.6));">
          <img src="${LogoNavbar}" style="width: 100%; height: 100%; object-fit: contain;" alt="${nombre}" />
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
}

export default function AuthPage({ onLoginExitoso }) {
  const [comercios, setComercios] = useState([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // Modo Oscuro / Claro
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

  useEffect(() => {
    async function cargarComercios() {
      try {
        const res = await api('/comercios');
        setComercios(res.comercios || []);
      } catch (err) {
        console.warn('Error cargando comercios en login:', err.message);
      }
    }
    cargarComercios();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-negro py-10 transition-colors duration-200">
      {/* ── MAPA DE FORMOSA CAPITAL EN EL FONDO ── */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={FORMOSA}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {comercios
            .filter((c) => c.latitud && c.longitud)
            .map((com) => {
              const lat = parseFloat(com.latitud);
              const lng = parseFloat(com.longitud);
              return (
                <Marker
                  key={com.id}
                  position={[lat, lng]}
                  icon={crearIconoComercio(com.nombre_local)}
                >
                  <Popup>
                    <div className="p-1 text-blanco">
                      <p className="font-bold text-sm text-amarillo">{com.nombre_local}</p>
                      <p className="text-xs text-gris-azulado font-semibold uppercase">{com.tipo_comercio || 'Comercio'}</p>
                      <p className="text-xs text-blanco mt-1">{com.direccion}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
        <div className="absolute inset-0 bg-negro/50 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* Indicador de comercios en mapa */}
      <div className="absolute top-4 left-6 z-20 hidden sm:flex items-center gap-2 bg-gris-oscuro/90 backdrop-blur px-3 py-1.5 rounded-xl border border-borde">
        <span className="text-xs font-bold text-gris-azulado">Formosa Capital · {comercios.length} comercios en mapa</span>
      </div>

      {/* Selector de Modo Oscuro / Claro en AuthPage */}
      <div className="absolute top-4 right-6 z-20">
        <button
          type="button"
          onClick={alternarTema}
          aria-label={`Cambiar a tema ${tema === 'oscuro' ? 'claro' : 'oscuro'}`}
          className="flex items-center gap-2 bg-gris-oscuro/90 backdrop-blur px-3 py-1.5 rounded-xl border border-borde text-gris-azulado hover:text-amarillo transition shadow-md cursor-pointer"
          title={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {tema === 'oscuro' ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          <span className="text-xs font-bold">{tema === 'oscuro' ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>
      </div>

      {/* ── TARJETA CENTRAL ── */}
      <div className={`relative z-10 w-full ${mostrarRegistro ? 'max-w-2xl' : 'max-w-md'} mx-4 rounded-3xl bg-gris-oscuro/95 backdrop-blur-xl border border-borde p-6 sm:p-8 shadow-2xl transition-all`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <img src={LogoNavbar} alt="SpotMarket Logo" className="h-10 w-10 object-contain" />
            <span className="font-marca text-3xl text-blanco">
              Spot<span className="text-amarillo">Market</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-blanco">
            {mostrarRegistro ? 'Registro en SpotMarket' : 'Iniciar Sesión'}
          </h1>
          <p className="text-xs text-gris-azulado mt-1">
            {mostrarRegistro
              ? 'Registrá tu comercio local o tu cuenta de vecino consumidor'
              : 'Accedé para administrar tu comercio o consultar promociones'}
          </p>
        </div>

        {mostrarRegistro ? (
          <RegisterComercioForm
            onRegistroExitoso={(u) => {
              if (onLoginExitoso) onLoginExitoso(u);
            }}
            onVolverLogin={() => setMostrarRegistro(false)}
          />
        ) : (
          <>
            <LoginForm onLoginExitoso={onLoginExitoso} />
            <div className="mt-6 pt-4 border-t border-borde/60 text-center">
              <p className="text-xs text-gris-azulado">
                ¿No tenés una cuenta todavía?{' '}
                <button
                  type="button"
                  onClick={() => setMostrarRegistro(true)}
                  className="text-amarillo hover:underline font-bold"
                >
                  Registrate gratis
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
