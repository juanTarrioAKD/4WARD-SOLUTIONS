interface Reservation {
  id: string;
  numeroReserva: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_reserva: string;
  monto_total: string;
  estado: string;
  vehiculo: {
    patente: string;
    marca: {
      nombre: string;
    };
    modelo: string;
  };
}

export const getUserReservations = async (): Promise<Reservation[]> => {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch('http://localhost:8000/api/alquileres/mis-alquileres/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token expirado o inválido');
      }
      throw new Error('Error al obtener las reservas');
    }

    const data = await response.json();
    return data.alquileres;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}; 