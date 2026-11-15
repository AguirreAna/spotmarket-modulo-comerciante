/**
 * Componente: RegisterComercioForm
 * Formulario de alta para comerciantes locales de Formosa Capital.
 * Estructurado en 3 secciones claras: Datos comerciales, Ubicación y Fotografías del local.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';

const TIPOS_COMERCIO = [
  'Almacén de barrio',
  'Supermercado / Minimarket',
  'Carnicería',
  'Frutería y Verdulería',
  'Panadería',
  'Ferretería',
  'Artículos Deportivos',
  'Bazar y Hogar',
  'Otros'
];

const RUBROS = [
  'Alimentos',
  'Bebidas',
  'Lácteos',
  'Panadería',
  'Carnes',
  'Frutas y Verduras',
  'Limpieza',
  'Hogar',
  'Deportes',
  'Mascotas'
];

export default function RegisterComercioForm({ onRegistroExitoso }) {
  const [form, setForm] = useState({
    nombre: '',
    nombre_local: '',
    tipo_comercio: TIPOS_COMERCIO[0],
    telefono: '',
    email: '',
    password: '',
    confirmarPassword: '',
    direccion: '',
    latitud: '-26.185',
    longitud: '-58.175'
  });

  const [rubrosSeleccionados, setRubrosSeleccionados] = useState(['Alimentos']);
  const [fotos, setFotos] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRubro = (rubro) => {
    setRubrosSeleccionados((prev) =>
      prev.includes(rubro) ? prev.filter((r) => r !== rubro) : [...prev, rubro]
    );
  };

  const handleFotos = (e) => {
    const files = Array.from(e.target.files || []);
    const fotosConPreview = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setFotos((prev) => [...prev, ...fotosConPreview].slice(0, 5));
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

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('nombre_local', form.nombre_local);
      formData.append('tipo_comercio', form.tipo_comercio);
      formData.append('tipos_productos', rubrosSeleccionados.join(','));
      formData.append('telefono', form.telefono);
      formData.append('email', form.email.trim());
      formData.append('password', form.password);
      formData.append('direccion', form.direccion);
      formData.append('latitud', form.latitud);
      formData.append('longitud', form.longitud);

      // Adjuntar fotos para subida (vía Multer + Cloudinary en backend)
      fotos.forEach((item) => {
        formData.append('fotos', item.file);
      });

      const respuesta = await api('/auth/register-comercio', {
        method: 'POST',
        body: formData
      });

      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('usuarioSpotMarket', JSON.stringify(respuesta.usuario));

      if (onRegistroExitoso) {
        onRegistroExitoso(respuesta.usuario);
      } else {
        window.location.href = '/panel';
      }
    } catch (err) {
      setError(err.message || 'Error al registrar el comercio.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* SECCIÓN 1: Datos del comercio y responsable */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <span className="w-6 h-6 rounded-full bg-[#FFB800] text-black text-xs font-black flex items-center justify-center">1</span>
          <h3 className="font-bold text-sm text-white">Datos del Comercio y Responsable</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Nombre del Local / Negocio</label>
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
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Rubro Principal</label>
            <select
              name="tipo_comercio"
              value={form.tipo_comercio}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#111A2E] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            >
              {TIPOS_COMERCIO.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-300 mb-2">Tipos de productos que vendés</label>
          <div className="flex flex-wrap gap-1.5">
            {RUBROS.map((r) => {
              const activo = rubrosSeleccionados.includes(r);
              return (
                <button
                  type="button"
                  key={r}
                  onClick={() => toggleRubro(r)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    activo ? 'bg-[#FFB800] text-black font-bold' : 'bg-white/5 text-gray-300 border border-white/10'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Nombre del Responsable</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Teléfono / WhatsApp de contacto</label>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Correo (para iniciar sesión)</label>
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
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Contraseña</label>
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
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Repetir Contraseña</label>
            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              placeholder="Repetí la contraseña"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Ubicación en Formosa Capital */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <span className="w-6 h-6 rounded-full bg-[#FFB800] text-black text-xs font-black flex items-center justify-center">2</span>
          <h3 className="font-bold text-sm text-white">Ubicación del Local en Formosa</h3>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Dirección exacta</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Ej: Av. 25 de Mayo 450, Barrio Centro, Formosa"
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Latitud</label>
            <input
              type="text"
              name="latitud"
              value={form.latitud}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-gray-300 mb-1">Longitud</label>
            <input
              type="text"
              name="longitud"
              value={form.longitud}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Fotos del local */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <span className="w-6 h-6 rounded-full bg-[#FFB800] text-black text-xs font-black flex items-center justify-center">3</span>
          <h3 className="font-bold text-sm text-white">Fotografías del Comercio (Fachada / Productos)</h3>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Subí fotos para que los vecinos reconozcan tu negocio (máx. 5 fotos en JPG/PNG).
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFotos}
            className="block w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FFB800] file:text-black hover:file:bg-[#FFA500] cursor-pointer"
          />
        </div>

        {fotos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
            {fotos.map((item, idx) => (
              <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-white/15 group">
                <img src={item.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => quitarFoto(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold py-3.5 text-sm transition-all shadow-xl hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {cargando ? (
          <>
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            <span>Registrando comercio en SpotMarket...</span>
          </>
        ) : (
          <span>Registrar mi comercio y acceder al Panel &rarr;</span>
        )}
      </button>
    </form>
  );
}
