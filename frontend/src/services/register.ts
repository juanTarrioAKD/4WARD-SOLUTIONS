// Interfaces para el registro
interface RegisterData {
  username: string;
  email: string;
  password: string;
  birthdate: string;
}

interface ValidationResponse {
  isValid: boolean;
  error?: string;
}

// Función para verificar si el usuario ya existe
export const checkUserExists = async (username: string, email: string): Promise<ValidationResponse> => {
  try {
    // Llamada a la API para verificar usuarios existentes
    const response = await fetch('http://localhost:8000/api/get-users/');
    if (!response.ok) {
      throw new Error('Error al verificar usuarios existentes');
    }
    const users = await response.json();
    
    // Verificar si el username ya existe
    const usernameExists = users.some((user: any) => user.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      return {
        isValid: false,
        error: 'El nombre de usuario ya está en uso'
      };
    }

    // Verificar si el email ya existe
    const emailExists = users.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return {
        isValid: false,
        error: 'El email ya está registrado'
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return {
      isValid: false,
      error: 'Error al verificar disponibilidad del usuario'
    };
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Primero verificamos si el usuario ya existe
    const validationResult = await checkUserExists(userData.username, userData.email);
    if (!validationResult.isValid) {
      return {
        success: false,
        error: validationResult.error
      };
    }

    // Realizamos la llamada al endpoint de registro
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        birthdate: userData.birthdate
      })
    });

    // Si la respuesta no es ok, intentamos obtener el mensaje de error
    if (!response.ok) {
      let errorMessage = 'Error al registrar el usuario';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Si no podemos parsear el error, usamos el mensaje por defecto
      }
      return {
        success: false,
        error: errorMessage
      };
    }

    // Intentamos parsear la respuesta exitosa
    try {
      const data = await response.json();
      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('Error parsing success response:', error);
      return {
        success: false,
        error: 'Error al procesar la respuesta del servidor'
      };
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: 'Error de conexión al intentar registrar el usuario'
    };
  }
}; 