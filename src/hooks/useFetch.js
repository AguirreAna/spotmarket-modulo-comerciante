/**
 * Custom Hook: useFetch
 * Estándar pedagógico de la cátedra de Desarrollo de Software (Instituto Politécnico Formosa).
 * Declara la función async fuera del useEffect y gestiona estados de datos, carga y error.
 */
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

export function useFetch(url, dependencias = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);

    try {
      const resultado = await api(url, { method: 'GET' });
      setData(resultado);
    } catch (err) {
      setError(err.message || 'Error al obtener los datos.');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencias]);

  return { data, isLoading, error, refetch: fetchData };
}

export default useFetch;
