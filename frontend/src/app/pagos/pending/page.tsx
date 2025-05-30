import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function PaymentPendingPage() {
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
          Pago Pendiente
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tu pago está siendo procesado. Una vez que se confirme, recibirás un correo electrónico con los detalles.
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