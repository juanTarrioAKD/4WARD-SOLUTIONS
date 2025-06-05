'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from '@/components/DatePicker';
import ModelList from '@/components/ModelList';
import { getAvailableModels, type AvailableModel } from '@/services/categories';
import { createAlquiler } from '@/services/alquiler';
import { createPaymentPreference } from '@/services/payment';
import { getAuthToken } from '@/services/auth';

export default function BuscarCategorias() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoria_id');

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelos, setModelos] = useState<AvailableModel[]>([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Establecer la fecha mínima como el día actual a las 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Función para validar el rango de fechas
  const validateDateRange = (start: Date | null, end: Date | null): string | null => {
    if (!start || !end) {
      return 'Por favor selecciona ambas fechas';
    }

    // Asegurarse de que las fechas estén en el mismo formato (sin hora)
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);
    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0);

    if (startDate < todayDate) {
      return 'La fecha de inicio no puede ser anterior a hoy';
    }

    if (endDate <= startDate) {
      return 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    // Calcular la diferencia en días
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      return 'El período máximo de alquiler es de 30 días';
    }

    return null;
  };

  // Manejador para cambios en la fecha de inicio
  const handleStartDateChange = (date: Date | null) => {
    setFechaInicio(date);
    setError(null);
    setBusquedaRealizada(false);
    setModelos([]);
    
    // Si la fecha de fin existe, validar el rango
    if (fechaFin) {
      const validationError = validateDateRange(date, fechaFin);
      if (validationError) {
        setError(validationError);
      }
    }
  };

  // Manejador para cambios en la fecha de fin
  const handleEndDateChange = (date: Date | null) => {
    setFechaFin(date);
    setError(null);
    setBusquedaRealizada(false);
    setModelos([]);

    // Si la fecha de inicio existe, validar el rango
    if (fechaInicio) {
      const validationError = validateDateRange(fechaInicio, date);
      if (validationError) {
        setError(validationError);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Categoría no seleccionada');
      return;
    }

    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona las fechas de inicio y fin');
      return;
    }

    const validationError = validateDateRange(fechaInicio, fechaFin);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      // Formatear las fechas para la API
      const fechaInicio_temp = new Date(fechaInicio.getTime());
      fechaInicio_temp.setHours(0, 0, 0, 0);
      const fechaInicioStr = fechaInicio_temp.toISOString();

      const fechaFin_temp = new Date(fechaFin.getTime());
      fechaFin_temp.setHours(23, 59, 59, 999);
      const fechaFinStr = fechaFin_temp.toISOString();

      console.log('Fechas formateadas para la API:', {
        fechaInicioStr,
        fechaFinStr,
        fechaInicio_temp,
        fechaFin_temp
      });

      const response = await getAvailableModels(
        parseInt(categoryId),
        fechaInicioStr,
        fechaFinStr
      );

      setModelos(response.modelos_disponibles);
      setBusquedaRealizada(true);
    } catch (error) {
      console.error('Error al buscar modelos:', error);
      setError(error instanceof Error ? error.message : 'Error al buscar modelos disponibles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectModel = async (modelId: number) => {
    if (!fechaInicio || !fechaFin || !categoryId) {
      setError('Faltan datos necesarios para la reserva');
      return;
    }

    try {
      setIsLoading(true);
      setError(''); // Limpiar error anterior
      
      const token = getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      // Formatear las fechas para la API
      const fechaInicio_temp = new Date(fechaInicio.getTime());
      fechaInicio_temp.setHours(0, 0, 0, 0);
      const fechaInicioStr = fechaInicio_temp.toISOString();

      const fechaFin_temp = new Date(fechaFin.getTime());
      fechaFin_temp.setHours(23, 59, 59, 999);
      const fechaFinStr = fechaFin_temp.toISOString();

      const alquilerData = {
        modelo_id: modelId,
        fecha_inicio: fechaInicioStr,
        fecha_fin: fechaFinStr,
      };

      console.log('Datos del alquiler a enviar:', alquilerData);
      const alquiler = await createAlquiler(alquilerData, token);
      
      // Redirigir a la página de confirmación de reserva con el ID del alquiler
      router.push(`/confirmar-reserva?alquiler_id=${alquiler.id}`);
    } catch (error) {
      console.error('Error detallado al procesar la reserva:', error);
      // Mostrar el mensaje de error específico del backend
      setError(error instanceof Error ? error.message : 'Error al procesar la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-md mx-auto bg-[#2d1830]/90 backdrop-blur-sm rounded-lg p-8 shadow-xl mb-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Selecciona las Fechas
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-row gap-4 items-end mb-4">
              <div className="flex-1">
                <label className="block text-white mb-2">
                  Fecha de Inicio
                </label>
                <DatePicker
                  selected={fechaInicio}
                  onChange={handleStartDateChange}
                  minDate={today}
                  placeholderText="Selecciona fecha de inicio"
                />
              </div>

              <div className="flex-1">
                <label className="block text-white mb-2">
                  Fecha de Fin
                </label>
                <DatePicker
                  selected={fechaFin}
                  onChange={handleEndDateChange}
                  minDate={fechaInicio || today}
                  placeholderText="Selecciona fecha de fin"
                  isDisabled={!fechaInicio}
                />
              </div>

              <button
                type="submit"
                disabled={!!error || !fechaInicio || !fechaFin || isLoading}
                className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-white hover:text-[#e94b5a] transition-colors text-sm"
              >
                Volver
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-[#a16bb7]/30">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Categoría Deportivo
              </h2>
              <div className="inline-block px-6 py-3 bg-[#3d2342] rounded-lg">
                <p className="text-[#a16bb7] text-sm mb-1">Precio por día</p>
                <p className="text-white text-3xl font-bold">$15.000</p>
              </div>
              <p className="text-[#a16bb7] mt-4 text-sm">
                Vehículos de alta gama con prestaciones deportivas
              </p>
            </div>
          </div>
        </div>

        {busquedaRealizada && !isLoading && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Modelos Disponibles
            </h2>
            <ModelList models={modelos} onSelectModel={handleSelectModel} />
          </div>
        )}
      </div>
    </div>
  );
} 