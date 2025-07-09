'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { estadisticasService, RegistrosPorFechaResponse, UsuarioRegistro, ReservaRegistro } from '@/services/estadisticas';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
  const [datosReales, setDatosReales] = useState<RegistrosPorFechaResponse | null>(null);
  const [registrosData, setRegistrosData] = useState<{ fecha: string; registros: number }[]>([]);

  // Verificar que el usuario es admin al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    const userRoleId = Number(user?.rol);
    if (!user || userRoleId !== 3) {
      router.push('/');
      return;
    }

    // Cargar datos reales del backend
    const cargarDatos = async () => {
      if (!startDate || !endDate) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await estadisticasService.getRegistrosPorFecha(startDate, endDate);
        setDatosReales(response);
        
        // Crear resumen con datos reales
        const resumenReal: ResumenRegistros = {
          totalRegistros: response.estadisticas.total_registros,
          nuevosUsuarios: response.estadisticas.total_usuarios,
          nuevasReservas: response.estadisticas.total_reservas,
          nuevosVehiculos: 0, // No hay datos de vehículos por fecha
          nuevosPagos: 0 // No hay datos de pagos por fecha
        };
        setResumen(resumenReal);
        
        // Crear registros combinados
        const registrosCombinados: Registro[] = [];
        
        // Agregar usuarios clientes
        response.usuarios_clientes.forEach(usuario => {
          registrosCombinados.push({
            id: `usuario_${usuario.id}`,
            fecha: usuario.fecha_registro.split(' ')[0],
            tipo: 'nuevo_usuario',
            descripcion: 'Nuevo usuario registrado',
            usuario: usuario.email,
            detalles: `Cliente: ${usuario.first_name} ${usuario.last_name}`
          });
        });
        
        // Agregar usuarios empleados
        response.usuarios_empleados.forEach(usuario => {
          registrosCombinados.push({
            id: `empleado_${usuario.id}`,
            fecha: usuario.fecha_registro.split(' ')[0],
            tipo: 'nuevo_usuario',
            descripcion: 'Nuevo empleado registrado',
            usuario: usuario.email,
            detalles: `Empleado: ${usuario.first_name} ${usuario.last_name} - ${usuario.rol}`
          });
        });
        
        // Agregar reservas
        response.reservas.forEach(reserva => {
          registrosCombinados.push({
            id: `reserva_${reserva.id}`,
            fecha: reserva.fecha_reserva.split(' ')[0],
            tipo: 'nueva_reserva',
            descripcion: 'Nueva reserva creada',
            usuario: reserva.cliente_email,
            detalles: `${reserva.vehiculo_info} - $${reserva.monto_total}`
          });
        });
        
        // Ordenar por fecha
        registrosCombinados.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        setRegistros(registrosCombinados);

        // --- Agrupar para el gráfico ---
        const conteoPorFecha: Record<string, number> = {};
        // Usuarios clientes y empleados
        [...response.usuarios_clientes, ...response.usuarios_empleados].forEach(usuario => {
          const fecha = usuario.fecha_registro.split(' ')[0];
          conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;
        });
        // Reservas
        response.reservas.forEach(reserva => {
          const fecha = reserva.fecha_reserva.split(' ')[0];
          conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;
        });
        // Convertir a array ordenado para el gráfico
        const registrosDataReal = Object.entries(conteoPorFecha)
          .map(([fecha, registros]) => ({ fecha, registros }))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        setRegistrosData(registrosDataReal);
        
      } catch (error) {
        console.error('Error al cargar datos de registros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [router, startDate, endDate]);

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para formatear el monto en pesos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 01-2 2v12a2 2 0 002 2z" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="text-3xl font-bold text-purple-400">
                  {datosReales ? datosReales.estadisticas.total_clientes : 0}
                </div>
                <div className="text-gray-300">Nuevos Clientes</div>
              </div>
            </div>
            
            {/* Estadísticas adicionales */}
            {datosReales && (
              <div className="mt-6 pt-6 border-t border-[#4a3654]">
                {/* Calcular total y promedio de reservas de forma segura */}
                {(() => {
                  const montos = datosReales.reservas.map(r => Number(r.monto_total) || 0);
                  const totalReservas = montos.reduce((sum, val) => sum + val, 0);
                  const promedioReservas = montos.length > 0 ? totalReservas / montos.length : 0;
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">
                          {datosReales.estadisticas.total_empleados}
                        </div>
                        <div className="text-gray-300">Nuevos Empleados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">
                          {formatCurrency(totalReservas)}
                        </div>
                        <div className="text-gray-300">Total Reservas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-400">
                          {formatCurrency(promedioReservas)}
                        </div>
                        <div className="text-gray-300">Promedio por Reserva</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Sección de Usuarios */}
        {datosReales && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Usuarios Clientes */}
            <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-blue-400">Nuevos Clientes</h2>
              
              <div className="space-y-4">
                {datosReales.usuarios_clientes.map((usuario) => (
                  <div key={usuario.id} className="bg-[#3d2342] p-4 rounded-lg border-l-4 border-blue-400 hover:bg-[#4a3654] transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{usuario.first_name} {usuario.last_name}</h3>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-500">
                            Cliente
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                          <div>
                            <span className="text-[#a16bb7] font-medium">Email: </span>
                            {usuario.email}
                          </div>
                          <div>
                            <span className="text-[#a16bb7] font-medium">Fecha Registro: </span>
                            {formatDate(usuario.fecha_registro)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {datosReales.usuarios_clientes.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No hay nuevos clientes en este período.
                </div>
              )}
            </div>

            {/* Usuarios Empleados */}
            <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-orange-400">Nuevos Empleados</h2>
              
              <div className="space-y-4">
                {datosReales.usuarios_empleados.map((usuario) => (
                  <div key={usuario.id} className="bg-[#3d2342] p-4 rounded-lg border-l-4 border-orange-400 hover:bg-[#4a3654] transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-lg bg-orange-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{usuario.first_name} {usuario.last_name}</h3>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-orange-500">
                            {usuario.rol}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
                          <div>
                            <span className="text-[#a16bb7] font-medium">Email: </span>
                            {usuario.email}
                          </div>
                          <div>
                            <span className="text-[#a16bb7] font-medium">Fecha Registro: </span>
                            {formatDate(usuario.fecha_registro)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {datosReales.usuarios_empleados.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No hay nuevos empleados en este período.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección de Reservas */}
        {datosReales && (
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-green-400">Nuevas Reservas</h2>
            
            <div className="space-y-4">
              {datosReales.reservas.map((reserva) => (
                <div key={reserva.id} className="bg-[#3d2342] p-4 rounded-lg border-l-4 border-green-400 hover:bg-[#4a3654] transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-green-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 01-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{reserva.cliente_nombre}</h3>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-500">
                          Reserva
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                        <div>
                          <span className="text-[#a16bb7] font-medium">Vehículo: </span>
                          {reserva.vehiculo_info}
                        </div>
                        <div>
                          <span className="text-[#a16bb7] font-medium">Fecha: </span>
                          {formatDate(reserva.fecha_reserva)}
                        </div>
                        <div>
                          <span className="text-[#a16bb7] font-medium">Monto: </span>
                          <span className="text-green-400 font-semibold">{formatCurrency(reserva.monto_total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {datosReales.reservas.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No hay nuevas reservas en este período.
              </div>
            )}
          </div>
        )}

        {/* Lista combinada de registros (mantener para compatibilidad) */}
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold mb-6">Todos los Registros</h2>
          
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

        {/* Gráfico de evolución de registros */}
        {registrosData.length > 0 && (
          <div className="bg-[#3d2342] p-4 rounded-lg mt-8">
            <h3 className="text-lg font-medium mb-4 text-[#a16bb7]">Evolución de Registros</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={registrosData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4a3654" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fill: '#a16bb7', dy: 10 }}
                    axisLine={{ stroke: '#4a3654' }}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    tick={{ fill: '#a16bb7' }}
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
                  <Area
                    type="monotone"
                    dataKey="registros"
                    stroke="#a16bb7"
                    fill="#a16bb7"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 