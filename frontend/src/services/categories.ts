import { API_BASE_URL, AUTH_TOKEN_KEY } from '@/config/config';
import { getAuthToken } from '@/services/auth';
import { ModelsResponse, Model } from '@/types/models';

export interface Category {
  id: number;
  name: string;
  image: string;
  price: number;
  description?: string;
  available_vehicles: number;
  features: string[];
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
      name: category.nombre || '',
      image: category.imagen || '/default-category.jpg',
      price: parseFloat(category.precio) || 0,
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
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        categoria_id: categoryId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      })
    });

    const data = await response.json().catch(() => null);
    console.log('Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
    
    if (!response.ok) {
      throw new Error(
        data?.error || 
        `Error al obtener modelos disponibles (${response.status}): ${response.statusText}`
      );
    }

    if (!data) {
      throw new Error('No se recibieron datos del servidor');
    }

    return {
      modelos_disponibles: data.modelos_disponibles || []
    };
  } catch (error) {
    console.error('Error al obtener los modelos disponibles:', error);
    throw error;
  }
};

export const getModeloById = async (modeloId: number): Promise<AvailableModel> => {
  try {
    console.log('Obteniendo detalles del modelo:', modeloId);
    
    // Primero obtenemos los detalles básicos del modelo
    const modeloResponse = await fetch(`${API_BASE_URL}/api/modelos/${modeloId}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!modeloResponse.ok) {
      throw new Error('Error al obtener los detalles básicos del modelo');
    }

    const modeloData = await modeloResponse.json();

    // Luego obtenemos los detalles adicionales del vehículo asociado
    const vehiculoResponse = await fetch(`${API_BASE_URL}/api/vehiculos/?modelo=${modeloId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!vehiculoResponse.ok) {
      throw new Error('Error al obtener los detalles del vehículo');
    }

    const vehiculos = await vehiculoResponse.json();
    const vehiculo = vehiculos[0]; // Tomamos el primer vehículo como referencia

    if (!vehiculo) {
      throw new Error('No se encontró ningún vehículo para este modelo');
    }

    return {
      id: modeloId,
      nombre: modeloData.nombre,
      descripcion: vehiculo.descripcion || '',
      imagen_url: vehiculo.imagen_url || '',
      precio_por_dia: vehiculo.categoria.precio,
      capacidad: vehiculo.capacidad,
      cantidad_disponible: vehiculos.length,
      vehiculos: vehiculos.map((v: any) => ({
        id: v.id,
        patente: v.patente,
        marca: v.marca,
        año: v.año,
        capacidad: v.capacidad
      })),
      categoria_id: vehiculo.categoria.id
    };
  } catch (error) {
    console.error('Error al obtener los detalles del modelo:', error);
    throw error;
  }
}; 