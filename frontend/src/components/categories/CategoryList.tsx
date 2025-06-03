import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip, Button, Alert, CircularProgress } from '@mui/material';
import { Category } from '@/services/categories';
import { createAlquiler } from '@/services/alquiler';
import { createPaymentPreference } from '@/services/payment';
import { getAuthToken } from '@/services/auth';
import { useRouter } from 'next/navigation';

interface CategoryListProps {
  categories: Category[];
  fechaInicio?: string;
  fechaFin?: string;
  onSelectCategory?: (categoryId: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  categories,
  fechaInicio,
  fechaFin,
  onSelectCategory
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleReservar = async (categoryId: number) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
      return;
    }

    if (!fechaInicio || !fechaFin) {
      console.error('Fechas no proporcionadas');
      return;
    }

    try {
      setIsLoading(categoryId);
      setError(null);

      console.log('Iniciando proceso de reserva para categoría:', categoryId);

      const token = getAuthToken();
      if (!token) {
        console.log('No hay token de autenticación, redirigiendo a login');
        router.push('/login');
        return;
      }

      const alquilerData = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        modelo_id: categoryId
      };

      console.log('Creando alquiler con datos:', alquilerData);
      const alquiler = await createAlquiler(alquilerData, token);
      console.log('Alquiler creado:', alquiler);

      console.log('Creando preferencia de pago para alquiler:', alquiler.id);
      const { init_point } = await createPaymentPreference(alquiler.id, token);
      console.log('URL de redirección:', init_point);

      if (!init_point) {
        throw new Error('No se recibió URL de redirección');
      }

      console.log('Redirigiendo a:', init_point);
      window.location.href = init_point;
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
      let errorMessage = 'Error al procesar la reserva';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  if (categories.length === 0) {
    return (
      <Alert severity="info">
        No hay categorías disponibles para las fechas seleccionadas
      </Alert>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)'
      },
      gap: 3
    }}>
      {error && (
        <Alert severity="error" sx={{ gridColumn: '1/-1' }}>
          {error}
        </Alert>
      )}

      {categories.map((category) => (
        <Card key={category.id}>
          <CardMedia
            component="img"
            height="200"
            image={category.image}
            alt={category.name}
          />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div">
                {category.name}
              </Typography>
              <Chip 
                label={`${category.available_vehicles} disponibles`}
                color="primary"
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {category.description}
            </Typography>
            
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              ${category.price.toFixed(2)} /día
            </Typography>

            <Box sx={{ mb: 2 }}>
              {category.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 2,
                backgroundColor: '#e94b5a',
                '&:hover': {
                  backgroundColor: '#b13e4a'
                }
              }}
              onClick={() => handleReservar(category.id)}
              disabled={isLoading === category.id}
            >
              {isLoading === category.id ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Reservar'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}; 