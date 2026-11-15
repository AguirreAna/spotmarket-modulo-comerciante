/**
 * Componente: GestionOfertas
 * Permite al comerciante crear y listar ofertas temporales para sus productos.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';

export default function GestionOfertas({ productos = [], onActualizar }) {
  const [productoId, setProductoId] = useState(productos[0]?.id || '');
  const [precioOferta, setPrecioOferta] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const ofertas = productos.flatMap((p) =>
    (p.ofertas || []).map((o) => ({
      ...o,
      productoNombre: p.nombre,
      precioOriginal: p.precio
    }))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productoId) return;
    setCargando(true);
    setMensaje('');

    try {
      await api('/ofertas', {
        method: 'POST',
        body: JSON.stringify({
          productoId: Number(productoId),
          precio_oferta: Number(precioOferta),
          fecha_inicio: new Date().toISOString(),
          fecha_fin: fechaFin ? new Date(fechaFin).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString()
        })
      });

      setMensaje('Oferta creada con éxito y visible en SpotMarket.');
      setPrecioOferta('');
      setFechaFin('');
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al crear oferta: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* Formulario de Nueva Oferta */}
      <div className="lg:col-span-5 bg-[#111A2E] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <span>🏷️</span> Lanzar Nueva Oferta Barrial
        </h3>
        <p className="text-xs text-gray-400">
          Destacá un producto con descuento temporal en la sección "Ofertas de la Semana".
        </p>

        {mensaje && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Seleccionar Producto</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              required
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            >
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (Precio actual: ${Number(p.precio).toLocaleString('es-AR')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#EF4444] mb-1">Precio con Descuento ($)</label>
            <input
              type="number"
              step="0.01"
              value={precioOferta}
              onChange={(e) => setPrecioOferta(e.target.value)}
              placeholder="Ej: 2890"
              required
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Fecha límite de la oferta</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#EF4444] hover:bg-red-600 text-white font-extrabold text-xs py-3 rounded-xl transition-transform hover:scale-[1.01] shadow-lg disabled:opacity-50"
          >
            {cargando ? 'Publicando oferta...' : 'Activar Oferta'}
          </button>
        </form>
      </div>

      {/* Listado de Ofertas Vigentes */}
      <div className="lg:col-span-7 bg-[#111A2E] border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <span>🔥</span> Ofertas Activas del Comercio ({ofertas.length})
        </h3>

        {ofertas.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            Actualmente no tenés ofertas vigentes. Usá el formulario a la izquierda para activar descuentos.
          </p>
        ) : (
          <div className="space-y-3">
            {ofertas.map((o) => (
              <div key={o.id} className="bg-black/30 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">{o.productoNombre}</h4>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="font-black text-[#EF4444]">${Number(o.precio_oferta).toLocaleString('es-AR')}</span>
                    <span className="line-through text-gray-500 text-[11px]">${Number(o.precioOriginal).toLocaleString('es-AR')}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Válida hasta: {new Date(o.fecha_fin).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <span className="bg-red-600/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-1 rounded-full">
                  Activa
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
