import { getCurrentUser, getAuthToken } from './auth';
import { API_BASE_URL } from '@/config/config';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No hay usuario autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/modificar/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: data.firstName,
        apellido: data.lastName,
        telefono: data.phoneNumber
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el perfil');
    }

    const updatedUser = await response.json();
    // Actualizar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al actualizar el perfil' 
    };
  }
}; 