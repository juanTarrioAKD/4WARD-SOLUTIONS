interface Policy {
  id: number;
  nombre: string;
  descripcion: string;
  porcentaje: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const getPolicies = async (): Promise<Policy[]> => {
  try {
    console.log('Intentando conectar a:', `${API_BASE_URL}/api/mock-policies/`);
    
    const response = await fetch(`${API_BASE_URL}/api/mock-policies/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = 'Error al obtener las políticas';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no podemos parsear la respuesta, usamos el mensaje por defecto
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error completo:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`No se pudo conectar al servidor en ${API_BASE_URL}. Asegúrate de que el servidor esté corriendo.`);
    }
    throw error;
  }
}; 