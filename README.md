# 🏪 SpotMarket - Módulo de Autenticación y Panel de Comerciante

Módulo frontend desacoplado desarrollado en **React + Vite + Tailwind CSS** para la plataforma **SpotMarket**.

Este paquete contiene la lógica completa y los componentes visuales necesarios para:
1. **Autenticación:** Inicio de sesión (`LoginForm`) y registro de comercios (`RegisterComercioForm`) con geolocalización en Formosa Capital y preview de fotos de fachada.
2. **Panel de Gestión del Comerciante:**
   - **Métricas / Dashboard:** Contador de productos activos, ofertas vigentes, vistas comunitarias y valoración media de productos.
   - **Gestión de Catálogo (CRUD de Productos):** Alta, edición y eliminación de productos con nombre, categoría, precio de lista, precio de oferta, cuotas y foto. *(Regla de negocio: Sin stock y sin regateo/negociación)*.
   - **Gestión de Ofertas Temporales:** Creación y activación de promociones con porcentaje de descuento y fecha de vigencia.
   - **Perfil del Comercio:** Visualización y edición de dirección, WhatsApp comercial para contacto directo, teléfono y horario de atención.

---

## 🎯 Enfoque Pedagógico (Instituto Politécnico Formosa)

El código sigue estrictamente las pautas enseñadas en la cátedra de Desarrollo de Software (Prof. Agustín Centurión):
- **Custom Hooks Reutilizables:**
  - `useForm`: Controla el estado bidireccional de los inputs y validaciones sin librerías externas.
  - `useFetch`: Manejo pedagógico de llamadas asíncronas con soporte de cancelación (`AbortController`), `loading` y captura de `error`.
- **Manejo de Sesión Limpio:** Se utiliza `localStorage` con la bandera `isLogged` para el control de vista en frontend y cookies seguras `httpOnly` (`credentials: 'include'`) para el token JWT emitido por el backend.
- **Sin Dependencias Innecesarias:** Implementado con la API nativa de JavaScript `fetch`, sin Axios ni Redux, logrando un código claro y 100% defendible en la exposición oral.

---

## 📂 Estructura del Módulo

```text
spotmarket-modulo-comerciante/
├── src/
│   ├── assets/
│   │   ├── Logo.svg                # Isologo oficial SpotMarket
│   │   └── LogoNavbar.svg          # Logotipo horizontal con contraste alto
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx             # Formulario de login validado con toggle de contraseña
│   │   │   └── RegisterComercioForm.jsx  # Registro en 3 pasos: datos, mapa Formosa y fotos
│   │   └── comerciante/
│   │       ├── NavbarComerciante.jsx     # Barra de navegación del comerciante con avatar y logout
│   │       ├── ResumenDashboard.jsx      # Tarjetas KPI de resumen
│   │       ├── GestionProductos.jsx      # Tabla + Modal de alta/edición (sin stock ni negociación)
│   │       ├── GestionOfertas.jsx        # Panel de descuentos temporales
│   │       └── PerfilComercio.jsx        # Datos de contacto y ubicación física
│   ├── hooks/
│   │   ├── useFetch.js             # Hook para consumo de endpoints
│   │   └── useForm.js              # Hook para control de formularios
│   ├── pages/
│   │   ├── AuthPage.jsx            # Página conmutadora Login / Registro
│   │   └── PanelPage.jsx           # Vista principal del comerciante
│   ├── services/
│   │   └── api.js                  # Cliente fetch centralizado con credentials: 'include'
│   ├── App.jsx                     # Enrutador por estado (Auth <-> Panel)
│   ├── index.css                   # Tailwind base y utilidades
│   └── main.jsx                    # Punto de entrada de React 18
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Puesta en Marcha Rápida

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El módulo se iniciará en `http://localhost:5174`.

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🔗 Integración con otro Proyecto React

Para incorporar este módulo a otro repositorio existente del equipo sin generar conflictos ni duplicar dependencias, consulta la guía detallada:
👉 **[GUIA_INTEGRACION.md](./GUIA_INTEGRACION.md)**
