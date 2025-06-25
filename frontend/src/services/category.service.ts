import { apiService } from './api.service';

export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    return apiService.get<Category[]>('/categorias/', { requiresAuth: false });
  },

  getCategory: async (id: number): Promise<Category> => {
    return apiService.get<Category>(`/categorias/${id}/`, { requiresAuth: false });
  }
}; 