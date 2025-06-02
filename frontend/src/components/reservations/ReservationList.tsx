'use client';

import { useEffect, useState } from 'react';
import { getUserReservations } from '@/services/reservations';

interface Reservation {
  id: string;
  numeroReserva: string;
}

interface ReservationListProps {
  userEmail: string;
  userName: string;
  userLastName: string;
}

export default function ReservationList({ userEmail, userName, userLastName }: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserReservations(userEmail);
        setReservations(data);
      } catch (error) {
        setError('Error al cargar las reservas');
        console.error('Error al obtener las reservas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [userEmail]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">Cargando reservas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#e94b5a] text-lg">{error}</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">
          No hay alquileres asociados a {userName} {userLastName}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div 
          key={reservation.id}
          className="bg-[#3d2342] p-4 rounded-md border border-[#a16bb7] hover:border-[#e94b5a] transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#a16bb7] text-sm mb-1">ID de Reserva</p>
              <p className="text-white font-medium">{reservation.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[#a16bb7] text-sm mb-1">Número de Reserva</p>
              <p className="text-white font-medium">{reservation.numeroReserva}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 