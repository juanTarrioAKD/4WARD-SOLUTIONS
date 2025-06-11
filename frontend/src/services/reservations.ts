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
  } | string;
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
    console.log('Fetching reservations...'); // Debug log
    const response = await fetch(`${API_BASE_URL}/api/usuarios/mis-alquileres/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status); // Debug log
    
    if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      console.log('Error data:', errorData); // Debug log
      throw new Error(errorData.error || 'Sesión expirada o sin autorización. Por favor, inicie sesión nuevamente.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        console.log('No hay alquileres asociados al usuario'); // Debug log
        return [];
      }
      throw new Error(errorData.detail || 'Error al obtener las reservas');
    }

    const data = await response.json();
    console.log('Received data:', data); // Debug log
    
    // Asegurarse de que estamos devolviendo el array de alquileres
    const reservations = data.alquileres || [];
    console.log('Processed reservations:', reservations); // Debug log
    
    return reservations;
  } catch (error) {
    console.error('Error completo:', error); // Debug log
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Error al obtener las reservas');
  }
};

export const cancelReservation = async (reservationId: number): Promise<{ message: string; monto_devolucion: number; porcentaje_devolucion: number }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No hay sesión activa. Por favor, inicie sesión nuevamente.');
  }

  try {
    console.log('Token presente:', !!token);
    console.log('Intentando cancelar reserva:', reservationId);
    const response = await fetch(`${API_BASE_URL}/api/alquileres/${reservationId}/cancelar/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Cancel response:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error || 'Error al cancelar la reserva');
    }

    return {
      message: data.message || 'Reserva cancelada exitosamente',
      monto_devolucion: Number(data.monto_devolucion) || 0,
      porcentaje_devolucion: Number(data.porcentaje_devolucion) || 0
    };
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    throw error instanceof Error ? error : new Error('Error al cancelar la reserva');
  }
}; 