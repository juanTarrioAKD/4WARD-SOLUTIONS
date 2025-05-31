'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { SearchCategoriesForm } from '@/components/search/SearchCategoriesForm';
import { CategoryList } from '@/components/categories/CategoryList';
import { searchAvailableCategories, type Category } from '@/services/categories';

export default function ReservarPage() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    console.log('Iniciando búsqueda con fechas:', { fechaInicio, fechaFin });
    
    if (!fechaInicio || !fechaFin) {
      console.log('Fechas faltantes');
      setError('Por favor, selecciona ambas fechas');
      return;
    }

    try {
      console.log('Estableciendo estado de carga...');
      setIsLoading(true);
      setError(null);
      
      console.log('Llamando a la API...');
      const response = await searchAvailableCategories(fechaInicio, fechaFin);
      console.log('Respuesta de la API:', response);
      
      setAvailableCategories(response.available_categories);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Error al buscar categorías. Por favor, intenta nuevamente.'
      );
    } finally {
      console.log('Finalizando búsqueda...');
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (categoryId: number) => {
    console.log('Categoría seleccionada:', categoryId);
    // TODO: Implementar lógica de selección
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Reservar Vehículo
        </Typography>

        <SearchCategoriesForm
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          isLoading={isLoading}
          onFechaInicioChange={(fecha) => {
            console.log('Actualizando fecha inicio:', fecha);
            setFechaInicio(fecha);
          }}
          onFechaFinChange={(fecha) => {
            console.log('Actualizando fecha fin:', fecha);
            setFechaFin(fecha);
          }}
          onSearch={handleSearch}
        />

        {error && (
          <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
            {error}
          </Alert>
        )}

        {searchPerformed && !error && (
          <Box sx={{ width: '100%', mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Categorías Disponibles
            </Typography>
            
            <CategoryList 
              categories={availableCategories}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
} 