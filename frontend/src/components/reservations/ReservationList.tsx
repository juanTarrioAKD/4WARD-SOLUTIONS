'use client';

import { useEffect, useState } from 'react';
import { getUserReservations } from '@/services/reservations';

interface Reservation {
  id: string;
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

interface ReservationListProps {
  userName: string;
  userLastName: string;
}

export default function ReservationList({ userName, userLastName }: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserReservations();
        setReservations(data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Token expirado o inválido') {
            setError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
          } else if (error.message === 'No hay token de autenticación') {
            setError('No has iniciado sesión. Por favor, inicia sesión para ver tus reservas.');
          } else {
            setError('Error al cargar las reservas');
          }
        } else {
          setError('Error al cargar las reservas');
        }
        console.error('Error al obtener las reservas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

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
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#a16bb7] text-sm mb-1">Vehículo</p>
                <p className="text-white font-medium">
                  {reservation.vehiculo.marca.nombre} - {reservation.vehiculo.modelo}
                </p>
                <p className="text-[#a16bb7] text-sm mt-1">
                  Patente: {reservation.vehiculo.patente}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#a16bb7] text-sm mb-1">Estado</p>
                <p className="text-white font-medium">{reservation.estado}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#a16bb7] text-sm mb-1">Fecha de Inicio</p>
                <p className="text-white font-medium">
                  {new Date(reservation.fecha_inicio).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#a16bb7] text-sm mb-1">Fecha de Fin</p>
                <p className="text-white font-medium">
                  {new Date(reservation.fecha_fin).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#a16bb7] text-sm mb-1">Fecha de Reserva</p>
                <p className="text-white font-medium">
                  {new Date(reservation.fecha_reserva).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#a16bb7] text-sm mb-1">Monto Total</p>
                <p className="text-white font-medium">
                  ${parseFloat(reservation.monto_total).toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 