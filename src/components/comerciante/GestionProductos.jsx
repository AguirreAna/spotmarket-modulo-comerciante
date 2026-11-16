/**
 * Componente: GestionProductos
 * CRUD completo de productos para el comerciante.
 * REGLAS DE NEGOCIO SPOTMARKET:
 * - NO maneja stock.
 * - NO incluye negociación de precios.
 * - Permite cargar nombre, descripción, precio, precio de oferta, cuotas, categoría y foto.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';
import { CATEGORIAS_PRODUCTOS } from '../../constants/categorias.js';
import { resolverUrlImagen } from '../../utils/imageUrl.js';

const CATEGORIAS = CATEGORIAS_PRODUCTOS;

export default function GestionProductos({ productos = [], onActualizar }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Formulario local
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    especificaciones: '',
    precio: '',
    precio_oferta: '',
    tipo_precio: 'diario',
    cuotas: '',
    categoria: CATEGORIAS[0],
    destacado: false
  });
  const [archivoImagen, setArchivoImagen] = useState(null);

  const abrirCrear = () => {
    setProductoEditar(null);
    setForm({
      nombre: '',
      descripcion: '',
      especificaciones: '',
      precio: '',
      precio_oferta: '',
      tipo_precio: 'diario',
      cuotas: '',
      categoria: CATEGORIAS[0],
      destacado: false
    });
    setArchivoImagen(null);
    setModalAbierto(true);
  };

  const abrirEditar = (prod) => {
    setProductoEditar(prod);
    setForm({
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      especificaciones: prod.especificaciones || '',
      precio: prod.precio || '',
      precio_oferta: prod.precio_oferta || '',
      tipo_precio: prod.tipo_precio || 'diario',
      cuotas: prod.cuotas || '',
      categoria: prod.categoria || CATEGORIAS[0],
      destacado: Boolean(prod.destacado)
    });
    setArchivoImagen(null);
    setModalAbierto(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const fd = new FormData();
      fd.append('nombre', form.nombre);
      fd.append('descripcion', form.descripcion);
      fd.append('especificaciones', form.especificaciones);
      fd.append('precio', form.precio);
      if (form.precio_oferta) fd.append('precio_oferta', form.precio_oferta);
      fd.append('tipo_precio', form.tipo_precio);
      if (form.cuotas) fd.append('cuotas', form.cuotas);
      fd.append('categoria', form.categoria);
      fd.append('destacado', form.destacado ? 'true' : 'false');
      if (archivoImagen) fd.append('imagen', archivoImagen);

      if (productoEditar) {
        await api(`/productos/${productoEditar.id}`, {
          method: 'PUT',
          body: fd
        });
        setMensaje('Producto actualizado con éxito.');
      } else {
        await api('/productos', {
          method: 'POST',
          body: fd
        });
        setMensaje('Producto publicado en SpotMarket.');
      }

      setModalAbierto(false);
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de que querés eliminar "${nombre}" de tu catálogo?`)) return;
    try {
      await api(`/productos/${id}`, { method: 'DELETE' });
      setMensaje('Producto eliminado correctamente.');
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  // Filtrado de la tabla (buscador por nombre o categoría de producto)
  const productosFiltrados = productos.filter((p) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    const matchNombre = p.nombre ? p.nombre.toLowerCase().includes(q) : false;
    const matchCat = p.categoria ? p.categoria.toLowerCase().includes(q) : false;
    return matchNombre || matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Barra de acciones: Buscador (reemplaza el desplegable) y botón nuevo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o categoría de producto..."
            className="w-full rounded-xl bg-negro/70 border border-borde px-4 py-2.5 pl-10 text-xs text-blanco placeholder:text-gris-azulado focus:outline-none focus:border-amarillo transition shadow-sm"
          />
          <svg className="w-4 h-4 text-gris-azulado absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          onClick={abrirCrear}
          className="fondo-dorado text-negro font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:brightness-110 flex items-center justify-center gap-2"
        >
          <span>＋</span> Publicar Nuevo Producto
        </button>
      </div>

      {mensaje && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded-xl flex items-center justify-between">
          <span>{mensaje}</span>
          <button onClick={() => setMensaje('')} className="text-xs">&times;</button>
        </div>
      )}

      {/* Tabla de Productos (Sin Precio Oferta, con Última Modificación) */}
      <div className="bg-gris-oscuro border border-borde rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gris-azulado">
            <thead className="bg-black/30 text-[11px] font-bold uppercase tracking-wider text-gris-azulado border-b border-borde">
              <tr>
                <th className="px-5 py-3.5">Producto</th>
                <th className="px-5 py-3.5">Rubro</th>
                <th className="px-5 py-3.5">Precio Regular</th>
                <th className="px-5 py-3.5">Última Modificación</th>
                <th className="px-5 py-3.5">Financiación</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde/40">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gris-azulado text-xs">
                    No tenés productos cargados con ese criterio. Hacé clic en "Publicar Nuevo Producto".
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-blanco flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-negro/50 border border-borde flex items-center justify-center overflow-hidden flex-shrink-0 text-[10px] text-gray-500 font-semibold">
                        {prod.imagen_url ? (
                          <img
                            src={resolverUrlImagen(prod.imagen_url)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          'Sin foto'
                        )}
                      </div>
                      <div>
                        <p className="truncate max-w-xs text-blanco">{prod.nombre}</p>
                        {prod.destacado && (
                          <span className="text-[10px] text-amarillo font-bold">Destacado en Inicio</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gris-azulado">{prod.categoria || 'General'}</td>
                    <td className="px-5 py-4 font-bold text-blanco">
                      ${Number(prod.precio).toLocaleString('es-AR')}
                    </td>
                    <td className="px-5 py-4 text-blanco whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-blanco">
                          {prod.updatedAt ? new Date(prod.updatedAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Reciente'}
                        </span>
                        <span className="text-[10px] text-gris-azulado">
                          {prod.updatedAt ? new Date(prod.updatedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-verde font-medium">
                      {prod.cuotas || 'Contado'}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => abrirEditar(prod)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-amarillo bg-amarillo/10 hover:bg-amarillo/20 border border-amarillo/20 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(prod.id, prod.nombre)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-rojo bg-rojo/10 hover:bg-rojo/20 border border-rojo/20 transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Formulario Flotante de Carga / Edición */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B111E] border border-white/15 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {productoEditar ? 'Editar Producto' : 'Publicar Nuevo Producto en SpotMarket'}
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Yerba Mate Especial 1 kg"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Precio Regular ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    placeholder="3490.00"
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#EF4444] mb-1">Precio Oferta (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precio_oferta}
                    onChange={(e) => setForm({ ...form, precio_oferta: e.target.value })}
                    placeholder="2890.00"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Rubro</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full rounded-xl bg-[#111A2E] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Cuotas / Financiación</label>
                  <input
                    type="text"
                    value={form.cuotas}
                    onChange={(e) => setForm({ ...form, cuotas: e.target.value })}
                    placeholder="Ej: 3 cuotas de $966"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Descripción corta</label>
                <textarea
                  rows="2"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Detalles sobre presentación, marca o procedencia..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Imagen del Producto (JPG/PNG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setArchivoImagen(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FFB800] file:text-black cursor-pointer"
                />
                {archivoImagen && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                    <span>Foto seleccionada:</span> {archivoImagen.name}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="destacadoCheck"
                  checked={form.destacado}
                  onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                  className="rounded text-[#FFB800] focus:ring-0"
                />
                <label htmlFor="destacadoCheck" className="text-xs text-gray-300 cursor-pointer">
                  Marcar como producto destacado (aparece en la portada principal)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {cargando ? 'Guardando...' : (productoEditar ? 'Guardar Cambios' : 'Publicar Producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
