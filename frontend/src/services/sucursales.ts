import { apiService } from './api.service';

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  localidad?: string;
}

export interface CreateSucursalData {
  nombre: string;
  direccion: string;
  telefono: string;
  localidad_id: number;
}

export interface UpdateSucursalData {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  localidad_id?: number;
}

export const sucursalesService = {
  // Obtener todas las sucursales
  async getSucursales(): Promise<Sucursal[]> {
    try {
      console.log('Intentando obtener sucursales...');
      const result = await apiService.get<Sucursal[]>('/sucursales/', { requiresAuth: false });
      console.log('Sucursales obtenidas:', result);
      return result;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      throw new Error('No se pudieron cargar las sucursales. Verifique que el backend esté corriendo.');
    }
  },

  // Obtener una sucursal específica
  async getSucursal(id: number): Promise<Sucursal> {
    return apiService.get<Sucursal>(`/sucursales/${id}/`, { requiresAuth: false });
  },

  // Crear una nueva sucursal
  async createSucursal(data: CreateSucursalData): Promise<Sucursal> {
    return apiService.post<Sucursal>('/sucursales/', data, { requiresAuth: false });
  },

  // Actualizar una sucursal
  async updateSucursal(id: number, data: UpdateSucursalData): Promise<Sucursal> {
    return apiService.put<Sucursal>(`/sucursales/${id}/modificar/`, data, { requiresAuth: false });
  },

  // Eliminar una sucursal (baja lógica)
  async deleteSucursal(id: number): Promise<void> {
    return apiService.delete(`/sucursales/${id}/baja/`, { requiresAuth: false });
  }
}; 