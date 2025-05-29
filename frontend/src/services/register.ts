// Interfaces para el registro
interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  fecha_nacimiento: string;
}

// Función para registrar un nuevo usuario
export const registerUser = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Realizamos la llamada al endpoint de registro
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        email: userData.email.trim().toLowerCase(),
        telefono: userData.telefono.trim(),
        password: userData.password,
        fecha_nacimiento: userData.fecha_nacimiento
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