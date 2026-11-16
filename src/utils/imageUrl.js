// Utilidad para resolver y normalizar URLs de imágenes en SpotMarket.
// Soporta fotos en la nube (Cloudinary), fotos locales (/uploads) y placeholders.

export const resolverUrlImagen = (url, fallback = '/assets/Logo.svg') => {
  if (!url) return fallback;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) {
    const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    return `${backendBase}${url}`;
  }
  return url;
};
