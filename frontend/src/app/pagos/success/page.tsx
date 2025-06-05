'use client';

import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmailIcon from '@mui/icons-material/Email';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const alquilerId = searchParams.get('alquiler_id');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3d2342 0%, #a16bb7 100%)',
        py: 8,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={6}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <CheckCircleOutlineIcon 
              sx={{ 
                fontSize: 80, 
                color: '#e94b5a',
                mb: 2
              }} 
            />

            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                color: '#3d2342',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              ¡Reserva Confirmada!
            </Typography>

            {alquilerId && (
              <Box
                sx={{
                  backgroundColor: '#f8f0ff',
                  p: 2,
                  borderRadius: 2,
                  width: '100%',
                  textAlign: 'center',
                  border: '2px dashed #a16bb7'
                }}
              >
                <Typography variant="h6" sx={{ color: '#3d2342' }}>
                  Número de Reserva
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#e94b5a',
                    fontWeight: 'bold',
                    letterSpacing: 1
                  }}
                >
                  #{alquilerId}
                </Typography>
              </Box>
            )}

            <Box sx={{ width: '100%', my: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <DirectionsCarIcon sx={{ color: '#a16bb7' }} />
                <Typography variant="body1" sx={{ color: '#3d2342' }}>
                  Tu vehículo está reservado y listo para ser retirado
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#a16bb7' }} />
                <Typography variant="body1" sx={{ color: '#3d2342' }}>
                  Recibirás un email con los detalles de tu reserva
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex', 
                gap: 2, 
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%',
                mt: 2
              }}
            >
              <Link href="/mis-alquileres" passHref style={{ width: '100%' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    backgroundColor: '#e94b5a',
                    '&:hover': {
                      backgroundColor: '#b13e4a'
                    },
                    py: 1.5
                  }}
                >
                  Ver Mis Alquileres
                </Button>
              </Link>
              
              <Link href="/reservar" passHref style={{ width: '100%' }}>
                <Button 
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: '#a16bb7',
                    color: '#a16bb7',
                    '&:hover': {
                      borderColor: '#3d2342',
                      backgroundColor: 'rgba(161, 107, 183, 0.04)'
                    },
                    py: 1.5
                  }}
                >
                  Nueva Reserva
                </Button>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 