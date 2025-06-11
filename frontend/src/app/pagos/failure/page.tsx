import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function PaymentFailurePage() {
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
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Error en el Pago
        </Typography>
        <Typography variant="body1" gutterBottom>
          Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
        </Typography>
        <Link href="/mis-alquileres" passHref>
          <Button variant="contained" color="primary">
            Volver a Mis Alquileres
          </Button>
        </Link>
      </Box>
    </Container>
  );
} 