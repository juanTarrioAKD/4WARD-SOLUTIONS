import { apiService } from './api.service';

export interface TopVehicle {
  id: string;
  nombre: string;
  cantidad: number;
}

export const estadisticasService = {
  async getTopVehicles(): Promise<TopVehicle[]> {
    return apiService.get<TopVehicle[]>('/estadisticas/mas_alquilado/', { requiresAuth: true });
  }
}; 