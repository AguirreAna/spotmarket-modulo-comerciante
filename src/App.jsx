/**
 * App.jsx — Módulo Desacoplado: Autenticación y Panel de Comerciante
 * Funciona de forma 100% independiente para testing, y exporta componentes limpios
 * para integrarse en cualquier proyecto React de SpotMarket sin conflictos.
 */
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import PanelPage from './pages/PanelPage.jsx';
import { api } from './services/api.js';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuarioSpotMarket');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const [verificando, setVerificando] = useState(true);

  // Verificar sesión con cookie JWT contra el backend
  useEffect(() => {
    async function chequearSesion() {
      try {
        const res = await api('/auth/me');
        if (res.usuario) {
          setUsuario(res.usuario);
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('usuarioSpotMarket', JSON.stringify(res.usuario));
        }
      } catch {
        // Sin sesión activa
      } finally {
        setVerificando(false);
      }
    }
    chequearSesion();
  }, []);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem('isLogged', 'true');
    localStorage.setItem('usuarioSpotMarket', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('isLogged');
    localStorage.removeItem('usuarioSpotMarket');
    setUsuario(null);
  };

  if (verificando) {
    return (
      <div className="min-h-screen bg-[#070C16] flex items-center justify-center text-gray-400 text-sm">
        Iniciando Módulo de Comerciante...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            usuario?.rol === 'comerciante' ? (
              <Navigate to="/panel" replace />
            ) : (
              <AuthPage onLoginExitoso={handleLogin} />
            )
          }
        />
        <Route
          path="/panel"
          element={
            usuario ? (
              <PanelPage usuario={usuario} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={usuario ? '/panel' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
