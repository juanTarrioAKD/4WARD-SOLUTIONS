'use client';

import { useEffect, useState } from 'react';
import { getUserReservations } from '@/services/reservations';

interface Reservation {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  monto_total: string;
  vehiculo: {
    modelo: {
      nombre: string;
    };
    categoria: {
      nombre: string;
    };
  };
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
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Error al cargar las reservas');
        }
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
          No se encontraron alquileres
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(parseFloat(amount));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {reservations.map((reservation) => (
        <div 
          key={reservation.id}
          className="bg-gradient-to-br from-[#3d2342] to-[#2d1a31] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
        >
          {/* Encabezado con Categoría y Modelo */}
          <div className="bg-[#4a2b50] p-4 border-b border-[#a16bb7]">
            <h3 className="text-[#e94b5a] font-semibold text-lg">
              {reservation.vehiculo.categoria.nombre}
            </h3>
            <p className="text-white text-xl font-bold mt-1">
              {reservation.vehiculo.modelo.nombre}
            </p>
          </div>

          {/* Cuerpo con fechas */}
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[#a16bb7] text-sm">Fecha de inicio</p>
              <p className="text-white font-medium">
                {formatDate(reservation.fecha_inicio)}
              </p>
            </div>
            <div>
              <p className="text-[#a16bb7] text-sm">Fecha de fin</p>
              <p className="text-white font-medium">
                {formatDate(reservation.fecha_fin)}
              </p>
            </div>

            {/* Precio con estilo destacado */}
            <div className="mt-6 pt-4 border-t border-[#a16bb7]">
              <p className="text-[#e94b5a] text-sm font-semibold">Precio final</p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(reservation.monto_total)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 