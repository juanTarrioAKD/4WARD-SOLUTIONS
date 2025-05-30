import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth';

interface AuthUser {
  token: string;
  user: {
    id: number;
    email: string;
    nombre: string;
    rol: string;
  };
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser['user'] | null>(null);

  useEffect(() => {
    // Intentar obtener el token del localStorage
    const storedToken = localStorage.getItem('token');
    const currentUser = getCurrentUser();

    if (storedToken && currentUser) {
      setToken(storedToken);
      setUser(currentUser);
    }
  }, []);

  const login = (authData: AuthUser) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
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