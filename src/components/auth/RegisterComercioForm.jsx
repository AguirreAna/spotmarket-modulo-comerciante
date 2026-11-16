/**
 * Componente: RegisterComercioForm
 * Formulario de alta dual para SpotMarket (Formosa Capital):
 * Permite registrar tanto a Usuarios (Consumidores) como a Comerciantes Locales.
 * - Sin iconos decorativos.
 * - Registro de Usuario con teléfono opcional.
 */
import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../../services/api.js';
import { TIPOS_COMERCIO, CATEGORIAS_PRODUCTOS } from '../../constants/categorias.js';

const icono = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const FORMOSA = [-26.1849, -58.1731];

function ClickMapa({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function RegisterComercioForm({ onRegistroExitoso, onVolverLogin }) {
  const [rolRegistro, setRolRegistro] = useState('comerciante'); // 'comerciante' | 'usuario'

  // Form Comerciante
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

  // Form Usuario (con teléfono opcional)
  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmarPassword: ''
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
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
    setFotos((prev) => {
      URL.revokeObjectURL(prev[index]?.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => () => fotos.forEach((f) => URL.revokeObjectURL(f.previewUrl)), [fotos]);

  const posicion = useMemo(() => {
    if (form.latitud && form.longitud) {
      return [parseFloat(form.latitud), parseFloat(form.longitud)];
    }
    return FORMOSA;
  }, [form.latitud, form.longitud]);

  // Submit Usuario
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    setError('');

    if (formUsuario.password !== formUsuario.confirmarPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }
    if (formUsuario.password.length < 6) {
      setError('La contraseña debe tener como mínimo 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nombre: formUsuario.nombre.trim(),
          email: formUsuario.email.trim(),
          telefono: formUsuario.telefono ? formUsuario.telefono.trim() : null,
          password: formUsuario.password
        })
      });

      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('usuarioSpotMarket', JSON.stringify(res.usuario));

      if (onRegistroExitoso) {
        onRegistroExitoso(res.usuario);
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Error al procesar el registro de usuario.');
    } finally {
      setCargando(false);
    }
  };

  // Submit Comerciante
  const handleSubmitComercio = async (e) => {
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
      localStorage.setItem('usuarioSpotMarket', JSON.stringify(res.usuario));

      if (onRegistroExitoso) {
        onRegistroExitoso(res.usuario);
      } else {
        window.location.href = '/panel';
      }
    } catch (err) {
      setError(err.message || 'Error al procesar el registro del comercio.');
    } finally {
      setCargando(false);
    }
  };

  const inputClass =
    'w-full rounded-xl bg-negro/70 border border-borde px-3.5 py-2.5 text-xs text-blanco placeholder:text-gris-azulado/60 focus:outline-none focus:border-amarillo transition';

  return (
    <div className="space-y-6">
      {/* SELECTOR DUAL DE REGISTRO (SIN ICONOS) */}
      <div className="rounded-xl bg-negro/50 border border-borde p-1 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setRolRegistro('comerciante');
            setError('');
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
            rolRegistro === 'comerciante'
              ? 'fondo-dorado text-negro shadow'
              : 'text-gris-azulado hover:text-blanco'
          }`}
        >
          Soy Comerciante
        </button>
        <button
          type="button"
          onClick={() => {
            setRolRegistro('usuario');
            setError('');
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
            rolRegistro === 'usuario'
              ? 'fondo-dorado text-negro shadow'
              : 'text-gris-azulado hover:text-blanco'
          }`}
        >
          Soy Usuario
        </button>
      </div>

      {error && (
        <div className="bg-rojo/15 border border-rojo/40 text-rojo text-xs p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* REGISTRO DE USUARIO */}
      {rolRegistro === 'usuario' ? (
        <form onSubmit={handleSubmitUsuario} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formUsuario.nombre}
              onChange={handleChangeUsuario}
              placeholder="Juan Pérez"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formUsuario.email}
              onChange={handleChangeUsuario}
              placeholder="juan@ejemplo.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
              Número de teléfono (opcional)
            </label>
            <input
              type="tel"
              name="telefono"
              value={formUsuario.telefono}
              onChange={handleChangeUsuario}
              placeholder="Ej: 3704-123456 (opcional)"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formUsuario.password}
                onChange={handleChangeUsuario}
                placeholder="Mínimo 6 caracteres"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmarPassword"
                value={formUsuario.confirmarPassword}
                onChange={handleChangeUsuario}
                placeholder="Repetir contraseña"
                required
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl fondo-dorado text-negro font-extrabold py-3 text-sm transition-all shadow-lg hover:brightness-110 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {cargando ? 'Creando cuenta de usuario...' : 'Completar Registro de Usuario'}
          </button>
        </form>
      ) : (
        /* REGISTRO DE COMERCIANTE */
        <form onSubmit={handleSubmitComercio} className="space-y-6">
          {/* SECCIÓN 1: DATOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-amarillo border-b border-borde pb-1">
              1. Datos del Comercio
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                  Responsable del comercio
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-amarillo mb-1">
                  Nombre del local
                </label>
                <input
                  type="text"
                  name="nombre_local"
                  value={form.nombre_local}
                  onChange={handleChange}
                  placeholder="Supermercado San Martín"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                  Tipo de comercio
                </label>
                <select
                  name="tipo_comercio"
                  value={form.tipo_comercio}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {TIPOS_COMERCIO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                  Teléfono / WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="3704-XXXXXX (opcional)"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="comercio@ejemplo.com"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  name="confirmarPassword"
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  placeholder="Repetir contraseña"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* 27 Categorías de productos */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase text-amarillo mb-1">
                Categoría de productos ({categoriasSeleccionadas.length} seleccionadas)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-negro/50 border border-borde">
                {CATEGORIAS_PRODUCTOS.map((cat) => {
                  const sel = categoriasSeleccionadas.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategoria(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                        sel
                          ? 'bg-amarillo text-negro border-amarillo font-bold'
                          : 'bg-white/5 text-gris-azulado border-borde hover:text-blanco'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: UBICACIÓN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-borde pb-1">
              <h4 className="text-xs font-bold uppercase text-amarillo">
                2. Ubicación en Formosa Capital
              </h4>
              <button
                type="button"
                onClick={() => setMapaAgrandado((v) => !v)}
                className="text-xs font-bold text-amarillo hover:underline cursor-pointer"
              >
                {mapaAgrandado ? 'Reducir mapa' : 'Agrandar pantalla completa'}
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-gris-azulado mb-1">
                Dirección en Formosa
              </label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej: Av. 25 de Mayo 450, Centro"
                required
                className={inputClass}
              />
            </div>

            <div
              className={`relative rounded-xl overflow-hidden border border-borde ${
                mapaAgrandado
                  ? 'fixed inset-4 z-50 bg-gris-oscuro flex flex-col p-4 shadow-2xl'
                  : 'h-52 w-full'
              }`}
            >
              {mapaAgrandado && (
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-borde">
                  <span className="font-bold text-sm text-blanco">Ubicación en mapa — Formosa</span>
                  <button
                    type="button"
                    onClick={() => setMapaAgrandado(false)}
                    className="px-3 py-1 rounded-lg bg-rojo text-blanco font-bold text-xs cursor-pointer"
                  >
                    Cerrar pantalla
                  </button>
                </div>
              )}
              <MapContainer
                center={posicion}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickMapa
                  onPick={(lat, lng) => {
                    setForm((f) => ({ ...f, latitud: String(lat), longitud: String(lng) }));
                  }}
                />
                <Marker position={posicion} icon={icono} />
              </MapContainer>
            </div>
          </div>

          {/* SECCIÓN 3: FOTOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-amarillo border-b border-borde pb-1">
              3. Fotos de Fachada
            </h4>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotos}
              className="w-full text-xs text-gris-azulado file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:fondo-dorado file:text-negro cursor-pointer"
            />
            {fotos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                {fotos.map((item, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border border-borde aspect-square"
                  >
                    <img
                      src={item.previewUrl}
                      alt="Fachada"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => quitarFoto(index)}
                      className="absolute top-1 right-1 bg-rojo text-white text-[10px] px-1.5 py-0.5 rounded font-bold cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-xl fondo-dorado text-negro font-extrabold py-3 text-sm transition-all shadow-lg hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            {cargando ? 'Procesando registro comercial...' : 'Completar Registro de Comercio'}
          </button>
        </form>
      )}

      {onVolverLogin && (
        <div className="text-center pt-2 border-t border-borde/40">
          <button
            type="button"
            onClick={onVolverLogin}
            className="text-xs text-gris-azulado hover:text-blanco transition cursor-pointer"
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
