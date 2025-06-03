'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { getAuthToken } from '@/services/auth';
import { getAlquilerById } from '@/services/alquiler';

interface ReservationDetails {
  modeloNombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  precioTotal: number;
}

export default function ConfirmarReserva() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [alquilerId, setAlquilerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const alquilerId = searchParams.get('alquiler_id');
        if (!alquilerId) {
          throw new Error('ID de alquiler no proporcionado');
        }

        const alquiler = await getAlquilerById(parseInt(alquilerId), token);
        if (!alquiler) {
          throw new Error('No se pudo obtener la información del alquiler');
        }

        setDetails({
          modeloNombre: alquiler.vehiculo.modelo.nombre,
          fechaInicio: new Date(alquiler.fecha_inicio),
          fechaFin: new Date(alquiler.fecha_fin),
          precioTotal: parseFloat(alquiler.monto_total)
        });

        setAlquilerId(parseInt(alquilerId));

      } catch (error) {
        console.error('Error al cargar los detalles:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los detalles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [router, searchParams]);

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };

  const formatPrice = (price: number) => {
    try {
      return price.toLocaleString('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    } catch (error) {
      console.error('Error al formatear precio:', error);
      return 'Precio inválido';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
        <div className="max-w-md mx-auto">
          <p className="text-white text-center">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
        <div className="max-w-md mx-auto bg-[#2d1830]/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <p className="text-[#e94b5a] text-center mb-4">{error || 'No se pudieron cargar los detalles'}</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.back()}
              className="text-white hover:text-[#e94b5a] transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-white hover:text-[#e94b5a] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Volver atrás
        </button>

        <div className="bg-[#2d1830]/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Confirmar Reserva
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {details.modeloNombre}
              </h2>
            </div>

            <div className="bg-[#3d2342] rounded-lg p-4">
              <div className="mb-4">
                <p className="text-[#a16bb7] text-sm">Fecha de inicio</p>
                <p className="text-white">{formatDate(details.fechaInicio)}</p>
              </div>
              <div>
                <p className="text-[#a16bb7] text-sm">Fecha de fin</p>
                <p className="text-white">{formatDate(details.fechaFin)}</p>
              </div>
            </div>

            <div className="bg-[#3d2342] rounded-lg p-4">
              <p className="text-[#a16bb7] text-sm">Precio total</p>
              <p className="text-white text-2xl font-bold">
                ${formatPrice(details.precioTotal)}
              </p>
            </div>

            {alquilerId && (
              <div className="mt-8">
                <PaymentButton alquilerId={alquilerId} className="w-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 