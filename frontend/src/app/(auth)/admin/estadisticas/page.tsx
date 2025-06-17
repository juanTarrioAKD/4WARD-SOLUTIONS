'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function Estadisticas() {
  const router = useRouter();
  const [registrosRange, setRegistrosRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [registrosCount, setRegistrosCount] = useState<number | null>(128); // valor inicial de ejemplo

  // Verificar que el usuario es admin al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    const userRoleId = Number(user?.rol);
    if (!user || userRoleId !== 3) {  // 3 es el ID del rol admin
      router.push('/'); // Redirigir al home si no es admin
    }
  }, [router]);

  // Validación de fechas
  const isDateRangeValid =
    registrosRange.startDate &&
    registrosRange.endDate &&
    registrosRange.endDate >= registrosRange.startDate;

  // Placeholder para la consulta al backend
  const handleBuscarRegistros = () => {
    setIsSearching(true);
    // Aquí iría la consulta al backend con registrosRange.startDate y registrosRange.endDate
    setTimeout(() => {
      setIsSearching(false);
      // setRegistrosCount(respuestaDelBackend)
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#3d2342] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Estadísticas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Auto más alquilado */}
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Auto más Alquilado</h2>
            <div className="bg-[#3d2342] p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-700 rounded-lg"></div>
                <div>
                  <h3 className="text-xl font-medium">Toyota Corolla</h3>
                  <p className="text-[#a16bb7]">Total alquileres: 45</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registros por fecha */}
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Registros por Fecha</h2>
            <div className="space-y-4">
              <div className="flex space-x-4 items-end">
                <div>
                  <label className="block text-sm text-[#a16bb7] mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={registrosRange.startDate}
                    onChange={(e) => setRegistrosRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-[#3d2342] border border-[#a16bb7] rounded-md px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a16bb7] mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={registrosRange.endDate}
                    min={registrosRange.startDate || undefined}
                    onChange={(e) => setRegistrosRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-[#3d2342] border border-[#a16bb7] rounded-md px-3 py-2 w-full"
                  />
                </div>
                <button
                  type="button"
                  className={`ml-2 h-10 px-4 rounded-md font-semibold bg-[#a16bb7] text-white hover:bg-[#8a5a9d] transition-colors disabled:opacity-50`}
                  disabled={!isDateRangeValid || isSearching}
                  onClick={handleBuscarRegistros}
                >
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              <div className="bg-[#3d2342] p-4 rounded-lg">
                <p className="text-2xl font-bold">{registrosCount !== null ? registrosCount : '-'}</p>
                <p className="text-[#a16bb7]">Registros totales</p>
              </div>
            </div>
          </div>

          {/* Vehículos mejor calificados */}
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Vehículos Mejor Calificados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Vehículo 1 */}
              <div className="bg-[#3d2342] p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-lg"></div>
                  <div>
                    <h3 className="text-lg font-medium">Toyota Corolla</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-[#a16bb7] ml-2">5.0</span>
                    </div>
                    <p className="text-[#a16bb7] text-sm">45 reseñas</p>
                  </div>
                </div>
              </div>

              {/* Vehículo 2 */}
              <div className="bg-[#3d2342] p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-lg"></div>
                  <div>
                    <h3 className="text-lg font-medium">Honda Civic</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-400">★</span>
                      <span className="text-[#a16bb7] ml-2">4.8</span>
                    </div>
                    <p className="text-[#a16bb7] text-sm">38 reseñas</p>
                  </div>
                </div>
              </div>

              {/* Vehículo 3 */}
              <div className="bg-[#3d2342] p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-lg"></div>
                  <div>
                    <h3 className="text-lg font-medium">Volkswagen Golf</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-400">★</span>
                      <span className="text-[#a16bb7] ml-2">4.7</span>
                    </div>
                    <p className="text-[#a16bb7] text-sm">32 reseñas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 