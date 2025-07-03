import { authService } from './auth.service';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiService = {
  async fetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (requiresAuth) {
      const token = authService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Asegurarse de que la URL se construya correctamente
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        authService.logout();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }
      const error = await response.json();
      throw new Error(error.error || 'Error en la petición');
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