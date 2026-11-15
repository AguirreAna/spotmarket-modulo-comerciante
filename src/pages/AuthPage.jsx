/**
 * Página: AuthPage
 * Permite iniciar sesión o registrarse como comerciante/cliente.
 */
import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm.jsx';
import RegisterComercioForm from '../components/auth/RegisterComercioForm.jsx';
import LogoNavbar from '../assets/LogoNavbar.svg';

export default function AuthPage({ onLoginExitoso }) {
  const [pestana, setPestana] = useState('login'); // 'login' | 'registro-comercio'

  return (
    <div className="min-h-screen bg-[#070C16] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 p-2 shadow-lg">
          <img src={LogoNavbar} alt="SpotMarket" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Spot<span className="text-[#FFB800]">Market</span>
        </h2>
        <p className="text-xs text-gray-400">
          Plataforma de Precios y Comercios Locales · Formosa Capital
        </p>

        {/* Selector de pestañas */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 mt-6 max-w-sm mx-auto">
          <button
            onClick={() => setPestana('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              pestana === 'login' ? 'bg-[#FFB800] text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setPestana('registro-comercio')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              pestana === 'registro-comercio' ? 'bg-[#FFB800] text-black shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Registrar Comercio
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="bg-[#111A2E] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/10">
          {pestana === 'login' ? (
            <LoginForm onLoginExitoso={onLoginExitoso} />
          ) : (
            <RegisterComercioForm onRegistroExitoso={onLoginExitoso} />
          )}
        </div>
      </div>
    </div>
  );
}
