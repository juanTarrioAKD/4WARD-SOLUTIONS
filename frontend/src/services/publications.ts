import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';
import { Category } from '@/services/categories';

export interface Publication {
  id: number;
  categoria: Category;
  fecha_creacion: string;
}

export interface CreatePublicationData {
  categoria: number;
}

export const getPublications = async (): Promise<Publication[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('No autorizado');

  try {
    const response = await fetch(`${API_BASE_URL}/api/publicaciones/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Error al obtener las publicaciones: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw error;
  }
};

export const createPublication = async (data: CreatePublicationData): Promise<Publication> => {
  const token = getAuthToken();
  if (!token) throw new Error('No autorizado');

  try {
    const response = await fetch(`${API_BASE_URL}/api/publicaciones/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear la publicación');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createPublication:', error);
    throw error;
  }
};

export const deletePublication = async (id: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('No autorizado');

  try {
    const response = await fetch(`${API_BASE_URL}/api/publicaciones/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la publicación');
    }
  } catch (error) {
    console.error('Error en deletePublication:', error);
    throw error;
  }
}; 