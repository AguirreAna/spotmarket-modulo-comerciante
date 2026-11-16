/**
 * Componente: ResumenDashboard
 * Métricas clave del comercio:
 * - 4 KPIs: productos activos, ofertas vigentes, visitas comunitarias y valoración media de productos.
 * - Ranking de productos más solicitados, vistos y mejor valorados.
 * - Listado de opiniones y valoraciones recibidas de los clientes de Formosa.
 */
import { resolverUrlImagen } from '../../utils/imageUrl.js';

export default function ResumenDashboard({
  productos = [],
  ofertasActivas = 0,
  vistasTotales = 0,
  resumenVal = null,
  masBuscados = [],
  onIrATab
}) {
  const valoraciones = resumenVal?.valoraciones || [];
  const promedioEstrellas = resumenVal?.promedio != null ? resumenVal.promedio : null;

  return (
    <div className="space-y-8">
      {/* ── 4 TARJETAS KPI ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Productos Activos</span>
            <span className="text-base">📦</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-white">{productos.length}</p>
            {onIrATab && (
              <button
                onClick={() => onIrATab('productos')}
                className="text-xs text-[#FFB800] hover:underline font-semibold"
              >
                Catálogo &rarr;
              </button>
            )}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">Publicados en góndola barrial</p>
        </div>

        <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Ofertas Vigentes</span>
            <span className="text-base">🏷️</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-black text-[#EF4444]">{ofertasActivas}</p>
            {onIrATab && (
              <button
                onClick={() => onIrATab('ofertas')}
                className="text-xs text-[#FFB800] hover:underline font-semibold"
              >
                Promos &rarr;
              </button>
            )}
          </div>
          <p className="text-[11px] text-yellow-300/80 font-medium">Descuentos activos en Inicio</p>
        </div>

        <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Vistas Comunitarias</span>
            <span className="text-base">👁️</span>
          </div>
          <p className="text-3xl font-black text-blue-400">{vistasTotales}</p>
          <p className="text-[11px] text-blue-300/80 font-medium">Interacciones de clientes</p>
        </div>

        <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
            <span>Valoración Media</span>
            <span className="text-base">⭐</span>
          </div>
          <p className="text-3xl font-black text-amber-300">
            {promedioEstrellas != null ? `${promedioEstrellas} ★` : '—'}
          </p>
          <p className="text-[11px] text-gray-400 font-medium">
            {resumenVal?.total ? `Basado en ${resumenVal.total} reseñas` : 'Aún sin calificaciones'}
          </p>
        </div>
      </div>

      {/* ── SECCIÓN DOBLE: PRODUCTOS MÁS SOLICITADOS / VISTOS Y VALORACIONES RECIBIDAS ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Productos más solicitados y vistos */}
        <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔥</span> Productos más solicitados y vistos
            </h3>
            <span className="text-xs text-gray-400">Góndola Formosa</span>
          </div>

          <div className="space-y-2.5">
            {(masBuscados.length > 0 ? masBuscados : productos.slice(0, 5)).map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#FFB800] w-4">#{idx + 1}</span>
                  <div className="w-11 h-11 rounded-lg bg-black/40 overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/10">
                    {p.imagen_url ? (
                      <img
                        src={resolverUrlImagen(p.imagen_url)}
                        alt={p.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[180px]">{p.nombre}</p>
                    <p className="text-[10px] text-gray-400">
                      ${Number(p.precio_oferta || p.precio).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">{p.vistas || 0} vistas</span>
                  <span className="text-[10px] text-red-400 font-medium">♥ {p.likes || 0} favoritos</span>
                </div>
              </div>
            ))}

            {productos.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">
                Aún no tenés productos cargados en tu catálogo para medir visualizaciones.
              </p>
            )}
          </div>
        </div>

        {/* Opiniones y valoraciones recibidas de los vecinos */}
        <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>💬</span> Valoraciones recibidas de los clientes
            </h3>
            <span className="text-xs text-[#FFB800] font-bold">
              {promedioEstrellas ? `${promedioEstrellas} de 5 estrellas` : 'Sin opiniones'}
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {valoraciones.map((val) => (
              <div
                key={val.id}
                className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {val.usuario?.nombre || 'Cliente SpotMarket'}
                    </span>
                    <span className="text-[#FFB800] text-xs">{'★'.repeat(val.puntuacion || 5)}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {val.createdAt ? new Date(val.createdAt).toLocaleDateString('es-AR') : ''}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 italic">"{val.comentario}"</p>
                {val.productoNombre && (
                  <p className="text-[10px] text-[#FFB800] font-medium pt-1">
                    Producto calificado: {val.productoNombre}
                  </p>
                )}
              </div>
            ))}

            {valoraciones.length === 0 && (
              <div className="text-center py-8 text-gray-400 space-y-1">
                <span className="text-2xl block">⭐</span>
                <p className="text-xs font-medium">Tus productos aún no recibieron valoraciones.</p>
                <p className="text-[11px] text-gray-500">
                  A medida que los vecinos consulten tus productos en el mapa podrán calificar su satisfacción.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
