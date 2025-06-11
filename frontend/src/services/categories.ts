import { API_BASE_URL, AUTH_TOKEN_KEY } from '@/config/config';
import { getAuthToken } from '@/services/auth';
import { ModelsResponse, Model } from '@/types/models';

export interface Category {
  id: number;
  nombre: string;
  precio: number;
  image: string;
  description: string;
  available_vehicles: number;
  features: string[];
  name?: string; // Para compatibilidad con el componente existente
  price?: number; // Para compatibilidad con el componente existente
}

export interface Vehicle {
  id: number;
  patente: string;
  marca: string;
  año: number;
  capacidad: number;
}

export interface AvailableModel {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_por_dia: number;
  capacidad: number;
  cantidad_disponible: number;
  vehiculos: Vehicle[];
  categoria_id: number;
}

export interface CategoryWithModels extends Category {
  modelos_disponibles: Model[];
}

export interface SearchCategoriesResponse {
  available_categories: CategoryWithModels[];
}

export interface CategoryResponse {
  modelos_disponibles: AvailableModel[];
}

export interface CategoryFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: File | null;
  caracteristicas: string[];
}

export const searchAvailableCategories = async (
  fechaInicio: string,
  fechaFin: string
): Promise<SearchCategoriesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search-available-categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Error al buscar modelos disponibles: ${response.status}`
      );
    }

    const data = await response.json();
    return {
      available_categories: data.map((category: any) => ({
        id: category.id,
        name: category.nombre,
        image: category.imagen,
        price: category.precio,
        description: category.descripcion,
        modelos_disponibles: category.modelos_disponibles || []
      }))
    };
  } catch (error) {
    console.error('Error en searchAvailableCategories:', error);
    throw error;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories from:', `${API_BASE_URL}/api/categorias/`);
    const response = await fetch(`${API_BASE_URL}/api/categorias/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Error al obtener las categorías: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('Categories data received:', data);
    
    return data.map((category: any) => ({
      id: category.id,
      nombre: category.nombre || '',
      precio: parseFloat(category.precio) || 0,
      image: category.imagen || '/default-category.jpg',
      name: category.nombre || '', // Para compatibilidad con el componente
      price: parseFloat(category.precio) || 0, // Para compatibilidad con el componente
      description: category.descripcion || '',
      available_vehicles: category.vehiculos_disponibles || 0,
      features: category.caracteristicas || []
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Función auxiliar para manejar las URLs de las imágenes
export const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '/default-category.jpg';
  return imageUrl.startsWith('http') ? imageUrl : `/${imageUrl}`;
};

export const getAvailableModels = async (
  categoryId: number,
  fechaInicio: string,
  fechaFin: string
): Promise<CategoryResponse> => {
  try {
    console.log('Enviando solicitud con:', { categoryId, fechaInicio, fechaFin });
    
    const response = await fetch(`${API_BASE_URL}/api/vehiculos/modelos-disponibles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        categoria_id: categoryId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      })
    });

    if (!response.ok) {
      throw new Error(`Error al obtener modelos disponibles: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAvailableModels:', error);
    throw error;
  }
};