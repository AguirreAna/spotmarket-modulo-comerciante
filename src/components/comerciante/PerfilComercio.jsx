/**
 * Componente: PerfilComercio
 * Permite al comerciante actualizar su información de contacto (WhatsApp/teléfono), dirección en Formosa, horario de atención y nombre del local.
 */
import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';

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
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comercio?.id) return;
    setCargando(true);
    setMensaje('');

    try {
      await api(`/comercios/${comercio.id}`, {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      setMensaje('Datos del comercio actualizados correctamente.');
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al actualizar perfil: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl bg-[#111A2E] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <span>🏪</span> Perfil y Canales de Contacto Directo
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Esta información se muestra públicamente a los vecinos en el mapa barrial y en las fichas de tus productos.
        </p>
      </div>

      {mensaje && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs p-3.5 rounded-xl font-medium">
          ✓ {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Nombre Comercial del Local</label>
          <input
            type="text"
            name="nombre_local"
            value={form.nombre_local}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#FFB800] mb-1">Tipo de Comercio</label>
            <select
              name="tipo_comercio"
              value={form.tipo_comercio}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#070C16] border border-white/10 px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-[#FFB800]"
            >
              <option value="Minorista">Minorista</option>
              <option value="Mayorista">Mayorista</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Teléfono Directo</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="3704-XXXXXX"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1">WhatsApp Comercial (Contacto Directo)</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="Ej: +54 9 370 412-3456"
              className="w-full rounded-xl bg-white/5 border border-emerald-500/30 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
            />
            <p className="text-[10px] text-gray-500 mt-1">Permite a los vecinos consultarte directamente por WhatsApp sin intermediarios.</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Horario de Atención</label>
            <input
              type="text"
              name="horario_atencion"
              value={form.horario_atencion}
              onChange={handleChange}
              placeholder="Ej: Lun a Sáb 8 a 13 y 17 a 21 hs"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
            <p className="text-[10px] text-gray-500 mt-1">Horarios en los que los clientes pueden visitarte o hacer pedidos.</p>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Dirección en Formosa Capital</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Calle, número y barrio (ej: Av. 25 de Mayo 450, Centro)"
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-[1.01] disabled:opacity-50"
        >
          {cargando ? 'Guardando cambios...' : 'Guardar Información del Comercio'}
        </button>
      </form>
    </div>
  );
}
