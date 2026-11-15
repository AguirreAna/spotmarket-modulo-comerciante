# 🧩 Guía de Integración del Módulo Comerciante & Autenticación

Esta guía explica paso a paso cómo integrar este módulo en cualquier otro proyecto React de **SpotMarket** sin generar conflictos ni duplicar dependencias.

---

## 📋 Requisitos Previos

En el proyecto de destino donde vayas a pegar este módulo, asegúrate de tener instalados los paquetes necesarios:

```bash
npm install lucide-react
```

Y tener configurado **Tailwind CSS**. Si el proyecto destino aún no tiene Tailwind:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 📂 Paso 1: Copiar Archivos al Proyecto Destino

Copia las siguientes carpetas y archivos dentro del directorio `src/` de tu proyecto principal:

| Origen en este módulo | Destino en tu proyecto | Descripción |
| :--- | :--- | :--- |
| `src/components/auth/` | `src/components/auth/` | Formularios de Login y Registro de Comerciantes |
| `src/components/comerciante/` | `src/components/comerciante/` | Dashboard, CRUD de Productos, Ofertas y Perfil |
| `src/hooks/useForm.js` | `src/hooks/useForm.js` | Hook para manejo de inputs y validación |
| `src/hooks/useFetch.js` | `src/hooks/useFetch.js` | Hook para consumo HTTP con `AbortController` |
| `src/services/api.js` | `src/services/api.js` | Cliente centralizado con `credentials: 'include'` |
| `src/assets/Logo.svg` | `src/assets/Logo.svg` | Logotipos oficiales SpotMarket |
| `src/assets/LogoNavbar.svg` | `src/assets/LogoNavbar.svg` | |

> **Nota:** Si tu proyecto ya tiene un `api.js` o hooks con los mismos nombres, no los sobreescribas; simplemente renómbralos a `useFormComercio.js` o ajusta la ruta de importación.

---

## 🎨 Paso 2: Configurar Paleta de Colores en Tailwind

Para mantener la estética oscura y de alto contraste idéntica al diseño aprobado, agrega estas extensiones en el archivo `tailwind.config.js` del proyecto destino:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spot: {
          dark: '#070C16',      // Fondo general
          navy: '#0B1222',      // Superficie secundaria
          card: '#111A2E',      // Fondo de tarjetas y tablas
          cardLight: '#18243E', // Bordes e inputs
          yellow: '#FFB800',    // Acento primario (ofertas y botones)
          red: '#EF4444',       // Botones de llamada a acción y avisos
        }
      }
    },
  },
  plugins: [],
}
```

---

## 🌐 Paso 3: Conexión con el Backend

El servicio `src/services/api.js` está preparado para comunicarse con el backend en el puerto `4000` (o el que defina tu variable de entorno).

En el archivo `.env` del proyecto destino agrega:
```env
VITE_API_URL=http://localhost:4000/api
```

O si utilizas el proxy de **Vite** en `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
```

> ⚠️ **Muy importante para la autenticación:** Todas las peticiones fetch de `api.js` llevan `credentials: 'include'`. Esto es obligatorio para que el navegador guarde y envíe automáticamente la cookie `token` (JWT `httpOnly`) que emite el backend de SpotMarket.

---

## 🚦 Paso 4: Incorporar las Rutas en tu Aplicación

### Opción A: Usando React Router DOM (v6)

Si tu proyecto utiliza `react-router-dom`:

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import PanelPage from './pages/PanelPage';

// Componente para proteger la ruta del comerciante
function RutaProtegidaComerciante({ children }) {
  const isLogged = localStorage.getItem('isLogged') === 'true';
  const rol = localStorage.getItem('rol');

  if (!isLogged || rol !== 'comercio') {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Tus rutas públicas existentes (Inicio, Catálogo, etc.) */}
      
      {/* Rutas del Módulo Comerciante */}
      <Route path="/auth" element={<AuthPage onLoginSuccess={(u) => window.location.href = '/panel'} />} />
      <Route 
        path="/panel" 
        element={
          <RutaProtegidaComerciante>
            <PanelPage onLogout={() => window.location.href = '/auth'} />
          </RutaProtegidaComerciante>
        } 
      />
    </Routes>
  );
}
```

### Opción B: Usando Estado Nativo (Sin React Router)

Si tu proyecto prefiere cambiar de vistas con estado nativo (enfoque Unidad 1 de la cátedra):

```jsx
import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import PanelPage from './pages/PanelPage';
import Inicio from './pages/Inicio'; // Tu página principal

export default function App() {
  const [vista, setVista] = useState('inicio');
  const [usuario, setUsuario] = useState(() => {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  });

  const handleLogin = (user) => {
    setUsuario(user);
    setVista('panel');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setVista('inicio');
  };

  return (
    <div className="bg-[#070C16] text-white min-h-screen">
      {vista === 'inicio' && <Inicio irALogin={() => setVista('auth')} />}
      {vista === 'auth' && <AuthPage onLoginSuccess={handleLogin} onVolver={() => setVista('inicio')} />}
      {vista === 'panel' && <PanelPage usuario={usuario} onLogout={handleLogout} />}
    </div>
  );
}
```

---

## 🔒 Reglas de Negocio Implementadas en este Módulo

Al unir este módulo con el resto del sistema, ten en cuenta que respeta al 100% las definiciones del examen final:
1. **Sin Stock:** El formulario de producto y la base de datos no contienen campo de stock. La disponibilidad se consulta directamente al comerciante por WhatsApp o en el local.
2. **Sin Negociación ni Regateo:** Los precios son fijos (Precio regular y Precio de Oferta).
3. **Sin Chat ni Pedidos:** Cada producto y comercio ofrece botón de contacto directo por WhatsApp o llamada telefónica.
4. **Sin Directorio de Clientes:** El comerciante no tiene acceso a un listado de usuarios ni clientes registrados.
5. **Sin Calificaciones de Comercios:** Los comerciantes no pueden calificar ni ser calificados como entidades; las valoraciones son exclusivamente de 1 a 5 estrellas sobre productos individuales.
