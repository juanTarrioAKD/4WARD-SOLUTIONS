import { apiService } from './api.service';

export interface TopVehicle {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface Alquiler {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  cliente_email: string;
  cliente_nombre: string;
  monto_total: number;
  estado_nombre: string;
  sucursal_nombre: string;
}

export interface VehiculoDetalle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  patente: string;
  total_alquileres: number;
  monto_total: number;
}

export interface AlquileresVehiculoResponse {
  vehiculo: VehiculoDetalle;
  alquileres: Alquiler[];
}

export const estadisticasService = {
  async getTopVehicles(): Promise<TopVehicle[]> {
    return apiService.get<TopVehicle[]>('/estadisticas/mas_alquilado/', { requiresAuth: true });
  },

  async getAlquileresVehiculo(vehiculoId: string): Promise<AlquileresVehiculoResponse> {
    return apiService.get<AlquileresVehiculoResponse>(`/estadisticas/${vehiculoId}/alquileres-vehiculo/`, { requiresAuth: true });
  }
}; 