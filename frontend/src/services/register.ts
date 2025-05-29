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
    const response = await fetch('http://localhost:8000/api/usuarios/register/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        telefono: userData.telefono.trim(),
        fecha_nacimiento: userData.fecha_nacimiento,
        rol: 1 // ID 1 corresponde al rol "cliente"
      })
    });

    // Obtenemos la respuesta en JSON
    const data = await response.json();

    // Si la respuesta no es ok, manejamos el error
    if (!response.ok) {
      // Si el backend devuelve un objeto con múltiples errores
      if (typeof data === 'object' && data !== null) {
        // Si hay un mensaje de error específico
        if (data.error) {
          return {
            success: false,
            error: data.error
          };
        }
        // Si hay errores por campo
        const errorMessages = [];
        for (const [field, errors] of Object.entries(data)) {
          if (Array.isArray(errors)) {
            errorMessages.push(`${field}: ${errors.join(', ')}`);
          }
        }
        if (errorMessages.length > 0) {
          return {
            success: false,
            error: errorMessages.join('. ')
          };
        }
      }
      
      return {
        success: false,
        error: 'Error al registrar el usuario'
      };
    }

    // Si todo salió bien, retornamos el éxito y los datos del usuario
    return {
      success: true,
      ...data
    };

  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: false,
      error: 'Error de conexión al intentar registrar el usuario'
    };
  }
}; 