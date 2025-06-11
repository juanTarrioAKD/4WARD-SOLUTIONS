import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from './auth';

export interface Vehiculo {
  id: number;
  patente: string;
  marca: {
    id: number;
    nombre: string;
  } | null;
  modelo: {
    id: number;
    nombre: string;
  } | null;
  año_fabricacion: number;
  categoria: {
    id: number;
    nombre: string;
  } | null;
  estado: {
    id: number;
    nombre: string;
  } | null;
  sucursal: {
    id: number;
    nombre: string;
  } | null;
  capacidad: number;
}

export interface Vehicle {
  id: number;
  patente: string;
  marca: string;
  año: number;
  capacidad: number;
}

export const buscarVehiculoPorPatente = async (patente: string): Promise<Vehiculo[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/vehiculos/buscar_por_patente/?patente=${patente}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al buscar vehículo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en buscarVehiculoPorPatente:', error);
    throw error;
  }
};

export const crearVehiculo = async (vehiculoData: any): Promise<Vehiculo> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    console.log('Datos enviados al servidor:', vehiculoData);

    const response = await fetch(`${API_BASE_URL}/api/vehiculos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehiculoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Respuesta de error del servidor:', errorData);
      
      if (errorData.detail) {
        throw new Error(errorData.detail);
      } else if (errorData.error) {
        throw new Error(errorData.error);
      } else if (typeof errorData === 'string') {
        throw new Error(errorData);
      }
      throw new Error(`Error al crear vehículo (${response.status}): ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error completo en crearVehiculo:', error);
    throw error;
  }
};

export const modificarVehiculo = async (id: number, vehiculoData: any): Promise<Vehiculo> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/vehiculos/${id}/modificar/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehiculoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.detail) {
        throw new Error(errorData.detail);
      } else if (errorData.error) {
        throw new Error(errorData.error);
      } else if (typeof errorData === 'string') {
        throw new Error(errorData);
      }
      throw new Error(`Error al modificar vehículo (${response.status}): ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en modificarVehiculo:', error);
    throw error;
  }
};

export const getVehiculosDisponibles = async (
  modeloId: number,
  fechaInicio: string,
  fechaFin: string
): Promise<Vehicle[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    console.log('Consultando disponibilidad con:', {
      categoria_id: modeloId,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });

    const response = await fetch(`${API_BASE_URL}/api/vehiculos/modelos-disponibles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        categoria_id: modeloId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Error al obtener vehículos disponibles: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('Respuesta del servidor:', data);

    // El endpoint devuelve una lista de modelos con sus vehículos
    const modelos = data.modelos_disponibles || [];
    console.log('Modelos disponibles encontrados:', modelos.length);

    // Buscamos todos los vehículos disponibles de cualquier modelo
    const todosLosVehiculos = modelos.reduce((acc: Vehicle[], modelo: any) => {
      return acc.concat(modelo.vehiculos || []);
    }, []);

    console.log('Total de vehículos disponibles:', todosLosVehiculos.length);
    return todosLosVehiculos;
  } catch (error) {
    console.error('Error al obtener vehículos disponibles:', error);
    throw error;
  }
};

export const getAllVehiculos = async (): Promise<Vehiculo[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/vehiculos/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener vehículos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener todos los vehículos:', error);
    throw error;
  }
}; 