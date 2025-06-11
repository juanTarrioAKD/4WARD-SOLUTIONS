'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
      <div className="max-w-md mx-auto bg-[#2d1830]/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Reserva en Proceso
          </h1>
          
          <div className="bg-[#3d2342] rounded-lg p-6 mb-8">
            <p className="text-[#a16bb7] mb-4">
              Tu reserva está siendo procesada. Recibirás un correo electrónico con los detalles y el estado de tu reserva.
            </p>
            <p className="text-white text-sm">
              Por favor, revisa tu bandeja de entrada y la carpeta de spam.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/mis-alquileres')}
              className="w-full px-6 py-3 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
            >
              Ver Mis Alquileres
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="text-white hover:text-[#e94b5a] transition-colors text-sm"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 