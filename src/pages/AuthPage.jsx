/**
 * Página: AuthPage
 * Pantalla de inicio de sesión de SpotMarket:
 * - Fondo con mapa real interactivo de Formosa Capital.
 * - Muestra todos los comercios registrados con el logo de SpotMarket apuntando a su ubicación y su nombre.
 * - Tarjeta central dedicada exclusivamente a Iniciar Sesión (sin botón de registrar mi comercio).
 */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LoginForm from '../components/auth/LoginForm.jsx';
import LogoCompleto from '../assets/Logo.svg';
import LogoNavbar from '../assets/LogoNavbar.svg';
import { api } from '../services/api.js';

const FORMOSA = [-26.1849, -58.1731];

// Icono personalizado con el pin oficial de SpotMarket y el nombre del local comercial
function crearIconoComercio(nombre) {
  return L.divIcon({
    className: 'custom-spotmarket-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="background: rgba(11, 18, 32, 0.95); color: #FFF; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 8px; border: 1.5px solid #FFB800; box-shadow: 0 4px 12px rgba(0,0,0,0.7); white-space: nowrap; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span style="color: #FFB800;">📍</span> ${nombre}
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070C16]">
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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                  <Popup className="spot-popup">
                    <div className="p-1 text-black">
                      <p className="font-bold text-sm text-red-600">{com.nombre_local}</p>
                      <p className="text-xs text-gray-700 font-semibold uppercase">{com.tipo_comercio || 'Comercio'}</p>
                      <p className="text-xs text-gray-800 mt-1">📍 {com.direccion}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
        {/* Capa oscura sutil con viñeta para destacar la tarjeta de login */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* Indicador de comercios en Formosa */}
      <div className="absolute top-4 left-6 z-20 hidden sm:flex items-center gap-2 bg-[#0B111E]/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10 pointer-events-auto">
        <span className="text-xs font-bold text-gray-300">📍 Formosa Capital · {comercios.length} comercios registrados</span>
      </div>

      {/* ── TARJETA FLOTANTE DE INICIO DE SESIÓN ── */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl bg-[#0B1220]/95 backdrop-blur-xl border border-white/15 p-8 shadow-2xl space-y-4">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#070C16] border border-white/15 p-1 shadow-2xl flex items-center justify-center">
          <img src={LogoCompleto} alt="Spot Market Logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">
            Iniciar <span className="text-[#FFB800]">Sesión</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Accedé al panel de comerciante en SpotMarket
          </p>
        </div>
        <LoginForm onLoginExitoso={onLoginExitoso} />
      </div>
    </div>
  );
}
