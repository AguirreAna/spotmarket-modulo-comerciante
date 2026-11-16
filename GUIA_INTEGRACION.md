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
| `src/constants/categorias.js` | `src/constants/categorias.js` | Tipos de comercio (Minorista/Mayorista) y 27 categorías de productos A-Z |
| `src/utils/imageUrl.js` | `src/utils/imageUrl.js` | Resuelve URLs locales (`/uploads`) y de nube (Cloudinary) |
| `src/components/auth/` | `src/components/auth/` | Formularios de Login y Registro de Comerciantes con mapa y fotos |
| `src/components/comerciante/` | `src/components/comerciante/` | Dashboard, CRUD de Productos con preview, Ofertas y Perfil |
| `src/hooks/useForm.js` | `src/hooks/useForm.js` | Hook para manejo de inputs y validación |
| `src/hooks/useFetch.js` | `src/hooks/useFetch.js` | Hook para consumo HTTP con `AbortController` |
| `src/services/api.js` | `src/services/api.js` | Cliente centralizado con `credentials: 'include'` |
| `src/assets/Logo.svg` | `src/assets/Logo.svg` | Logotipos oficiales SpotMarket |
| `src/assets/LogoNavbar.svg` | `src/assets/LogoNavbar.svg` | |

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

## 🌐 Paso 3: Conexión con el Backend (XAMPP / MySQL)

El servicio `src/services/api.js` está preparado para comunicarse con el backend en el puerto `4000`.

En el archivo `.env` del proyecto destino agrega:
```env
VITE_API_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
```

> ⚠️ **Muy importante para la autenticación:** Todas las peticiones fetch de `api.js` llevan `credentials: 'include'`. Esto es obligatorio para que el navegador guarde y envíe automáticamente la cookie `token` (JWT `httpOnly`) que emite el backend de SpotMarket.

---

## 🔒 Reglas de Negocio Implementadas en este Módulo

Al unir este módulo con el resto del sistema, ten en cuenta que respeta al 100% las definiciones del examen final:
1. **Tipo de Comercio:** Diferenciación estricta entre **Minorista** y **Mayorista**.
2. **Categoría de Productos:** 27 categorías oficiales en orden alfabético A-Z (Almacén, Artesanías, Artículos de limpieza, Bazar, Bebidas, Carnicería, Embutidos, Farmacias, Ferretería, Fiambrería, Forrajería / Pet Shop, Frutería, Juguetería, Kiosco, Lácteos, Librería, Maxikiosco, Mueblería, Panadería, Pescadería, Polirubro, Pollería, Regalería, Ropería, Verdulería, Vivero, Zapatería).
3. **Fotos Visibles:** Previsualización inmediata en el cliente y soporte dual de almacenamiento (local en `/uploads` o Cloudinary).
4. **Mapa con Pantalla Completa:** Opción para agrandar el mapa y marcar la ubicación con precisión en Formosa Capital.
5. **Sin Stock:** No contiene campos de stock (la disponibilidad física se consulta directamente por WhatsApp).
6. **Sin Negociación ni Regateo:** Los precios son fijos (regular y oferta en cuotas).
7. **Sin Chat ni Pedidos:** Contacto directo por WhatsApp al número del comercio.
8. **Sin Calificaciones de Comercios:** Las valoraciones son exclusivamente de 1 a 5 estrellas sobre productos individuales.
