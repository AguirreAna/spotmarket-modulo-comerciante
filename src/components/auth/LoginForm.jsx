/**
 * Componente: LoginForm
 * Formulario de inicio de sesión y recuperación de contraseña para comerciantes y clientes.
 * Maneja credenciales contra el backend con JWT en cookie httpOnly y opción de recuperar contraseña.
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

      // Guardar bandera de sesión en localStorage según pauta del instituto
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

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeRecuperar('');
    setCargandoRecuperar(true);

    try {
      const body = { email: emailRecuperar.trim() };
      if (nuevaPassword.trim()) {
        body.nuevaPassword = nuevaPassword.trim();
      }
      const respuesta = await api('/auth/recuperar-password', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      setMensajeRecuperar(respuesta.mensaje || 'Instrucciones enviadas correctamente.');
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud de recuperación.');
    } finally {
      setCargandoRecuperar(false);
    }
  };

  if (modoRecuperar) {
    return (
      <form onSubmit={handleRecuperar} className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-blanco mb-1">Recuperar Contraseña</h3>
          <p className="text-xs text-gris-azulado mb-3">
            Ingresá tu correo para restablecer tu contraseña y recuperar el acceso a tu cuenta.
          </p>
        </div>

        {mensajeRecuperar && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs p-3.5 rounded-xl font-medium">
            ✓ {mensajeRecuperar}
          </div>
        )}

        {error && (
          <div className="bg-rojo/15 border border-rojo/40 text-rojo text-xs p-3 rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
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

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gris-azulado mb-1.5">
            Nueva contraseña (opcional)
          </label>
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Dejá vacío o escribí nueva contraseña"
            className="w-full rounded-xl bg-negro/60 border border-borde px-3.5 py-2.5 text-sm text-blanco focus:outline-none focus:border-amarillo transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={cargandoRecuperar}
          className="w-full rounded-xl fondo-dorado text-negro font-extrabold py-3 text-sm transition-all shadow-lg hover:brightness-110 disabled:opacity-50"
        >
          {cargandoRecuperar ? 'Procesando...' : 'Restablecer Contraseña'}
        </button>

        <button
          type="button"
          onClick={() => {
            setModoRecuperar(false);
            setError('');
            setMensajeRecuperar('');
          }}
          className="w-full text-center text-xs text-gris-azulado hover:text-blanco transition pt-2"
        >
          ← Volver al inicio de sesión
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-rojo/15 border border-rojo/40 text-rojo text-xs p-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setModoRecuperar(true);
                setEmailRecuperar(email);
                setError('');
              }}
              className="text-[11px] text-amarillo hover:underline font-semibold"
            >
              (Recuperar contraseña)
            </button>
            <button
              type="button"
              onClick={() => setMostrarPass(!mostrarPass)}
              className="text-[11px] text-gris-azulado hover:text-blanco"
            >
              {mostrarPass ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
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
        className="w-full rounded-xl fondo-dorado text-negro font-extrabold py-3 text-sm transition-all shadow-lg hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {cargando ? (
          <>
            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            <span>Verificando credenciales...</span>
          </>
        ) : (
          <span>Ingresar a SpotMarket</span>
        )}
      </button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setModoRecuperar(true);
            setEmailRecuperar(email);
            setError('');
          }}
          className="text-xs text-gris-azulado hover:text-amarillo transition"
        >
          ¿Olvidaste tu contraseña? <span className="text-amarillo font-semibold">(Recuperar contraseña)</span>
        </button>
      </div>
    </form>
  );
}
