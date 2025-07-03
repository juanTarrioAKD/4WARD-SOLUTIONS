export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/usuarios/login/`,
    REGISTER: `${API_BASE_URL}/usuarios/register/`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/usuarios/`,
    BAJA: (id: number) => `${API_BASE_URL}/usuarios/${id}/baja/`,
  },
  CATALOGS: {
    ROLES: `${API_BASE_URL}/roles/`,
    LOCALIDADES: `${API_BASE_URL}/localidades/`,
    CATEGORIAS: `${API_BASE_URL}/categorias/`,
  }
}; 