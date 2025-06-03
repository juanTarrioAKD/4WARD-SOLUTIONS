export interface Vehicle {
  id: number;
  patente: string;
  marca: string;
  año: number;
  capacidad: number;
}

export interface Model {
  id: number;
  nombre: string;
  cantidad_disponible: number;
  precio_por_dia: number;
  vehiculos: Vehicle[];
}

export interface ModelsResponse {
  categoria_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  modelos_disponibles: Model[];
}

// Funciones auxiliares para modelos
export const formatModelPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price);
};

export const getVehicleCapacityText = (capacity: number): string => {
  return `${capacity} ${capacity === 1 ? 'persona' : 'personas'}`;
};

export const getAvailabilityText = (cantidad: number): string => {
  return `${cantidad} ${cantidad === 1 ? 'vehículo disponible' : 'vehículos disponibles'}`;
}; 