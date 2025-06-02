// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Authentication Configuration
export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_DATA_KEY = 'user_data';

// Other Configuration
export const DEFAULT_IMAGE_URL = '/default-category.jpg';
export const DEFAULT_CAR_IMAGE_URL = '/default-car.jpg';

// Configuración de CORS
export const CORS_CONFIG = {
  credentials: 'omit' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}; 