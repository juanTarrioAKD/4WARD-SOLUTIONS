interface Reservation {
  id: string;
  numeroReserva: string;
}

export const getUserReservations = async (userEmail: string): Promise<Reservation[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/mock-reservations/');
    if (!response.ok) {
      throw new Error('Error al obtener las reservas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}; 