/**
 * Componente: RegisterComercioForm
 * Formulario de alta para comerciantes locales de Formosa Capital.
 * Estructurado en 3 secciones claras:
 * 1) Datos comerciales: Tipo de comercio (Minorista / Mayorista) y Categoría de productos (27 opciones A-Z).
 * 2) Ubicación: Coordenadas y mapa de Formosa con opción de Agrandar Pantalla Completa.
 * 3) Fotografías: Carga y previsualización inmediata de fotos de fachada.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';
import { TIPOS_COMERCIO, CATEGORIAS_PRODUCTOS } from '../../constants/categorias.js';

export default function RegisterComercioForm({ onRegistroExitoso }) {
  const [form, setForm] = useState({
    nombre: '',
    nombre_local: '',
    tipo_comercio: 'Minorista',
    telefono: '',
    email: '',
    password: '',
    confirmarPassword: '',
    direccion: '',
    latitud: '-26.1849',
    longitud: '-58.1731'
  });

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(['Almacén']);
  const [fotos, setFotos] = useState([]);
  const [mapaAgrandado, setMapaAgrandado] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategoria = (cat) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFotos = (e) => {
    const files = Array.from(e.target.files || []);
    const fotosConPreview = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setFotos((prev) => [...prev, ...fotosConPreview].slice(0, 8));
  };

  const quitarFoto = (index) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener como mínimo 6 caracteres.');
      return;
    }

    if (categoriasSeleccionadas.length === 0) {
      setError('Seleccioná al menos una categoría de productos.');
      return;
    }

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('nombre_local', form.nombre_local);
      formData.append('tipo_comercio', form.tipo_comercio);
      formData.append('categoria_productos', categoriasSeleccionadas.join(', '));
      formData.append('tipos_productos', categoriasSeleccionadas.join(', '));
      formData.append('telefono', form.telefono);
      formData.append('email', form.email.trim());
      formData.append('password', form.password);
      formData.append('direccion', form.direccion);
      formData.append('latitud', form.latitud);
      formData.append('longitud', form.longitud);

      fotos.forEach((item) => {
        formData.append('fotos', item.file);
      });

      const res = await api('/auth/register-comercio', {
        method: 'POST',
        body: formData
      });

      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('rol', 'comerciante');
      localStorage.setItem('usuario', JSON.stringify(res.usuario));

      if (onRegistroExitoso) {
        onRegistroExitoso(res.usuario);
      }
    } catch (err) {
      console.error(err);
      setError(err.data?.mensaje || err.message || 'Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── SECCIÓN 1: DATOS COMERCIALES ── */}
      <div className="rounded-2xl bg-[#111A2E] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <span className="h-6 w-6 rounded-full bg-[#FFB800] text-black font-extrabold text-xs flex items-center justify-center">
            1
          </span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Datos del Local Comercial
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
              Nombre de Fantasía del Local
            </label>
            <input
              type="text"
              name="nombre_local"
              value={form.nombre_local}
              onChange={handleChange}
              placeholder="Ej: Almacén Don Pepe"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#FFB800] mb-1">
              Tipo de comercio
            </label>
            <select
              name="tipo_comercio"
              value={form.tipo_comercio}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#070C16] border border-white/10 px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-[#FFB800]"
            >
              {TIPOS_COMERCIO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CATEGORÍA DE PRODUCTOS (27 OPCIONES EN ORDEN ALFABÉTICO) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase text-[#FFB800]">
              Categoría de productos ({categoriasSeleccionadas.length} seleccionadas)
            </label>
            <span className="text-[10px] text-gray-400">Orden alfabético A-Z</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Marcá los rubros de productos que ofrecés a tus clientes:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 rounded-xl bg-black/20 border border-white/5">
            {CATEGORIAS_PRODUCTOS.map((cat) => {
              const activo = categoriasSeleccionadas.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategoria(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    activo
                      ? 'bg-[#FFB800] text-black font-bold shadow'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {activo ? '✓ ' : '+ '} {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
              Nombre del Responsable
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre y apellido"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
              Teléfono / WhatsApp de contacto
            </label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="3704-123456"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="comercio@spotmarket.com"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
              Repetir Contraseña
            </label>
            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>
      </div>

      {/* ── SECCIÓN 2: UBICACIÓN Y MAPA CON PANTALLA COMPLETA ── */}
      <div className="rounded-2xl bg-[#111A2E] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-[#FFB800] text-black font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ubicación en Formosa Capital
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setMapaAgrandado(true)}
            className="text-xs font-bold text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/30 px-3 py-1 rounded-lg hover:bg-[#FFB800]/20 transition flex items-center gap-1.5"
          >
            <span>⛶</span> Agrandar mapa
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">
            Dirección física del local
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Ej: Av. 25 de Mayo 450, Barrio Centro"
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        {/* VISTA PREVIA DEL MAPA */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#070C16] p-4 text-center">
          <p className="text-xs text-gray-300 font-semibold">
            Coordenadas: {form.latitud}, {form.longitud}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Podés agrandar el mapa para ubicar tu local exactamente sobre la calle o barrio.
          </p>
          <button
            type="button"
            onClick={() => setMapaAgrandado(true)}
            className="mt-3 bg-[#FFB800] hover:bg-yellow-400 text-black font-extrabold text-xs px-4 py-2 rounded-lg transition shadow"
          >
            Abrir mapa interactivo de Formosa
          </button>
        </div>
      </div>

      {/* ── SECCIÓN 3: FOTOS DEL LOCAL CON PREVISUALIZACIÓN ── */}
      <div className="rounded-2xl bg-[#111A2E] border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <span className="h-6 w-6 rounded-full bg-[#FFB800] text-black font-extrabold text-xs flex items-center justify-center">
            3
          </span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Fotografías del Local
          </h3>
        </div>

        <label className="block border-2 border-dashed border-white/20 hover:border-[#FFB800] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/5">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFotos}
            className="hidden"
          />
          <div className="text-2xl mb-1">📷</div>
          <span className="text-xs font-bold text-white block">
            Click para subir fotos de la fachada o salón de ventas
          </span>
          <span className="text-[11px] text-gray-400 block mt-1">
            Formatos JPG, PNG o WebP (hasta 8 fotos)
          </span>
        </label>

        {/* MINIATURAS DE FOTOS SUBIDAS */}
        {fotos.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#FFB800] mb-2">
              Fotos seleccionadas ({fotos.length}):
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {fotos.map((item, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/20 aspect-square">
                  <img
                    src={item.previewUrl}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => quitarFoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold shadow"
                    title="Eliminar foto"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-full py-3.5 rounded-xl bg-[#FFB800] hover:bg-yellow-400 text-black font-extrabold text-sm transition shadow-lg disabled:opacity-50"
      >
        {cargando ? 'Registrando comercio…' : 'Crear Cuenta y Comenzar'}
      </button>

      {/* MODAL PANTALLA COMPLETA DEL MAPA */}
      {mapaAgrandado && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur flex flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Mapa de Formosa Capital — Seleccionar Ubicación
              </h2>
              <p className="text-xs text-gray-400">
                Ajustá las coordenadas de tu local para los clientes cercanos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMapaAgrandado(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
            >
              ✕ Cerrar y Confirmar Punto
            </button>
          </div>
          <div className="flex-1 mt-4 rounded-2xl bg-[#070C16] border border-white/20 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="text-lg font-bold text-white">Ubicación Geográfica en Formosa Capital</h3>
            <p className="text-sm text-gray-300 max-w-md mt-2">
              Latitud: <span className="text-[#FFB800] font-bold">{form.latitud}</span> | Longitud: <span className="text-[#FFB800] font-bold">{form.longitud}</span>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs text-xs">
              <input
                type="text"
                name="latitud"
                value={form.latitud}
                onChange={handleChange}
                placeholder="Latitud"
                className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-white"
              />
              <input
                type="text"
                name="longitud"
                value={form.longitud}
                onChange={handleChange}
                placeholder="Longitud"
                className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setMapaAgrandado(false)}
              className="mt-5 bg-[#FFB800] hover:bg-yellow-400 text-black font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg"
            >
              Guardar y volver al formulario
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
