'use client';

import { useEffect, useState } from 'react';
import { getVehicles, Vehicle } from '@/services/vehicles';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        setError('Error al cargar los vehículos');
        console.error('Error al obtener los vehículos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">Cargando vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#e94b5a] text-lg">{error}</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">No hay vehículos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {vehicles.map((vehicle) => (
        <div 
          key={vehicle.id}
          className="bg-[#2d1830] p-6 rounded-lg shadow-lg border border-[#a16bb7] hover:border-[#e94b5a] transition-colors"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {vehicle.marca.nombre} {vehicle.modelo}
              </h3>
              <p className="text-[#a16bb7]">Año: {vehicle.año}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#a16bb7] text-sm">Patente</p>
                <p className="text-white">{vehicle.patente}</p>
              </div>
              <div>
                <p className="text-[#a16bb7] text-sm">Categoría</p>
                <p className="text-white">{vehicle.categoria.nombre}</p>
              </div>
              <div>
                <p className="text-[#a16bb7] text-sm">Estado</p>
                <p className="text-white">{vehicle.estado.nombre}</p>
              </div>
              <div>
                <p className="text-[#a16bb7] text-sm">Sucursal</p>
                <p className="text-white">{vehicle.sucursal.nombre}</p>
              </div>
            </div>

            <div>
              <p className="text-[#a16bb7] text-sm">Política</p>
              <p className="text-white">{vehicle.politica.nombre}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 