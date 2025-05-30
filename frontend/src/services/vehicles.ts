interface Marca {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Estado {
  id: number;
  nombre: string;
}

interface Sucursal {
  id: number;
  nombre: string;
}

interface Politica {
  id: number;
  nombre: string;
}

export interface Vehicle {
  id: number;
  patente: string;
  marca: Marca;
  modelo: string;
  año: number;
  categoria: Categoria;
  estado: Estado;
  sucursal: Sucursal;
  politica: Politica;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/vehiculos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Error al obtener los vehículos: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los vehículos:', error);
    throw error;
  }
}; 