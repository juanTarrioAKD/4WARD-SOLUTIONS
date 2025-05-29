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

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('http://localhost:8000/api/usuarios/login/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email.trim().toLowerCase(), 
        password 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzamos el error específico del backend
      throw new Error(data.error || 'Credenciales inválidas');
    }
    
    if (data.user) {
      // Guardar los tokens y el usuario en localStorage
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Llamar al endpoint de logout
      await fetch('http://localhost:8000/api/usuarios/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Limpiar el almacenamiento local independientemente del resultado
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}; 