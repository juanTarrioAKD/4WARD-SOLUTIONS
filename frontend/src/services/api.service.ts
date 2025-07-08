import { authService } from './auth.service';
import { API_BASE_URL } from '@/config/config';

const API_URL = `${API_BASE_URL}/api`;

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiService = {
  async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers as Record<string, string>,
    };

    if (requiresAuth) {
      const token = authService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Token encontrado:', token.substring(0, 20) + '...');
      } else {
        console.warn('No se encontró token de autenticación');
      }
    }

    // Asegurarse de que la URL se construya correctamente
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    console.log('API URL construida:', url);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('API_URL:', API_URL);
    console.log('endpoint:', endpoint);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido - no redirigir automáticamente
        console.warn('Error 401: Token expirado o inválido');
        authService.logout();
        throw new Error('No autorizado. Verifique que esté logueado como administrador.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
    }

    // Si la respuesta es 204 No Content, no intentes parsear JSON
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return response.json();
  },

  // Métodos HTTP
  get: <T>(endpoint: string, options?: RequestOptions) => 
    apiService.fetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    apiService.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: any, options?: RequestOptions) =>
    apiService.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiService.fetch<T>(endpoint, { ...options, method: 'DELETE' }),
}; 