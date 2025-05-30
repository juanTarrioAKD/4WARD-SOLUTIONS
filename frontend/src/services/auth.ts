import { API_BASE_URL } from '@/config/config';

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: string;
  puesto: string | null;
  localidad: number | null;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Credenciales inválidas');
    }

    const data = await response.json();
    
    // Guardar el token y la información del usuario
    localStorage.setItem('token', data.access);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
}; 