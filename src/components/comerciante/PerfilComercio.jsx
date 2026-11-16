/**
 * Componente: PerfilComercio
 * Permite al comerciante visualizar sus fotos de fachada (cargadas al registrarse),
 * ingresar a verlas en tamaño ampliado, eliminarlas, agregar nuevas fotos,
 * y actualizar su información de contacto (WhatsApp/teléfono), dirección en Formosa, horario de atención y nombre del local.
 */
import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { resolverUrlImagen } from '../../utils/imageUrl.js';

export default function PerfilComercio({ comercio, onActualizar }) {
  const [form, setForm] = useState({
    nombre_local: comercio?.nombre_local || '',
    tipo_comercio: comercio?.tipo_comercio || 'Minorista',
    telefono: comercio?.telefono || '',
    whatsapp: comercio?.whatsapp || comercio?.telefono || '',
    horario_atencion: comercio?.horario_atencion || 'Lunes a Sábado de 08:00 a 13:00 y de 17:00 a 21:00 hs',
    direccion: comercio?.direccion || '',
    email: comercio?.email || ''
  });
  const [nuevasFotos, setNuevasFotos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [fotoModal, setFotoModal] = useState(null);
  const [eliminandoFotoId, setEliminandoFotoId] = useState(null);

  useEffect(() => {
    if (comercio) {
      setForm({
        nombre_local: comercio.nombre_local || '',
        tipo_comercio: comercio.tipo_comercio || 'Minorista',
        telefono: comercio.telefono || '',
        whatsapp: comercio.whatsapp || comercio.telefono || '',
        horario_atencion: comercio.horario_atencion || 'Lunes a Sábado de 08:00 a 13:00 y de 17:00 a 21:00 hs',
        direccion: comercio.direccion || '',
        email: comercio.email || ''
      });
    }
  }, [comercio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEliminarFoto = async (fotoId) => {
    if (!confirm('¿Seguro que deseás eliminar esta foto del local comercial?')) return;
    setEliminandoFotoId(fotoId);
    try {
      await api(`/comercios/fotos/${fotoId}`, { method: 'DELETE' });
      if (fotoModal?.id === fotoId) setFotoModal(null);
      setMensaje('Foto eliminada correctamente.');
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al eliminar fotografía: ${err.message}`);
    } finally {
      setEliminandoFotoId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comercio?.id) return;
    setCargando(true);
    setMensaje('');

    try {
      if (nuevasFotos.length > 0) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        nuevasFotos.forEach((f) => fd.append('fotos', f));
        await api(`/comercios/${comercio.id}`, {
          method: 'PUT',
          body: fd
        });
      } else {
        await api(`/comercios/${comercio.id}`, {
          method: 'PUT',
          body: JSON.stringify(form)
        });
      }
      setMensaje('Datos del comercio actualizados correctamente.');
      setNuevasFotos([]);
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al actualizar perfil: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl bg-gris-oscuro border border-borde rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Lightbox / Modal para visualizar foto ampliada */}
      {fotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFotoModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-gris-oscuro border border-borde rounded-2xl p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-borde mb-3">
              <h4 className="text-sm font-bold text-blanco">Fotografía del Local Comercial</h4>
              <button
                onClick={() => setFotoModal(null)}
                className="text-gris-azulado hover:text-blanco font-bold text-sm px-2 py-1 rounded"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-black">
              <img
                src={resolverUrlImagen(fotoModal.url)}
                alt="Foto ampliada"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="mt-3 flex justify-between items-center text-xs">
              <span className="text-gris-azulado">SpotMarket Formosa</span>
              {fotoModal.id && (
                <button
                  type="button"
                  onClick={() => handleEliminarFoto(fotoModal.id)}
                  className="px-3 py-1.5 rounded-lg bg-rojo/20 text-rojo border border-rojo/30 hover:bg-rojo/30 font-semibold transition"
                >
                  🗑️ Eliminar esta fotografía
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-lg text-blanco flex items-center gap-2">
          <span>🏪</span> Perfil y Canales de Contacto Directo
        </h3>
        <p className="text-xs text-gris-azulado mt-1">
          Los vecinos verán estos datos para ubicar tu negocio y enviarte mensajes.
        </p>
      </div>

      {mensaje && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs p-3.5 rounded-xl font-medium">
          ✓ {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">Nombre Comercial del Local</label>
          <input
            type="text"
            name="nombre_local"
            value={form.nombre_local}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco focus:outline-none focus:border-amarillo"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-amarillo mb-1">Tipo de Comercio</label>
            <select
              name="tipo_comercio"
              value={form.tipo_comercio}
              onChange={handleChange}
              className="w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco font-medium focus:outline-none focus:border-amarillo"
            >
              <option value="Minorista">Minorista</option>
              <option value="Mayorista">Mayorista</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">Teléfono Directo</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="3704-XXXXXX"
              className="w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco focus:outline-none focus:border-amarillo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-verde mb-1">
              WhatsApp Comercial (para pedidos y consultas)
            </label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="3704123456"
              className="w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco focus:outline-none focus:border-verde"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">Horario de Atención</label>
            <input
              type="text"
              name="horario_atencion"
              value={form.horario_atencion}
              onChange={handleChange}
              placeholder="Ej: Lun a Sáb 8 a 13 y 17 a 21 hs"
              className="w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco focus:outline-none focus:border-amarillo"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">Dirección en Formosa Capital</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Calle, número y barrio (ej: Av. 25 de Mayo 450, Centro)"
            required
            className="w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco focus:outline-none focus:border-amarillo"
          />
        </div>

        {/* ── FOTOGRAFÍAS DEL LOCAL COMERCIAL: VISUALIZAR, ELIMINAR Y AGREGAR NUEVAS ── */}
        <div className="pt-4 border-t border-borde space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase text-amarillo">
              📸 Fotografías del Local Comercial ({comercio?.fotos?.length || 0})
            </label>
            <span className="text-[10px] text-gris-azulado">Hacé clic en cualquier foto para verla ampliada o eliminarla</span>
          </div>

          {comercio?.fotos && comercio.fotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {comercio.fotos.map((f, idx) => (
                <div
                  key={f.id || idx}
                  onClick={() => setFotoModal(f)}
                  className="relative group rounded-xl overflow-hidden border border-borde bg-negro/60 aspect-square shadow hover:border-amarillo transition cursor-pointer"
                >
                  <img
                    src={resolverUrlImagen(f.url)}
                    alt={`Fachada ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-blanco text-[9px] px-2 py-0.5 rounded font-bold">
                    Foto #{idx + 1}
                  </span>
                  {f.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarFoto(f.id);
                      }}
                      disabled={eliminandoFotoId === f.id}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rojo text-blanco opacity-90 hover:opacity-100 hover:scale-110 shadow transition"
                      title="Eliminar foto"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gris-azulado italic bg-negro/40 p-3 rounded-xl border border-borde">
              Aún no tenés fotos de fachada registradas. Podés agregar fotos a continuación.
            </p>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
              Subir más fotos de fachada o local
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNuevasFotos(Array.from(e.target.files || []))}
              className="w-full text-xs text-gris-azulado file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:fondo-dorado file:text-negro hover:file:brightness-110 cursor-pointer"
            />
            {nuevasFotos.length > 0 && (
              <p className="text-[10px] text-verde mt-1 font-semibold">
                ✓ {nuevasFotos.length} nueva(s) foto(s) lista(s) para subir al guardar.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="fondo-dorado text-negro font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:brightness-110 disabled:opacity-50"
        >
          {cargando ? 'Guardando cambios...' : 'Guardar Información del Comercio'}
        </button>
      </form>
    </div>
  );
}
