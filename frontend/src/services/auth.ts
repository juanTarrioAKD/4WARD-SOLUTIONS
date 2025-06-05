import { API_BASE_URL, AUTH_TOKEN_KEY } from '@/config/config';

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: number | { id: number; nombre: string };
  puesto: string | null;
  localidad: number | null;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

interface AdminLoginResponse {
  error: string;
  require_admin_code: boolean;
}

export const login = async (
  email: string, 
  password: string, 
  adminCode?: string
): Promise<LoginResponse | AdminLoginResponse> => {
  try {
    const loginData: any = { email, password };
    if (adminCode) {
      loginData.codigo_admin = adminCode;
    }

    const response = await fetch(`${API_BASE_URL}/api/usuarios/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si requiere código de administrador, devolvemos esa respuesta específica
      if (data.require_admin_code) {
        return {
          error: data.error,
          require_admin_code: true
        };
      }
      throw new Error(data.error || 'Credenciales inválidas');
    }

    // Si el login fue exitoso, guardamos los datos
    localStorage.setItem(AUTH_TOKEN_KEY, data.access);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
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

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }
  return token;
}; 