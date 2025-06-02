'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { searchAvailableCategories, type AvailableModel } from '@/services/categories';

export default function ModelosDisponibles() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelos, setModelos] = useState<AvailableModel[]>([]);

  const categoryId = searchParams.get('categoria_id');
  const fechaInicio = searchParams.get('fecha_inicio');
  const fechaFin = searchParams.get('fecha_fin');

  useEffect(() => {
    const fetchModelos = async () => {
      if (!categoryId || !fechaInicio || !fechaFin) {
        setError('Parámetros de búsqueda incompletos');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Buscando modelos para:', { categoryId, fechaInicio, fechaFin });
        const result = await searchAvailableCategories(fechaInicio, fechaFin);
        console.log('Resultado de la búsqueda:', result);

        const categoriaSeleccionada = result.available_categories.find(
          cat => cat.id === parseInt(categoryId)
        );

        if (!categoriaSeleccionada) {
          setError('No se encontró la categoría seleccionada');
          setIsLoading(false);
          return;
        }

        console.log('Categoría encontrada:', categoriaSeleccionada);
        setModelos(categoriaSeleccionada.modelos_disponibles || []);
      } catch (error) {
        console.error('Error al cargar modelos:', error);
        setError('Error al cargar los modelos disponibles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelos();
  }, [categoryId, fechaInicio, fechaFin]);

  const handleSelectModelo = (modeloId: number) => {
    router.push(`/confirmar-reserva?modelo_id=${modeloId}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-xl">Cargando modelos disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#e94b5a] text-xl">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#5e3e5a] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Modelos Disponibles
        </h1>

        {modelos.length === 0 ? (
          <div className="text-center">
            <p className="text-white text-xl mb-4">
              No hay modelos disponibles para las fechas seleccionadas
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
            >
              Volver
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelos.map((modelo) => (
              <div
                key={modelo.id}
                className="bg-[#2d1830]/90 backdrop-blur-sm rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => handleSelectModelo(modelo.id)}
              >
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/default-car.jpg"
                    alt={`Modelo ${modelo.nombre}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {modelo.nombre}
                </h2>
                <div className="space-y-2 text-[#a16bb7]">
                  <p>Disponibles: {modelo.cantidad_disponible}</p>
                  <p>Precio por día: ${modelo.precio_por_dia}</p>
                  {modelo.vehiculos[0] && (
                    <>
                      <p>Capacidad: {modelo.vehiculos[0].capacidad} personas</p>
                      <p>Año: {modelo.vehiculos[0].año}</p>
                      <p>Marca: {modelo.vehiculos[0].marca}</p>
                    </>
                  )}
                </div>
                <button
                  className="w-full mt-4 px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
                >
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 