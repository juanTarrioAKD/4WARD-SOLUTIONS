import { API_BASE_URL } from '@/config/config';

export interface CreateAlquilerData {
  fecha_inicio: string;
  fecha_fin: string;
  fecha_reserva: string;
  vehiculo_id: number;
}

export interface Alquiler {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_reserva: string;
  monto_total: string;
  estado: {
    id: number;
    nombre: string;
  };
  vehiculo: {
    id: number;
    patente: string;
    modelo: {
      id: number;
      nombre: string;
    };
  };
}

export const createAlquiler = async (data: CreateAlquilerData, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alquileres/`, {
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

export const getAlquilerById = async (id: number, token: string): Promise<Alquiler> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/alquileres/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Error al obtener el alquiler';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        console.error('Respuesta no-JSON del servidor:', errorText);
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener alquiler:', error);
    throw error;
  }
}; 