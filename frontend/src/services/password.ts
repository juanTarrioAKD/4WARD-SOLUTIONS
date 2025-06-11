import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from './auth';
import { getCurrentUser } from './auth';

interface ChangePasswordData {
  contraseña: string;
  nueva_contraseña: string;
}

export const verifyCurrentPassword = async (currentPassword: string) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: currentUser.email,
        password: currentPassword
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Contraseña incorrecta');
    }

    return { success: true };
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al verificar la contraseña' 
    };
  }
};

export const changePassword = async (data: ChangePasswordData) => {
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
        contraseña: data.contraseña,
        nueva_contraseña: data.nueva_contraseña
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cambiar la contraseña');
    }

    return { success: true };
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al cambiar la contraseña' 
    };
  }
}; 