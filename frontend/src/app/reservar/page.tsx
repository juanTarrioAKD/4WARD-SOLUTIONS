'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { PaymentButton } from '@/components/payment/PaymentButton';

export default function ReservarPage() {
  // TODO: Obtener el ID del alquiler de los parámetros o del estado global
  const alquilerId = 1; // Este valor debería venir de tu lógica de negocio

  const handlePaymentSuccess = () => {
    console.log('Pago iniciado correctamente');
  };

  const handlePaymentError = (error: Error) => {
    console.error('Error al iniciar el pago:', error);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Confirmar Reserva
        </Typography>
        <Typography variant="body1" gutterBottom>
          Para confirmar tu reserva, por favor procede con el pago:
        </Typography>
        
        <Box sx={{ width: '100%', mt: 2 }}>
          <PaymentButton
            alquilerId={alquilerId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Box>
      </Box>
    </Container>
  );
} 