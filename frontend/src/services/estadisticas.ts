import { apiService } from './api.service';

export interface TopVehicle {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface Alquiler {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  cliente_email: string;
  cliente_nombre: string;
  monto_total: number;
  estado_nombre: string;
  sucursal_nombre: string;
}

export interface VehiculoDetalle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  patente: string;
  total_alquileres: number;
  monto_total: number;
}

export interface AlquileresVehiculoResponse {
  vehiculo: VehiculoDetalle;
  alquileres: Alquiler[];
}

export interface UsuarioRegistro {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  fecha_registro: string;
  tipo: 'cliente' | 'empleado';
  rol: string;
}

export interface ReservaRegistro {
  id: string;
  fecha_reserva: string;
  cliente_email: string;
  cliente_nombre: string;
  vehiculo_info: string;
  monto_total: number;
  estado: string;
}

export interface EstadisticasRegistros {
  total_usuarios: number;
  total_clientes: number;
  total_empleados: number;
  total_reservas: number;
  total_registros: number;
}

export interface RegistrosPorFechaResponse {
  estadisticas: EstadisticasRegistros;
  usuarios_clientes: UsuarioRegistro[];
  usuarios_empleados: UsuarioRegistro[];
  reservas: ReservaRegistro[];
}

export interface TopUserAlquileres {
  cliente: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    // otros campos si es necesario
  };
  cantidad_alquileres: number;
}

export interface UsuarioDetalle {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  total_alquileres: number;
  monto_total: number;
}

export interface AlquileresUsuarioResponse {
  usuario: UsuarioDetalle;
  alquileres: Alquiler[];
}

export const estadisticasService = {
  async getTopVehicles(): Promise<TopVehicle[]> {
    return apiService.get<TopVehicle[]>('/estadisticas/mas_alquilado/', { requiresAuth: true });
  },

  async getAlquileresVehiculo(vehiculoId: string): Promise<AlquileresVehiculoResponse> {
    return apiService.get<AlquileresVehiculoResponse>(`/estadisticas/${vehiculoId}/alquileres-vehiculo/`, { requiresAuth: true });
  },

  async getRegistrosPorFecha(fechaInicio: string, fechaFin: string): Promise<RegistrosPorFechaResponse> {
    return apiService.post<RegistrosPorFechaResponse>('/estadisticas/registros-por-fecha/', {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }, { requiresAuth: true });
  },

  async getTopUsers(): Promise<TopUserAlquileres[]> {
    return apiService.get<TopUserAlquileres[]>('/estadisticas/clientes_con_mas_alquileres/', { requiresAuth: true });
  },

  async getAlquileresUsuario(usuarioId: string): Promise<AlquileresUsuarioResponse> {
    return apiService.get<AlquileresUsuarioResponse>(`/estadisticas/${usuarioId}/alquileres-usuario/`, { requiresAuth: true });
  }
}; 