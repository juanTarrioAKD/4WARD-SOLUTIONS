import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: number;
  puesto?: string;
  localidad?: number;
}

export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
  rol?: number;
  puesto?: string;
  localidad?: number;
}

// Buscar usuarios por email
export const searchUsersByEmail = async (email: string): Promise<User[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/?search=${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al buscar usuarios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en searchUsersByEmail:', error);
    throw error;
  }
};

// Registrar nuevo cliente (para empleados/admin)
export const registerClient = async (userData: CreateUserData): Promise<{ usuario: User; password_generada: string }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/registrar-cliente/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al registrar usuario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en registerClient:', error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}/baja/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar usuario');
    }
  } catch (error) {
    console.error('Error en deleteUser:', error);
    throw error;
  }
};

// Cambiar rol de usuario (solo admin)
export const changeUserRole = async (userId: number, roleData: { rol: number; puesto?: string; localidad?: number }): Promise<User> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No autorizado');
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}/cambiar_rol/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cambiar rol de usuario');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en changeUserRole:', error);
    throw error;
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error response data:', errorData);
      throw new Error(`Error al obtener usuarios: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error completo en getAllUsers:', error);
    throw error;
  }
}; 