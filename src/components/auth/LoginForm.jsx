/**
 * Componente: LoginForm
 * Formulario de inicio de sesión para comerciantes y clientes.
 * Maneja credenciales contra el backend con JWT en cookie httpOnly y guarda 'isLogged' en localStorage.
 */
import { useState } from 'react';
import { api } from '../../services/api.js';

export default function LoginForm({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@spotmarket.com"
          required
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
            Contraseña
          </label>
          <button
            type="button"
            onClick={() => setMostrarPass(!mostrarPass)}
            className="text-[11px] text-[#FFB800] hover:underline"
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
          className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold py-3 text-sm transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
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
    </form>
  );
}
