import React from 'react';
import { Button } from '@mui/material';
import { createPaymentPreference } from '@/services/payment';
import { getAuthToken } from '@/services/auth';

interface PaymentButtonProps {
  alquilerId: number;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentButton({ alquilerId, className = '', onSuccess, onError }: PaymentButtonProps) {
  const handlePayment = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const { init_point } = await createPaymentPreference(alquilerId, token as string);
      
      if (!init_point) {
        throw new Error('No se recibió el punto de inicio de pago');
      }

      // Redirigir a la página de pago de Mercado Pago
      window.location.href = init_point;
      // No llamamos a onSuccess() aquí porque la redirección ocurrirá antes
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      onError?.(error as Error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handlePayment}
      fullWidth
      className={`px-6 py-3 bg-[#00b1ea] text-white font-semibold rounded-md hover:bg-[#0095c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      Pagar con Mercado Pago
    </Button>
  );
} 