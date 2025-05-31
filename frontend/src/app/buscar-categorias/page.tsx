'use client';

import React, { useState } from 'react';
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { searchAvailableCategories, type Category } from '@/services/categories';
import { CategoryList } from '@/components/categories/CategoryList';

export default function BuscarCategoriasPage() {
  const router = useRouter();
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFechaInicio = e.target.value;
    setFechaInicio(newFechaInicio);
    // Si la fecha de fin es anterior a la nueva fecha de inicio, la reseteamos
    if (fechaFin && fechaFin < newFechaInicio) {
      setFechaFin('');
    }
  };

  const handleBuscar = async () => {
    if (!fechaInicio || !fechaFin) return;

    setIsLoading(true);
    setSearchPerformed(false);

    try {
      const response = await searchAvailableCategories(fechaInicio, fechaFin);
      setCategories(response.available_categories);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (categoryId: number) => {
    // Aquí puedes manejar la selección de una categoría
    console.log('Categoría seleccionada:', categoryId);
    // Por ejemplo, redirigir a la página de detalles de la categoría
    router.push(`/reservar/${categoryId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  };

  return (
    <div className="min-h-screen bg-[#5e3e5a] py-12">
      <Container maxWidth="lg">
        <div className="bg-[#2d1830] p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-white text-center">
              Buscar Vehículos Disponibles
            </h1>
            
            <p className="text-[#a16bb7] text-lg text-center">
              Selecciona las fechas para tu alquiler
            </p>

            <div className="w-full space-y-4">
              <div>
                <label htmlFor="fechaInicio" className="block text-white mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={handleFechaInicioChange}
                  min={today}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="fechaFin" className="block text-white mb-2">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio || today}
                  disabled={!fechaInicio}
                  className={`w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none ${
                    !fechaInicio ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                {!fechaInicio && (
                  <p className="text-[#e94b5a] text-sm mt-1">
                    Primero selecciona una fecha de inicio
                  </p>
                )}
              </div>

              <button
                onClick={handleBuscar}
                disabled={!fechaInicio || !fechaFin || isLoading}
                className={`w-full bg-[#e94b5a] text-white py-3 rounded-md font-semibold hover:bg-[#b13e4a] transition-colors ${
                  (!fechaInicio || !fechaFin || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Buscando...' : 'Buscar Categorías Disponibles'}
              </button>
            </div>

            {/* Mostrar resultados de la búsqueda */}
            {searchPerformed && (
              <div className="w-full mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Categorías Disponibles
                </h2>
                <CategoryList 
                  categories={categories}
                  fechaInicio={fechaInicio}
                  fechaFin={fechaFin}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 