import React from 'react';
import { Button } from '@mui/material';
import { createPaymentPreference } from '@/services/payment';
import { getAuthToken } from '@/services/auth';

interface PaymentButtonProps {
  alquilerId: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  alquilerId,
  onSuccess,
  onError
}) => {
  const handlePayment = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const { init_point } = await createPaymentPreference(alquilerId, token as string);
      // Redirigir a la página de pago de Mercado Pago
      window.location.href = init_point;
      onSuccess?.();
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
    >
      Pagar con Mercado Pago
    </Button>
  );
}; 