'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

interface Alquiler {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  cliente: string;
  monto: number;
  estado: 'completado' | 'activo' | 'cancelado';
  sucursal: string;
}

interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  patente: string;
  totalAlquileres: number;
  montoTotal: number;
}

export default function DetalleAlquileresVehiculo() {
  const router = useRouter();
  const params = useParams();
  const vehiculoId = params.id as string;
  
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de ejemplo para el vehículo
  const vehiculoEjemplo: Vehiculo = {
    id: vehiculoId,
    marca: 'Toyota',
    modelo: 'Corolla',
    año: 2022,
    patente: 'ABC123',
    totalAlquileres: 45,
    montoTotal: 67500
  };

  // Datos de ejemplo para los alquileres
  const alquileresEjemplo: Alquiler[] = [
    {
      id: '1',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-01-18',
      cliente: 'maria.gonzalez@email.com',
      monto: 1500,
      estado: 'completado',
      sucursal: 'Sucursal Centro'
    },
    {
      id: '2',
      fechaInicio: '2024-01-20',
      fechaFin: '2024-01-25',
      cliente: 'juan.perez@email.com',
      monto: 2500,
      estado: 'completado',
      sucursal: 'Sucursal Norte'
    },
    {
      id: '3',
      fechaInicio: '2024-02-01',
      fechaFin: '2024-02-03',
      cliente: 'ana.rodriguez@email.com',
      monto: 1200,
      estado: 'completado',
      sucursal: 'Sucursal Sur'
    },
    {
      id: '4',
      fechaInicio: '2024-02-10',
      fechaFin: '2024-02-15',
      cliente: 'carlos.lopez@email.com',
      monto: 3000,
      estado: 'activo',
      sucursal: 'Sucursal Este'
    },
    {
      id: '5',
      fechaInicio: '2024-02-20',
      fechaFin: '2024-02-22',
      cliente: 'lucia.martinez@email.com',
      monto: 1800,
      estado: 'cancelado',
      sucursal: 'Sucursal Oeste'
    }
  ];

  // Verificar que el usuario es admin al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    const userRoleId = Number(user?.rol);
    if (!user || userRoleId !== 3) {
      router.push('/');
      return;
    }

    // Simular carga de datos
    setTimeout(() => {
      setVehiculo(vehiculoEjemplo);
      setAlquileres(alquileresEjemplo);
      setIsLoading(false);
    }, 1000);
  }, [router, vehiculoId]);

  // Función para formatear el monto en pesos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'bg-green-500';
      case 'activo':
        return 'bg-blue-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Función para obtener el texto del estado
  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'Completado';
      case 'activo':
        return 'Activo';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3d2342] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="min-h-screen bg-[#3d2342] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vehículo no encontrado</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-[#a16bb7] hover:bg-[#8a5a9d] text-white rounded-md transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3d2342] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-[#a16bb7] hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Estadísticas
            </button>
            <h1 className="text-4xl font-bold">Detalle de Alquileres</h1>
            <p className="text-[#a16bb7] text-lg mt-2">
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.año}) - {vehiculo.patente}
            </p>
          </div>
        </div>

        {/* Resumen del vehículo */}
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#a16bb7]">{vehiculo.totalAlquileres}</div>
              <div className="text-gray-300">Total de Alquileres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{formatCurrency(vehiculo.montoTotal)}</div>
              <div className="text-gray-300">Monto Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {vehiculo.montoTotal / vehiculo.totalAlquileres > 0 
                  ? formatCurrency(vehiculo.montoTotal / vehiculo.totalAlquileres)
                  : formatCurrency(0)
                }
              </div>
              <div className="text-gray-300">Promedio por Alquiler</div>
            </div>
          </div>
        </div>

        {/* Tabla de alquileres */}
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Historial de Alquileres</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#4a3654]">
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">Fecha Inicio</th>
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">Fecha Fin</th>
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">Sucursal</th>
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">Monto</th>
                  <th className="text-left py-3 px-4 text-[#a16bb7] font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {alquileres.map((alquiler) => (
                  <tr key={alquiler.id} className="border-b border-[#4a3654] hover:bg-[#3d2342] transition-colors">
                    <td className="py-3 px-4">{alquiler.id}</td>
                    <td className="py-3 px-4">{alquiler.cliente}</td>
                    <td className="py-3 px-4">{formatDate(alquiler.fechaInicio)}</td>
                    <td className="py-3 px-4">{formatDate(alquiler.fechaFin)}</td>
                    <td className="py-3 px-4">{alquiler.sucursal}</td>
                    <td className="py-3 px-4 font-semibold text-green-400">
                      {formatCurrency(alquiler.monto)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${getEstadoColor(alquiler.estado)}`}>
                        {getEstadoText(alquiler.estado)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {alquileres.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay alquileres registrados para este vehículo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 