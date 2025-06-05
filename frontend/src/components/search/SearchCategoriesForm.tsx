import React from 'react';
import { Box, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';

interface SearchCategoriesFormProps {
  fechaInicio: string;
  fechaFin: string;
  isLoading: boolean;
  onFechaInicioChange: (fecha: string) => void;
  onFechaFinChange: (fecha: string) => void;
  onSearch: () => void;
}

export const SearchCategoriesForm: React.FC<SearchCategoriesFormProps> = ({
  fechaInicio,
  fechaFin,
  isLoading,
  onFechaInicioChange,
  onFechaFinChange,
  onSearch
}) => {
  const [showAlert, setShowAlert] = React.useState(false);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAlert(true);
    console.log('Botón de búsqueda clickeado');
    console.log('Estado actual:', { fechaInicio, fechaFin, isLoading });
    onSearch();
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                required
                fullWidth
                type="date"
                label="Fecha de inicio"
                value={fechaInicio}
                onChange={(e) => {
                  console.log('Cambiando fecha inicio:', e.target.value);
                  onFechaInicioChange(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <TextField
                required
                fullWidth
                type="date"
                label="Fecha de fin"
                value={fechaFin}
                onChange={(e) => {
                  console.log('Cambiando fecha fin:', e.target.value);
                  onFechaFinChange(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ flex: '0 0 100px' }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                onClick={handleSearchClick}
                disabled={isLoading || !fechaInicio || !fechaFin}
                sx={{ 
                  height: '56px',
                  backgroundColor: '#e91e63',
                  '&:hover': {
                    backgroundColor: '#c2185b'
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Buscar'}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="info" 
          sx={{ width: '100%' }}
        >
          ¡Botón clickeado! Buscando categorías...
        </Alert>
      </Snackbar>
    </>
  );
}; 