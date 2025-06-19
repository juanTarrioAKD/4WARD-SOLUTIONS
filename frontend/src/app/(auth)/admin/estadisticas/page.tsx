'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface TopUser {
  email: string;
  alquileres: number;
  montoTotal: number;
  id: string;
}

interface TopVehicle {
  id: string;
  marca: string;
  modelo: string;
  totalAlquileres: number;
}

interface VehicleStats {
  nombre: string;
  cantidad: number;
  id: string;
}

export default function Estadisticas() {
  const router = useRouter();
  const [registrosRange, setRegistrosRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [registrosCount, setRegistrosCount] = useState<number | null>(128);
  const [topVehicles, setTopVehicles] = useState<VehicleStats[]>([
    { nombre: 'Toyota Corolla', cantidad: 45, id: '1' },
    { nombre: 'Honda Civic', cantidad: 38, id: '2' },
    { nombre: 'Ford Focus', cantidad: 32, id: '3' },
    { nombre: 'Volkswagen Golf', cantidad: 28, id: '4' },
    { nombre: 'Chevrolet Cruze', cantidad: 25, id: '5' }
  ]);

  // Datos de ejemplo para los usuarios con más alquileres
  const topUsers: TopUser[] = [
    {
      id: '1',
      email: 'maria.gonzalez@email.com',
      alquileres: 12,
      montoTotal: 2400
    },
    {
      id: '2',
      email: 'juan.perez@email.com',
      alquileres: 9,
      montoTotal: 1800
    },
    {
      id: '3',
      email: 'ana.rodriguez@email.com',
      alquileres: 7,
      montoTotal: 1400
    }
  ];

  // Obtener el vehículo más alquilado (el primero del array)
  const topVehicle: TopVehicle = {
    id: topVehicles[0].id,
    marca: topVehicles[0].nombre.split(' ')[0],
    modelo: topVehicles[0].nombre.split(' ')[1],
    totalAlquileres: topVehicles[0].cantidad
  };

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

  // Función para formatear el monto en pesos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Función para manejar la redirección al detalle del usuario
  const handleVerMas = (userId: string) => {
    router.push(`/admin/usuarios/${userId}/alquileres`);
  };

  // Función para manejar la redirección al detalle del vehículo
  const handleVerMasVehiculo = (vehiculoId: string) => {
    router.push(`/admin/vehiculos/${vehiculoId}/alquileres`);
  };

  // Función para manejar la redirección al detalle de registros por fecha
  const handleVerMasRegistros = () => {
    if (isDateRangeValid) {
      const queryParams = new URLSearchParams({
        startDate: registrosRange.startDate,
        endDate: registrosRange.endDate
      });
      router.push(`/admin/registros?${queryParams.toString()}`);
    }
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
                <div className="flex-1">
                  <h3 className="text-xl font-medium">{`${topVehicle.marca} ${topVehicle.modelo}`}</h3>
                  <p className="text-[#a16bb7]">Total alquileres: {topVehicle.totalAlquileres}</p>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleVerMasVehiculo(topVehicle.id)}
                      className="px-3 py-1 text-sm bg-[#a16bb7] hover:bg-[#8a5a9d] text-white rounded-md transition-colors duration-200"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
              {/* Gráfico de barras */}
              <div className="mt-4 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={topVehicles}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 20
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a3654" />
                    <XAxis 
                      dataKey="nombre" 
                      tick={false}
                      axisLine={{ stroke: '#4a3654' }}
                    />
                    <YAxis 
                      tick={{ fill: '#a16bb7' }}
                      label={{ 
                        value: 'Cantidad de Alquileres', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: '#a16bb7',
                        offset: 10,
                        dy: 50
                      }}
                      axisLine={{ stroke: '#4a3654' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#2d1830',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      cursor={{ fill: 'rgba(161, 107, 183, 0.1)' }}
                    />
                    <Bar 
                      dataKey="cantidad" 
                      fill="#a16bb7"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleVerMasRegistros}
                    disabled={!isDateRangeValid}
                    className="px-3 py-1 text-sm bg-[#a16bb7] hover:bg-[#8a5a9d] text-white rounded-md transition-colors duration-200 disabled:opacity-50"
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Usuarios con más alquileres */}
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Usuarios con Más Alquileres</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topUsers.map((user, index) => (
                <div key={index} className="bg-[#3d2342] p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-[#a16bb7] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-300 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-[#a16bb7] text-sm">Alquileres: </span>
                      <span className="text-white font-semibold ml-1">{user.alquileres}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#a16bb7] text-sm">Total: </span>
                      <span className="text-green-400 font-semibold ml-1">{formatCurrency(user.montoTotal)}</span>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleVerMas(user.id)}
                        className="px-3 py-1 text-sm bg-[#a16bb7] hover:bg-[#8a5a9d] text-white rounded-md transition-colors duration-200"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 