import { getCurrentUser } from './auth';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    // TODO: Implementar la llamada a la API para actualizar el perfil
    // Por ahora, solo actualizamos el localStorage
    const updatedUser = {
      ...currentUser,
      nombre: data.firstName,
      apellido: data.lastName,
      telefono: data.phoneNumber
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al actualizar el perfil' 
    };
  }
}; 