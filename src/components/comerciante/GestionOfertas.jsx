/**
 * Componente: GestionOfertas
 * Permite al comerciante crear, editar, listar y dar de baja ofertas temporales para sus productos.
 * - Sincronizado en tiempo real con el catálogo y la pantalla de Inicio ("Ofertas de la Semana").
 * - Cálculo automático de porcentaje de descuento (% OFF).
 * - Edición flexible de precio promocional y fecha límite.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';
import { resolverUrlImagen } from '../../utils/imageUrl.js';

export default function GestionOfertas({ productos = [], ofertas = [], onActualizar }) {
  const [ofertaEditar, setOfertaEditar] = useState(null);
  const [productoId, setProductoId] = useState(productos[0]?.id || '');
  const [precioOferta, setPrecioOferta] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Sincronizar selección inicial de producto
  const productoSeleccionado = productos.find((p) => String(p.id) === String(productoId)) || productos[0];
  const precioOriginal = productoSeleccionado ? Number(productoSeleccionado.precio) : 0;

  // Cálculo automático del porcentaje de descuento
  const porcentajeDescuento =
    precioOriginal > 0 && Number(precioOferta) > 0 && Number(precioOferta) < precioOriginal
      ? Math.round(((precioOriginal - Number(precioOferta)) / precioOriginal) * 100)
      : 0;

  const iniciarEdicion = (o) => {
    setOfertaEditar(o);
    setProductoId(o.productoId || o.producto?.id || '');
    setPrecioOferta(o.precio_oferta || '');
    setFechaFin(o.fecha_fin ? o.fecha_fin.slice(0, 10) : '');
    setMensaje('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setOfertaEditar(null);
    setProductoId(productos[0]?.id || '');
    setPrecioOferta('');
    setFechaFin('');
    setMensaje('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productoId) {
      setError('Seleccioná un producto del catálogo.');
      return;
    }

    if (Number(precioOferta) <= 0) {
      setError('Ingresá un precio de oferta válido mayor a 0.');
      return;
    }

    if (Number(precioOferta) >= precioOriginal) {
      setError('El precio con descuento debe ser menor al precio de lista ($' + precioOriginal.toLocaleString('es-AR') + ').');
      return;
    }

    setCargando(true);
    setMensaje('');
    setError('');

    try {
      const payload = {
        productoId: Number(productoId),
        precio_oferta: Number(precioOferta),
        fecha_inicio: new Date().toISOString(),
        fecha_fin: fechaFin
          ? new Date(fechaFin + 'T23:59:59').toISOString()
          : new Date(Date.now() + 7 * 86400000).toISOString()
      };

      if (ofertaEditar) {
        await api(`/ofertas/${ofertaEditar.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        setMensaje('Oferta actualizada exitosamente y reflejada en SpotMarket.');
      } else {
        await api('/ofertas', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        setMensaje('Oferta publicada con éxito. Ahora los vecinos la ven en Inicio.');
      }

      cancelarEdicion();
      if (onActualizar) onActualizar();
    } catch (err) {
      const msg = err.detalles?.length
        ? err.detalles.map((d) => d.mensaje).join(', ')
        : (err.message || 'Error al guardar la oferta.');
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Confirmás que querés pausar o eliminar esta oferta?')) return;
    try {
      await api(`/ofertas/${id}`, { method: 'DELETE' });
      if (onActualizar) onActualizar();
    } catch (err) {
      alert('Error al eliminar oferta: ' + err.message);
    }
  };

  // Consolidar lista de ofertas vigentes
  const listaOfertas = ofertas.length > 0
    ? ofertas
    : productos.flatMap((p) =>
        (p.ofertas || []).map((o) => ({
          ...o,
          producto: p,
          productoNombre: p.nombre,
          precioOriginal: p.precio
        }))
      );

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      {/* ── FORMULARIO: CREAR O EDITAR OFERTA ── */}
      <div className="lg:col-span-5 bg-[#111A2E] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <span>{ofertaEditar ? '✏️' : '🏷️'}</span>
            {ofertaEditar ? 'Editar Oferta Temporal' : 'Lanzar Oferta de la Semana'}
          </h3>
          {ofertaEditar && (
            <button
              onClick={cancelarEdicion}
              className="text-[11px] text-gray-400 hover:text-white underline"
            >
              Cancelar
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          {ofertaEditar
            ? 'Modificá el precio promocional o extendé la fecha de vigencia.'
            : 'Promocioná un producto con descuento destacado. Aparecerá en el Inicio de SpotMarket.'}
        </p>

        {mensaje && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl">
            ✓ {mensaje}
          </div>
        )}

        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs p-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {productos.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs">
            No tenés productos cargados en el catálogo. Primero agregá un producto en la pestaña "Catálogo de Productos".
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
                Producto a Promocionar
              </label>
              <select
                value={productoId}
                onChange={(e) => {
                  setProductoId(e.target.value);
                  setPrecioOferta('');
                }}
                disabled={Boolean(ofertaEditar)}
                required
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800] disabled:opacity-60"
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Lista: ${Number(p.precio).toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            {productoSeleccionado && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <img
                  src={resolverUrlImagen(productoSeleccionado.imagen_url)}
                  alt={productoSeleccionado.nombre}
                  className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10"
                />
                <div className="text-xs">
                  <p className="font-bold text-white line-clamp-1">{productoSeleccionado.nombre}</p>
                  <p className="text-gray-400">
                    Precio actual: <span className="text-white font-bold">${Number(productoSeleccionado.precio).toLocaleString('es-AR')}</span>
                  </p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase text-[#EF4444]">
                  Precio de Oferta ($)
                </label>
                {porcentajeDescuento > 0 && (
                  <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {porcentajeDescuento}% OFF
                  </span>
                )}
              </div>
              <input
                type="number"
                step="0.01"
                value={precioOferta}
                onChange={(e) => setPrecioOferta(e.target.value)}
                placeholder="Ej: 3200"
                required
                className="w-full rounded-xl bg-black/40 border border-red-500/40 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
                Fecha límite de vigencia
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Por defecto tiene una duración de 7 días continuos.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 bg-[#EF4444] hover:bg-red-600 text-white font-extrabold text-xs py-3 rounded-xl transition-all hover:scale-[1.01] shadow-lg disabled:opacity-50"
              >
                {cargando
                  ? 'Guardando...'
                  : ofertaEditar
                  ? 'Actualizar Oferta'
                  : 'Publicar Oferta en SpotMarket'}
              </button>
              {ofertaEditar && (
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl border border-white/10"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ── LISTADO: OFERTAS VIGENTES Y ACTIVAS ── */}
      <div className="lg:col-span-7 bg-[#111A2E] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <span>🔥</span> Ofertas Activas del Comercio ({listaOfertas.length})
          </h3>
          <span className="text-[10px] text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 px-2 py-0.5 rounded-full font-bold">
            Visibles en Inicio
          </span>
        </div>

        {listaOfertas.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs space-y-2">
            <span className="text-3xl block">🏷️</span>
            <p>No tenés ofertas activas en este momento.</p>
            <p className="text-gray-400">Usá el formulario a la izquierda para activar promociones semanales.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {listaOfertas.map((o) => {
              const prod = o.producto || productos.find((p) => p.id === o.productoId);
              const pNombre = o.productoNombre || prod?.nombre || 'Producto';
              const pImg = prod?.imagen_url;
              const pPrecioOrig = o.precioOriginal || prod?.precio || 0;
              const descPct =
                pPrecioOrig > 0 && o.precio_oferta
                  ? Math.round(((pPrecioOrig - o.precio_oferta) / pPrecioOrig) * 100)
                  : 0;

              const expirada = o.fecha_fin && new Date(o.fecha_fin) < new Date();

              return (
                <div
                  key={o.id}
                  className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {pImg && (
                      <img
                        src={resolverUrlImagen(pImg)}
                        alt={pNombre}
                        className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-white/10 flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{pNombre}</h4>
                        {descPct > 0 && (
                          <span className="bg-[#EF4444] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {descPct}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 text-xs mt-1">
                        <span className="font-black text-[#EF4444] text-base">
                          ${Number(o.precio_oferta).toLocaleString('es-AR')}
                        </span>
                        {pPrecioOrig > 0 && (
                          <span className="line-through text-gray-500 text-xs">
                            ${Number(pPrecioOrig).toLocaleString('es-AR')}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {expirada ? (
                          <span className="text-red-400 font-bold">Expiró el {new Date(o.fecha_fin).toLocaleDateString('es-AR')}</span>
                        ) : (
                          <>Válida hasta: <span className="text-gray-300 font-medium">{o.fecha_fin ? new Date(o.fecha_fin).toLocaleDateString('es-AR') : 'Sin fecha'}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => iniciarEdicion(o)}
                      className="px-3 py-1.5 bg-[#FFB800]/20 hover:bg-[#FFB800]/30 text-[#FFB800] border border-[#FFB800]/40 rounded-xl text-xs font-bold transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(o.id)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-colors"
                    >
                      Pausar / Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
