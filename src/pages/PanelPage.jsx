/**
 * Página: PanelPage
 * Dashboard centralizado para el comerciante:
 * - Resumen general
 * - Gestión de catálogo de productos (CRUD)
 * - Ofertas vigentes
 * - Configuración del local y contacto
 */
import { useState, useEffect, useCallback } from 'react';
import NavbarComerciante from '../components/comerciante/NavbarComerciante.jsx';
import ResumenDashboard from '../components/comerciante/ResumenDashboard.jsx';
import GestionProductos from '../components/comerciante/GestionProductos.jsx';
import GestionOfertas from '../components/comerciante/GestionOfertas.jsx';
import PerfilComercio from '../components/comerciante/PerfilComercio.jsx';
import { api } from '../services/api.js';

const TABS = [
  { id: 'resumen', label: 'Resumen General', icono: '📊' },
  { id: 'productos', label: 'Catálogo de Productos', icono: '📦' },
  { id: 'ofertas', label: 'Ofertas & Descuentos', icono: '🏷️' },
  { id: 'perfil', label: 'Perfil del Comercio', icono: '🏪' }
];

export default function PanelPage({ usuario, onLogout }) {
  const [tabActiva, setTabActiva] = useState('productos');
  const [comercio, setComercio] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      if (!usuario?.comercioId) {
        // Intentar recuperar sesión desde el backend
        const resMe = await api('/auth/me');
        if (resMe.usuario?.comercioId) {
          const resC = await api(`/comercios/${resMe.usuario.comercioId}`);
          setComercio(resC.comercio);
        }
      } else {
        const resC = await api(`/comercios/${usuario.comercioId}`);
        setComercio(resC.comercio);
      }
    } catch (err) {
      console.warn('Error al cargar datos del comercio:', err.message);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const productos = comercio?.productos || [];
  const ofertasActivas = productos.flatMap((p) => p.ofertas || []).length;
  const vistasTotales = productos.reduce((acc, p) => acc + (p.vistas || 0), 0);

  return (
    <div className="min-h-screen bg-[#070C16] text-white">
      <NavbarComerciante usuario={usuario} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Encabezado del Comercio */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {comercio?.nombre_local || usuario?.nombre_local || 'Mi Comercio'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Abierto en SpotMarket
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              📍 {comercio?.direccion || 'Formosa Capital'} · {comercio?.tipo_comercio || 'Comercio barrial'} · WhatsApp: {comercio?.telefono || 'No especificado'}
            </p>
          </div>

          {/* Navegación por Pestañas */}
          <div className="flex flex-wrap gap-1.5 bg-[#111A2E] p-1.5 rounded-2xl border border-white/10">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTabActiva(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  tabActiva === t.id
                    ? 'bg-[#FFB800] text-black shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.icono}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {cargando ? (
          <div className="py-20 text-center text-gray-400 text-sm">
            Cargando información del comercio...
          </div>
        ) : (
          <div>
            {tabActiva === 'resumen' && (
              <ResumenDashboard
                productos={productos}
                ofertasActivas={ofertasActivas}
                vistasTotales={vistasTotales}
              />
            )}

            {tabActiva === 'productos' && (
              <GestionProductos
                productos={productos}
                onActualizar={cargarDatos}
              />
            )}

            {tabActiva === 'ofertas' && (
              <GestionOfertas
                productos={productos}
                onActualizar={cargarDatos}
              />
            )}

            {tabActiva === 'perfil' && (
              <PerfilComercio
                comercio={comercio}
                onActualizar={cargarDatos}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
