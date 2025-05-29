interface User {
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
    const response = await fetch('http://localhost:8000/api/mock-login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }
    
    if (data.user) {
      // Guardar el token y el usuario en localStorage
      localStorage.setItem('token', data.access);
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

export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
}; 