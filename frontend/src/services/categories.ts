export interface Category {
  id: number;
  name: string;
  image: string;
  price: number;
  available_vehicles: number;
  description: string;
  features: string[];
}

export interface SearchCategoriesResponse {
  available_categories: Category[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const searchAvailableCategories = async (
  fechaInicio: string,
  fechaFin: string
): Promise<SearchCategoriesResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    console.log('Enviando solicitud a:', `${API_BASE_URL}/search-available-categories/`);
    console.log('Datos:', { fecha_inicio: fechaInicio, fecha_fin: fechaFin });

    const response = await fetch(`${API_BASE_URL}/search-available-categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      }),
      signal: controller.signal,
      credentials: 'omit' // Importante para CORS
    });

    console.log('Estado de la respuesta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Error al buscar categorías disponibles');
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);

    if (!data.available_categories) {
      throw new Error('Respuesta inválida del servidor');
    }

    return data;
  } catch (error) {
    console.error('Error en searchAvailableCategories:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La búsqueda tomó demasiado tiempo');
      }
      throw error;
    }
    throw new Error('Error desconocido en la búsqueda');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-categories/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Función auxiliar para manejar las URLs de las imágenes
export const getImageUrl = (imageUrl: string): string => {
  return imageUrl.startsWith('http') ? imageUrl : `/${imageUrl}`;
}; 