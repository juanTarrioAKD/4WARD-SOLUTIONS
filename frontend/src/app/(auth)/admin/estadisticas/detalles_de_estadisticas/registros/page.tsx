'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

interface Registro {
  id: string;
  fecha: string;
  tipo: 'nuevo_usuario' | 'nueva_reserva' | 'nuevo_vehiculo' | 'nuevo_pago';
  descripcion: string;
  usuario: string;
  detalles: string;
}

interface ResumenRegistros {
  totalRegistros: number;
  nuevosUsuarios: number;
  nuevasReservas: number;
  nuevosVehiculos: number;
  nuevosPagos: number;
}

export default function DetalleRegistros() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [resumen, setResumen] = useState<ResumenRegistros | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de ejemplo para los registros
  const registrosEjemplo: Registro[] = [
    {
      id: '1',
      fecha: '2024-01-01',
      tipo: 'nuevo_usuario',
      descripcion: 'Nuevo usuario registrado',
      usuario: 'maria.gonzalez@email.com',
      detalles: 'Usuario registrado desde la web'
    },
    {
      id: '2',
      fecha: '2024-01-01',
      tipo: 'nueva_reserva',
      descripcion: 'Nueva reserva creada',
      usuario: 'juan.perez@email.com',
      detalles: 'Reserva para Toyota Corolla - 3 días'
    },
    {
      id: '3',
      fecha: '2024-01-02',
      tipo: 'nuevo_pago',
      descripcion: 'Pago procesado',
      usuario: 'ana.rodriguez@email.com',
      detalles: 'Pago de $1500 por reserva #123'
    },
    {
      id: '4',
      fecha: '2024-01-02',
      tipo: 'nuevo_usuario',
      descripcion: 'Nuevo usuario registrado',
      usuario: 'carlos.lopez@email.com',
      detalles: 'Usuario registrado desde la app móvil'
    },
    {
      id: '5',
      fecha: '2024-01-03',
      tipo: 'nueva_reserva',
      descripcion: 'Nueva reserva creada',
      usuario: 'lucia.martinez@email.com',
      detalles: 'Reserva para Honda Civic - 5 días'
    },
    {
      id: '6',
      fecha: '2024-01-03',
      tipo: 'nuevo_vehiculo',
      descripcion: 'Nuevo vehículo agregado',
      usuario: 'admin@alquilapp.com',
      detalles: 'Ford Focus 2023 agregado a la flota'
    },
    {
      id: '7',
      fecha: '2024-01-04',
      tipo: 'nuevo_pago',
      descripcion: 'Pago procesado',
      usuario: 'maria.gonzalez@email.com',
      detalles: 'Pago de $2500 por reserva #124'
    }
  ];

  // Resumen de ejemplo
  const resumenEjemplo: ResumenRegistros = {
    totalRegistros: 7,
    nuevosUsuarios: 2,
    nuevasReservas: 2,
    nuevosVehiculos: 1,
    nuevosPagos: 2
  };

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
      setRegistros(registrosEjemplo);
      setResumen(resumenEjemplo);
      setIsLoading(false);
    }, 1000);
  }, [router]);

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener el color del tipo de registro
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_usuario':
        return 'bg-blue-500';
      case 'nueva_reserva':
        return 'bg-green-500';
      case 'nuevo_vehiculo':
        return 'bg-purple-500';
      case 'nuevo_pago':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Función para obtener el texto del tipo de registro
  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_usuario':
        return 'Nuevo Usuario';
      case 'nueva_reserva':
        return 'Nueva Reserva';
      case 'nuevo_vehiculo':
        return 'Nuevo Vehículo';
      case 'nuevo_pago':
        return 'Nuevo Pago';
      default:
        return tipo;
    }
  };

  // Función para obtener el ícono del tipo de registro
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'nuevo_usuario':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'nueva_reserva':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'nuevo_vehiculo':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'nuevo_pago':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
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

  if (!startDate || !endDate) {
    return (
      <div className="min-h-screen bg-[#3d2342] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Fechas no especificadas</h1>
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
            <h1 className="text-4xl font-bold">Detalle de Registros</h1>
            <p className="text-[#a16bb7] text-lg mt-2">
              Período: {formatDate(startDate)} - {formatDate(endDate)}
            </p>
          </div>
        </div>

        {/* Resumen de registros */}
        {resumen && (
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-6">Resumen del Período</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#a16bb7]">{resumen.totalRegistros}</div>
                <div className="text-gray-300">Total Registros</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{resumen.nuevosUsuarios}</div>
                <div className="text-gray-300">Nuevos Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{resumen.nuevasReservas}</div>
                <div className="text-gray-300">Nuevas Reservas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{resumen.nuevosVehiculos}</div>
                <div className="text-gray-300">Nuevos Vehículos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{resumen.nuevosPagos}</div>
                <div className="text-gray-300">Nuevos Pagos</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de registros */}
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Registros del Período</h2>
          
          <div className="space-y-4">
            {registros.map((registro) => (
              <div key={registro.id} className="bg-[#3d2342] p-4 rounded-lg border-l-4 border-[#a16bb7] hover:bg-[#4a3654] transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getTipoColor(registro.tipo)}`}>
                    {getTipoIcon(registro.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{registro.descripcion}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getTipoColor(registro.tipo)}`}>
                        {getTipoText(registro.tipo)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-[#a16bb7] font-medium">Fecha: </span>
                        {formatDate(registro.fecha)}
                      </div>
                      <div>
                        <span className="text-[#a16bb7] font-medium">Usuario: </span>
                        {registro.usuario}
                      </div>
                      <div>
                        <span className="text-[#a16bb7] font-medium">Detalles: </span>
                        {registro.detalles}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {registros.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay registros para el período seleccionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 