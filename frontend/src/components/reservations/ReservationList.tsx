'use client';

import { useEffect, useState } from 'react';
import { getUserReservations, cancelReservation } from '@/services/reservations';

interface Reservation {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  monto_total: string;
  estado: {
    id: number;
    nombre: string;
  } | string;
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
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<{id: number, message: string} | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUserReservations(userEmail);
        console.log('Reservations data:', data); // Debug log
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

  const handleCancelReservation = async (reservationId: number) => {
    try {
      // Verificar si la reserva ya está siendo cancelada
      if (cancellingId === reservationId) {
        return;
      }

      // Verificar si la reserva ya está cancelada
      const reservation = reservations.find(res => res.id === reservationId);
      if (!reservation || (typeof reservation.estado === 'object' && reservation.estado.id === 2)) {
        setError('Esta reserva ya ha sido cancelada');
        return;
      }

      setCancellingId(reservationId);
      setError(null);
      const result = await cancelReservation(reservationId);
      
      // Actualizar el estado de la reserva en lugar de eliminarla
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === reservationId 
            ? { 
                ...res, 
                estado: { 
                  id: 2, // ID para estado "Cancelada"
                  nombre: 'Cancelada'
                }
              }
            : res
        )
      );
      
      setCancelSuccess({
        id: reservationId,
        message: `Reserva cancelada. Monto a devolver: $${result.monto_devolucion} (${result.porcentaje_devolucion}%)`
      });

      // Limpiar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setCancelSuccess(null);
      }, 5000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cancelar la reserva');
    } finally {
      setCancellingId(null);
    }
  };

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

  const getEstadoId = (estadoString: string): number | null => {
    const match = estadoString.match(/\((\d+)\)$/);
    return match ? parseInt(match[1]) : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cancelSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
          {cancelSuccess.message}
        </div>
      )}
      
      {reservations.map((reservation) => {
        const estadoId = typeof reservation.estado === 'string' ? getEstadoId(reservation.estado) : null;
        return (
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

              {/* Estado de la reserva */}
              <div>
                <p className="text-[#a16bb7] text-sm">Estado</p>
                <p className="text-white font-medium">
                  {estadoId === 1 ? 'Confirmada' : 
                   estadoId === 2 ? 'Cancelada' : 
                   estadoId === 3 ? 'Finalizada' : 
                   'Estado no disponible'}
                </p>
              </div>

              {/* Precio con estilo destacado */}
              <div className="mt-6 pt-4 border-t border-[#a16bb7]">
                <p className="text-[#e94b5a] text-sm font-semibold">Precio final</p>
                <p className="text-white text-2xl font-bold">
                  {formatCurrency(reservation.monto_total)}
                </p>
              </div>

              {/* Botón de cancelar (solo para reservas confirmadas) */}
              {estadoId === 1 && (
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  disabled={cancellingId === reservation.id}
                  className={`w-full mt-4 px-4 py-2 rounded-md text-white transition-colors ${
                    cancellingId === reservation.id
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-[#e94b5a] hover:bg-[#b13e4a]'
                  }`}
                >
                  {cancellingId === reservation.id ? 'Cancelando...' : 'Cancelar Reserva'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 