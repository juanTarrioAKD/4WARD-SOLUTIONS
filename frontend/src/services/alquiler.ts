import { API_BASE_URL } from '@/config/config';

// Función de ayuda para formatear fechas
const formatDateForBackend = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Si ya es un string ISO, solo reemplazamos Z por +00:00
    return date.replace('Z', '+00:00');
  }
  // Si es un objeto Date, lo convertimos a ISO y reemplazamos Z
  return date.toISOString().replace('Z', '+00:00');
};

export interface CreateAlquilerData {
  modelo_id: number;
  fecha_inicio: Date | string;  // Aceptamos ambos tipos
  fecha_fin: Date | string;     // Aceptamos ambos tipos
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
    // Asegurarnos de que las fechas sean objetos Date
    const formattedData = {
      modelo_id: data.modelo_id,
      fecha_inicio: formatDateForBackend(typeof data.fecha_inicio === 'string' ? new Date(data.fecha_inicio) : data.fecha_inicio),
      fecha_fin: formatDateForBackend(typeof data.fecha_fin === 'string' ? new Date(data.fecha_fin) : data.fecha_fin),
    };

    console.log('Datos formateados a enviar:', formattedData);

    const response = await fetch(`${API_BASE_URL}/api/alquileres/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    const responseData = await response.json();
    console.log('Respuesta completa del servidor:', responseData);

    if (!response.ok) {
      let errorMessage = 'Error al crear el alquiler';
      
      // Intentar obtener el mensaje de error específico
      if (responseData.non_field_errors && responseData.non_field_errors.length > 0) {
        errorMessage = responseData.non_field_errors[0];
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else {
        // Si hay otros campos con errores, mostrarlos
        const errorFields = Object.keys(responseData).filter(key => Array.isArray(responseData[key]));
        if (errorFields.length > 0) {
          errorMessage = responseData[errorFields[0]][0];
        }
      }
      
      console.error('Error detallado del servidor:', responseData);
      throw new Error(errorMessage);
    }

    // Validar que la respuesta tenga un ID
    if (!responseData.id) {
      console.error('Respuesta del servidor sin ID:', responseData);
      throw new Error('La respuesta del servidor no incluye el ID del alquiler');
    }

    console.log('Alquiler creado exitosamente con ID:', responseData.id);
    return responseData;
  } catch (error) {
    console.error('Error detallado al crear alquiler:', error);
    throw error;
  }
};

export const getAlquilerById = async (id: number, token: string): Promise<Alquiler> => {
  try {
    if (!id || isNaN(id)) {
      throw new Error('ID de alquiler inválido');
    }

    console.log('Obteniendo alquiler con ID:', id);
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
        console.error('Error detallado del servidor:', errorData);
        errorMessage = errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        console.error('Respuesta no-JSON del servidor:', errorText);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Datos del alquiler recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener alquiler:', error);
    throw error;
  }
}; 