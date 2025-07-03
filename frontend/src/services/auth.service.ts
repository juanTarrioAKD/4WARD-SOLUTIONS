import { ENDPOINTS } from '../config/api';
import { apiService } from './api.service';

export interface LoginCredentials {
  email: string;
  password: string;
  codigo_admin?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_nacimiento: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    telefono: string;
    fecha_nacimiento: string;
    rol: string;
    puesto?: string;
    localidad?: number;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials, { requiresAuth: false });
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data, { requiresAuth: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: AuthResponse['user']) => {
    localStorage.setItem('user', JSON.stringify(user));
  }
}; 