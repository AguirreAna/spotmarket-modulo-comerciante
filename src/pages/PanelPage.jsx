/**
 * Página: PanelPage
 * Dashboard centralizado para el comerciante:
 * - 1) Métricas / Resumen: KPIs, ranking de productos más solicitados/vistos y valoraciones de clientes.
 * - 2) Gestión de Catálogo (CRUD): Alta, edición, eliminación de productos con foto (sin stock ni regateo).
 * - 3) Gestión de Ofertas Temporales: Crear, editar, pausar promociones (sincronizadas con Inicio).
 * - 4) Perfil del Comercio: WhatsApp comercial, teléfono, horario de atención, tipo (Minorista/Mayorista) y dirección.
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
  const [tabActiva, setTabActiva] = useState('resumen');
  const [comercio, setComercio] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [resumenVal, setResumenVal] = useState(null);
  const [masBuscados, setMasBuscados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      // 1) Cargar datos del comercio actual autenticado
      let datosComercio = null;
      try {
        const resMiComercio = await api('/comercios/mi-comercio');
        if (resMiComercio?.comercio) {
          datosComercio = resMiComercio.comercio;
        }
      } catch {
        // Fallback si la ruta directa no responde
        const resMe = await api('/auth/me');
        const cId = resMe.usuario?.comercioId || usuario?.comercioId;
        if (cId) {
          const resC = await api(`/comercios/${cId}`);
          datosComercio = resC.comercio;
        }
      }

      if (datosComercio) {
        setComercio(datosComercio);
        setProductos(datosComercio.productos || []);
      }

      // 2) Ofertas vigentes del comerciante
      try {
        const resOfertas = await api('/ofertas/mis-ofertas');
        if (resOfertas?.ofertas) {
          setOfertas(resOfertas.ofertas);
        }
      } catch {
        // fallback
      }

      // 3) Resumen de valoraciones y opiniones de vecinos
      try {
        const resVal = await api('/valoraciones/mi-comercio');
        if (resVal?.resumen) {
          setResumenVal(resVal.resumen);
        }
      } catch {
        // fallback
      }

      // 4) Productos más buscados e interactuados en la plataforma
      try {
        const resTop = await api('/comercios/mas-buscados');
        if (resTop?.productos) {
          setMasBuscados(resTop.productos);
        }
      } catch {
        // fallback
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

  const ofertasVigentes = ofertas.filter(
    (o) => new Date(o.fecha_fin) >= new Date()
  ).length;

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
              📍 {comercio?.direccion || 'Formosa Capital'} · {comercio?.tipo_comercio || 'Minorista'}
              {comercio?.whatsapp ? ` · WhatsApp: ${comercio.whatsapp}` : (comercio?.telefono ? ` · Tel: ${comercio.telefono}` : '')}
              {comercio?.horario_atencion ? ` · Horario: ${comercio.horario_atencion}` : ''}
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
                    ? 'bg-[#FFB800] text-black shadow-lg scale-[1.02]'
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
          <div className="py-20 text-center text-gray-400 text-sm flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#FFB800] border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando panel de gestión comercial...</span>
          </div>
        ) : (
          <div>
            {tabActiva === 'resumen' && (
              <ResumenDashboard
                productos={productos}
                ofertasActivas={ofertasVigentes}
                vistasTotales={vistasTotales}
                resumenVal={resumenVal}
                masBuscados={masBuscados}
                onIrATab={(tabId) => setTabActiva(tabId)}
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
                ofertas={ofertas}
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
