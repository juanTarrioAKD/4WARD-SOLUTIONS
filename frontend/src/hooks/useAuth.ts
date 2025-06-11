import { useState, useEffect } from 'react';
import { getCurrentUser, LoginResponse } from '@/services/auth';
import { AUTH_TOKEN_KEY } from '@/config/config';

type AuthUser = LoginResponse;

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser['user'] | null>(null);

  useEffect(() => {
    // Intentar obtener el token del localStorage
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const currentUser = getCurrentUser();

    if (storedToken && currentUser) {
      setToken(storedToken);
      setUser(currentUser);
    }
  }, []);

  const login = (authData: AuthUser) => {
    localStorage.setItem(AUTH_TOKEN_KEY, authData.access);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setToken(authData.access);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout
  };
} 