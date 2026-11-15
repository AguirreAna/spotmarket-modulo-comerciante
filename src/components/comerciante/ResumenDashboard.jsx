/**
 * Componente: ResumenDashboard
 * Métricas clave del comercio: productos activos, ofertas vigentes y visitas comunitarias.
 */
export default function ResumenDashboard({ productos = [], ofertasActivas = 0, vistasTotales = 0, valoracionPromedio = null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
          <span>Productos Publicados</span>
          <span className="text-base">📦</span>
        </div>
        <p className="text-3xl font-black text-white">{productos.length}</p>
        <p className="text-[11px] text-emerald-400 font-medium">Activos en el catálogo de Formosa</p>
      </div>

      <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
          <span>Ofertas Vigentes</span>
          <span className="text-base">🏷️</span>
        </div>
        <p className="text-3xl font-black text-[#FFB800]">{ofertasActivas}</p>
        <p className="text-[11px] text-yellow-300/80 font-medium">Con descuento visible para vecinos</p>
      </div>

      <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
          <span>Visitas del Catálogo</span>
          <span className="text-base">👁️</span>
        </div>
        <p className="text-3xl font-black text-blue-400">{vistasTotales}</p>
        <p className="text-[11px] text-blue-300/80 font-medium">Consultas acumuladas en góndola</p>
      </div>

      <div className="bg-[#111A2E] border border-white/10 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
          <span>Opinión de la Comunidad</span>
          <span className="text-base">⭐</span>
        </div>
        <p className="text-3xl font-black text-amber-300">
          {valoracionPromedio != null ? `${valoracionPromedio} ★` : '5.0 ★'}
        </p>
        <p className="text-[11px] text-gray-400 font-medium">Basado en reseñas sobre productos</p>
      </div>
    </div>
  );
}
