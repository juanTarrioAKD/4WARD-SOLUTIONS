import { API_BASE_URL } from '@/config/config';

export interface CreateAlquilerData {
  fecha_inicio: string;
  fecha_fin: string;
  categoria_id: number;
}

export const createAlquiler = async (data: CreateAlquilerData, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alquileres/crear/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Error al crear el alquiler';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Si no podemos parsear la respuesta como JSON, intentamos obtener el texto
        const errorText = await response.text();
        console.error('Respuesta no-JSON del servidor:', errorText);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear alquiler:', error);
    throw error;
  }
}; 