/**
 * Cliente HTTP unificado para el Módulo Comerciante de SpotMarket.
 * Utiliza fetch nativo (sin axios) enviando credentials: 'include' para cookies JWT httpOnly.
 * La URL base es configurable mediante import.meta.env.VITE_API_URL o fallback a '/api'.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function api(ruta, opciones = {}) {
  const url = ruta.startsWith('http') ? ruta : `${BASE_URL}${ruta.startsWith('/') ? '' : '/'}${ruta}`;

  const headers = { ...(opciones.headers || {}) };

  // Si el cuerpo NO es FormData, enviar encabezado Content-Type: application/json
  if (opciones.body && !(opciones.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const respuesta = await fetch(url, {
    ...opciones,
    headers,
    credentials: 'include' // Crucial: transmite y recibe cookies de autenticación
  });

  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje = datos?.mensaje || datos?.message || `Error HTTP: ${respuesta.status}`;
    const error = new Error(mensaje);
    error.status = respuesta.status;
    error.detalles = datos?.errores || [];
    throw error;
  }

  return datos;
}
