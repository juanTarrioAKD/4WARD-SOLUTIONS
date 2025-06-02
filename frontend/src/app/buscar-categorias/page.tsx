'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from '@/components/DatePicker';

export default function BuscarCategorias() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoria_id');

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Establecer la fecha mínima como el día actual a las 00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Función para validar el rango de fechas
  const validateDateRange = (start: Date | null, end: Date | null): string | null => {
    if (!start || !end) {
      return 'Por favor selecciona ambas fechas';
    }

    // Asegurarse de que las fechas estén en el mismo formato (sin hora)
    const startDate = new Date(start.setHours(0, 0, 0, 0));
    const endDate = new Date(end.setHours(0, 0, 0, 0));
    const todayDate = new Date(today.setHours(0, 0, 0, 0));

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

    // Si la fecha de inicio existe, validar el rango
    if (fechaInicio) {
      const validationError = validateDateRange(fechaInicio, date);
      if (validationError) {
        setError(validationError);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // Formatear las fechas para la URL (usando la zona horaria local)
    const fechaInicioStr = new Date(fechaInicio.setHours(0, 0, 0, 0)).toISOString();
    const fechaFinStr = new Date(fechaFin.setHours(23, 59, 59, 999)).toISOString();

    // Navegar a la página de modelos disponibles con los parámetros
    router.push(
      `/modelos-disponibles?categoria_id=${categoryId}&fecha_inicio=${fechaInicioStr}&fecha_fin=${fechaFinStr}`
    );
  };

  return (
    <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
      <div className="max-w-md mx-auto bg-[#2d1830]/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Selecciona las Fechas
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">
              Fecha de Inicio
            </label>
            <DatePicker
              selected={fechaInicio}
              onChange={handleStartDateChange}
              minDate={today}
              placeholderText="Selecciona fecha de inicio"
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              Fecha de Fin
            </label>
            <DatePicker
              selected={fechaFin}
              onChange={handleEndDateChange}
              minDate={fechaInicio || today}
              placeholderText="Selecciona fecha de fin"
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
              disabled={!fechaInicio}
            />
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 text-white hover:text-[#e94b5a] transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={!!error || !fechaInicio || !fechaFin}
              className="flex-1 px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 