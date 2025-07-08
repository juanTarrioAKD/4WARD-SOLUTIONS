import { apiService } from './api.service';

export interface Localidad {
  id: number;
  nombre: string;
}

export const localidadesService = {
  async getLocalidades(): Promise<Localidad[]> {
    return apiService.get<Localidad[]>('/localidades/', { requiresAuth: false });
  }
}; 