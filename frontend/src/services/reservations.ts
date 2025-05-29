interface Reservation {
  id: string;
  numeroReserva: string;
}

// Datos mockeados de reservas
const mockReservations: { [key: string]: Reservation[] } = {
  // Reservas para Juan Pérez
  'juan@gmail.com': [
    { id: '001', numeroReserva: 'R2024-001' },
    { id: '002', numeroReserva: 'R2024-002' },
    { id: '003', numeroReserva: 'R2024-003' }
  ],
  // Reservas para María González
  'maria@hotmail.com': [
    { id: '004', numeroReserva: 'R2024-004' },
    { id: '005', numeroReserva: 'R2024-005' }
  ],
  // Admin 1 (para demostrar que los admins también pueden tener reservas)
  'admin1@alquilappcar.com': [
    { id: '006', numeroReserva: 'R2024-006' }
  ]
};

export const getUserReservations = async (userEmail: string): Promise<Reservation[]> => {
  // Simulamos un delay para simular una llamada a API real
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Retornamos las reservas del usuario o un array vacío si no tiene
  return mockReservations[userEmail] || [];
}; 