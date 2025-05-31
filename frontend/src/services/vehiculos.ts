import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from './auth';

export interface Vehiculo {
  id: number;
  patente: string;
  marca: {
    id: number;
    nombre: string;
  };
  modelo: string;
  año: number;
  categoria: {
    id: number;
    nombre: string;
  };
  estado: {
    id: number;
    nombre: string;
  };
  sucursal: {
    id: number;
    nombre: string;
  };
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

    const response = await fetch(`${API_BASE_URL}/api/vehiculos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehiculoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear vehículo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearVehiculo:', error);
    throw error;
  }
}; 