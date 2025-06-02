import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

export interface Category {
  id: number;
  name: string;
  image: string;
  price: number;
  description?: string;
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
  cantidad_disponible: number;
  precio_por_dia: number;
  vehiculos: Vehicle[];
}

export interface CategoryWithModels {
  id: number;
  name: string;
  image: string;
  price: number;
  description?: string;
  modelos_disponibles: AvailableModel[];
}

export interface SearchCategoriesResponse {
  available_categories: CategoryWithModels[];
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
    
    // Transformar los datos del backend al formato del frontend
    return data.map((category: any) => ({
      id: category.id,
      name: category.nombre || '',
      image: category.imagen || '/default-category.jpg',
      price: parseFloat(category.precio) || 0,
      description: category.descripcion || ''
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