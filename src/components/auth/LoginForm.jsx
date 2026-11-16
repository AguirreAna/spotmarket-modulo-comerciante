/**
 * Componente: LoginForm
 * Formulario de inicio de sesión y recuperación de contraseña con código de verificación.
 * Sin iconos decorativos y con "Recuperar contraseña" mencionado una sola vez.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';

export default function LoginForm({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Recuperación de contraseña
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensajeRecuperar, setMensajeRecuperar] = useState('');
  const [cargandoRecuperar, setCargandoRecuperar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('usuarioSpotMarket', JSON.stringify(respuesta.usuario));

      if (onLoginExitoso) {
        onLoginExitoso(respuesta.usuario);
      } else {
        window.location.href = respuesta.usuario?.rol === 'comerciante' ? '/panel' : '/';
      }
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Por favor verificá tus datos.');
    } finally {
      setCargando(false);
    }
  };

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeRecuperar('');
    setCargandoRecuperar(true);

    try {
      const body = { email: emailRecuperar.trim() };
      if (codigoEnviado && nuevaPassword.trim()) {
        body.nuevaPassword = nuevaPassword.trim();
        body.codigo = codigoVerificacion.trim();
      }
      const respuesta = await api('/auth/recuperar-password', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setMensajeRecuperar(respuesta.mensaje || 'Código de verificación generado y enviado a tu correo.');
      if (!codigoEnviado) {
        setCodigoEnviado(true);
      }
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud de recuperación.');
    } finally {
      setCargandoRecuperar(false);
    }
  };

  if (modoRecuperar) {
    return (
      <form onSubmit={handleEnviarCodigo} className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-blanco mb-1">Recuperar Contraseña</h3>
          <p className="text-xs text-gris-azulado mb-3">
            Ingresá tu correo para recibir tu código de verificación.
          </p>
        </div>

        {mensajeRecuperar && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs p-3.5 rounded-xl font-medium">
            {mensajeRecuperar}
          </div>
        )}

        {error && (
          <div className="bg-rojo/15 border border-rojo/40 text-rojo text-xs p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gris-azulado mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            value={emailRecuperar}
            onChange={(e) => setEmailRecuperar(e.target.value)}
            placeholder="ejemplo@spotmarket.com"
            required
            className="w-full rounded-xl bg-negro/60 border border-borde px-3.5 py-2.5 text-sm text-blanco focus:outline-none focus:border-amarillo transition-colors"
          />
        </div>

        {codigoEnviado && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amarillo mb-1.5">
                Código de verificación (6 dígitos)
              </label>
              <input
                type="text"
                value={codigoVerificacion}
                onChange={(e) => setCodigoVerificacion(e.target.value)}
                placeholder="Ingresá el código recibido"
                required
                className="w-full rounded-xl bg-negro/60 border border-borde px-3.5 py-2.5 text-sm text-blanco focus:outline-none focus:border-amarillo transition-colors text-center font-mono font-bold tracking-widest"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gris-azulado mb-1.5">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full rounded-xl bg-negro/60 border border-borde px-3.5 py-2.5 text-sm text-blanco focus:outline-none focus:border-amarillo transition-colors"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={cargandoRecuperar}
          className="w-full rounded-xl fondo-dorado text-negro font-extrabold py-3 text-sm transition-all shadow-lg hover:brightness-110 disabled:opacity-50 cursor-pointer"
        >
          {cargandoRecuperar
            ? 'Procesando...'
            : codigoEnviado
            ? 'Restablecer Contraseña'
            : 'Enviar código de verificación'}
        </button>

        <button
          type="button"
          onClick={() => {
            setModoRecuperar(false);
            setCodigoEnviado(false);
            setError('');
            setMensajeRecuperar('');
          }}
          className="w-full text-center text-xs text-gris-azulado hover:text-blanco transition pt-2 cursor-pointer"
        >
          Volver al inicio de sesión
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-rojo/15 border border-rojo/40 text-rojo text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gris-azulado mb-1.5">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@spotmarket.com"
          required
          className="w-full rounded-xl bg-negro/60 border border-borde px-3.5 py-2.5 text-sm text-blanco placeholder:text-gris-azulado/60 focus:outline-none focus:border-amarillo transition-colors"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gris-azulado">
            Contraseña
          </label>
          <button
            type="button"
            onClick={() => setMostrarPass(!mostrarPass)}
            className="text-[11px] text-gris-azulado hover:text-blanco"
          >
            {mostrarPass ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <input
          type={mostrarPass ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-xl bg-negro/60 border border-borde px-3.5 py-2.5 text-sm text-blanco placeholder:text-gris-azulado/60 focus:outline-none focus:border-amarillo transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-xl fondo-dorado text-negro font-extrabold py-3 text-sm transition-all shadow-lg hover:brightness-110 disabled:opacity-50 cursor-pointer"
      >
        {cargando ? 'Verificando credenciales...' : 'Ingresar a SpotMarket'}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setModoRecuperar(true);
            setEmailRecuperar(email);
            setError('');
          }}
          className="text-xs text-gris-azulado hover:text-amarillo transition cursor-pointer"
        >
          ¿Olvidaste tu contraseña? <span className="text-amarillo font-semibold">Recuperar contraseña</span>
        </button>
      </div>
    </form>
  );
}
