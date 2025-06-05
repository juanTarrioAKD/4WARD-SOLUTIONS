import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

interface Reservation {
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
    categoria: {
      nombre: string;
    };
  };
}

export const getUserReservations = async (userEmail: string): Promise<Reservation[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay sesión activa. Por favor, inicie sesión nuevamente.');
  }

  try {
    console.log('Token:', token); // Para debug
    const response = await fetch(`${API_BASE_URL}/api/usuarios/mis-alquileres/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status); // Para debug
    
    if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error data:', errorData); // Para debug
      throw new Error(errorData.error || 'Sesión expirada o sin autorización. Por favor, inicie sesión nuevamente.');
    }


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al obtener las reservas');
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error data:', 'No hay alquileres asociados al usuario'); // Para debug
      }
    }


    const data = await response.json();
    return data.alquileres || [];
  } catch (error) {
    console.error('Error completo:', error); // Para debug
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error al obtener las reservas');
  }
}; 