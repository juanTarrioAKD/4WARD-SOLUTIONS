import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function PaymentSuccessPage() {
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
          ¡Pago Exitoso!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tu pago ha sido procesado correctamente. Pronto recibirás un correo electrónico con los detalles de tu alquiler.
        </Typography>
        <Link href="/mis-alquileres" passHref>
          <Button variant="contained" color="primary">
            Ver Mis Alquileres
          </Button>
        </Link>
      </Box>
    </Container>
  );
} 