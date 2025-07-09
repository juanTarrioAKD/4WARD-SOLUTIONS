import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

// Función de ayuda para formatear fechas
const formatDateForBackend = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Si ya es un string ISO, solo reemplazamos Z por +00:00
    return date.replace('Z', '+00:00');
  }
  // Si es un objeto Date, lo convertimos a ISO y reemplazamos Z
  return date.toISOString().replace('Z', '+00:00');
};

export interface Alquiler {
  id: number;
  cliente: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  vehiculo: {
    id: number;
    patente: string;
    marca: { nombre: string };
    modelo: { nombre: string };
  };
  fecha_inicio: string;
  fecha_fin: string;
  monto_total: number;
  estado: string;
}

export interface CreateAlquilerData {
  cliente_email: string;
  modelo_id: number;
  sucursal_retiro: number;
  sucursal_devolucion: number;
  fecha_inicio: string;
  fecha_fin: string;
}

// Registrar alquiler para cliente (empleados)
export const registrarAlquilerParaCliente = async (data: CreateAlquilerData): Promise<Alquiler> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/alquileres/alquilar-para-cliente/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al registrar alquiler');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registrarAlquilerParaCliente:', error);
    throw error;
  }
};

// Cancelar alquiler para cliente (empleados)
export const cancelarAlquilerParaCliente = async (alquilerId: number): Promise<{ mensaje: string; monto_devolucion: number }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/alquileres/cancelar-para-cliente/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alquiler_id: alquilerId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cancelar alquiler');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en cancelarAlquilerParaCliente:', error);
    throw error;
  }
};

// Retirar vehículo (empleados)
export const retirarVehiculo = async (alquilerId: number): Promise<{
  mensaje: string;
  alquiler_id: number;
  cliente: string;
  vehiculo: string;
  estado: string;
}> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/alquileres/retirar-vehiculo/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alquiler_id: alquilerId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al retirar vehículo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en retirarVehiculo:', error);
    throw error;
  }
};

// Registrar devolución (empleados)
export const registrarDevolucion = async (alquilerId: number, sucursalDevolucion?: number): Promise<{
  mensaje: string;
  alquiler_id: number;
  vehiculo: string;
  cliente: string;
  sucursal_asignada: string;
  sucursal_devolucion_real: string;
  monto_extra: number;
  mensaje_cobro: string;
}> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const requestData: any = { alquiler_id: alquilerId };
    if (sucursalDevolucion) {
      requestData.sucursal_devolucion = sucursalDevolucion;
    }

    const response = await fetch(`${API_BASE_URL}/api/alquileres/registrar-devolucion/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al registrar devolución');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registrarDevolucion:', error);
    throw error;
  }
};

// Obtener reserva y cliente por ID
export const getReservaYCliente = async (alquilerId: number): Promise<{
  reserva: Alquiler;
  cliente: any;
}> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/alquileres/${alquilerId}/reserva-y-cliente/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener reserva');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getReservaYCliente:', error);
    throw error;
  }
};

// Función existente
export const getAlquilerById = async (id: number): Promise<Alquiler> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/alquileres/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener alquiler');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAlquilerById:', error);
    throw error;
  }
}; 