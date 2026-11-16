/**
 * Componente: PerfilComercio
 * Permite al comerciante actualizar su información de contacto (WhatsApp/teléfono), dirección en Formosa y nombre del local.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';

export default function PerfilComercio({ comercio, onActualizar }) {
  const [form, setForm] = useState({
    nombre_local: comercio?.nombre_local || '',
    tipo_comercio: comercio?.tipo_comercio || '',
    telefono: comercio?.telefono || '',
    direccion: comercio?.direccion || '',
    email: comercio?.email || ''
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

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
      setMensaje('Datos del comercio actualizados.');
      if (onActualizar) onActualizar();
    } catch (err) {
      alert(`Error al actualizar perfil: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl bg-[#111A2E] border border-white/10 rounded-2xl p-6 space-y-5">
      <div>
        <h3 className="font-bold text-base text-white">Perfil y Canales de Contacto</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Estos datos se muestran públicamente a los vecinos en el mapa y en el detalle de productos.
        </p>
      </div>

      {mensaje && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-xl">
          {mensaje}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">WhatsApp / Teléfono Directo</label>
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

        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Dirección en Formosa Capital</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-[1.01] disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : 'Guardar Información'}
        </button>
      </form>
    </div>
  );
}
