/**
 * Custom Hook: useForm
 * Estándar pedagógico de la cátedra de Desarrollo de Software (Instituto Politécnico Formosa).
 * Maneja el estado local de formularios utilizando la forma funcional del setter.
 */
import { useState } from 'react';

export function useForm(valoresIniciales = {}) {
  const [formState, setFormState] = useState(valoresIniciales);

  // Actualización controlada conservando los valores anteriores
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Asignación directa de un campo puntual
  const setCampo = (nombre, valor) => {
    setFormState((prev) => ({
      ...prev,
      [nombre]: valor
    }));
  };

  // Reiniciar formulario a valores iniciales
  const handleReset = () => {
    setFormState(valoresIniciales);
  };

  return {
    formState,
    handleInputChange,
    handleReset,
    setCampo,
    setFormState
  };
}

export default useForm;
