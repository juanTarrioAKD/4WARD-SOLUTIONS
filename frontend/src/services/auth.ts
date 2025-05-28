interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('http://localhost:8000/api/get-users/');
    const users = await response.json();
    
    const user = users.find((u: any) => 
      u.username === username && u.password === password
    );
    
    if (user) {
      // Guardar el usuario en localStorage para mantener la sesión
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
}; 