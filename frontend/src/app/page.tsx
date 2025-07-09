'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { getCurrentUser, logout } from '@/services/auth';
import { useRouter } from 'next/navigation';
// import { getCategories, type Category } from '@/services/categories';
import { getAlquilerById, registrarAlquilerParaCliente, cancelarAlquilerParaCliente, retirarVehiculo, registrarDevolucion, getReservaYCliente } from '@/services/alquiler';
import { getAuthToken } from '@/services/auth';
import { API_BASE_URL } from '@/config/config';
import 'leaflet/dist/leaflet.css';
import AgregarVehiculoForm from '@/components/vehicles/AgregarVehiculoForm';
import EditarVehiculoForm from '@/components/vehicles/EditarVehiculoForm';
import ConfirmarEliminarVehiculo from '@/components/vehicles/ConfirmarEliminarVehiculo';
import { buscarVehiculoPorPatente, type Vehiculo } from '@/services/vehiculos';
import { Model } from '@/types/models';
import DatePicker from '@/components/DatePicker';
import { searchUsersByEmail, registerClient, deleteUser, getAllUsers, type User, type CreateUserData } from '@/services/users';

const CategoryList = dynamic(() => import('@/components/CategoryList'), { ssr: false });

interface UserState {
  isAuthenticated: boolean;
  role: number | null;
  username: string | null;
}

interface RetiroReserva {
  id: number;
  cliente?: { nombre?: string; apellido?: string; email?: string };
  vehiculo?: {
    marca?: { nombre?: string };
    modelo?: { nombre?: string };
    patente?: string;
  };
  fecha_inicio?: string;
  fecha_fin?: string;
}

// MOCK DATA para sucursales, categorías y modelos
const mockSucursales = [
  { id: 1, nombre: 'Sucursal Centro' },
  { id: 2, nombre: 'Sucursal Norte' },
];
const mockModelosPorCategoria: { [categoriaId: number]: { id: number; nombre: string; precio_por_dia: number; categoria_nombre: string }[] } = {
  1: [
    { id: 101, nombre: 'Toyota Etios', precio_por_dia: 10000, categoria_nombre: 'Económico' },
    { id: 102, nombre: 'Fiat Mobi', precio_por_dia: 9500, categoria_nombre: 'Económico' },
  ],
  2: [
    { id: 201, nombre: 'Toyota SW4', precio_por_dia: 20000, categoria_nombre: 'SUV' },
    { id: 202, nombre: 'Jeep Compass', precio_por_dia: 18000, categoria_nombre: 'SUV' },
  ],
  3: [
    { id: 301, nombre: 'Ford Mustang', precio_por_dia: 30000, categoria_nombre: 'Premium' },
    { id: 302, nombre: 'Chevrolet Camaro', precio_por_dia: 32000, categoria_nombre: 'Premium' },
  ],
  4: [
    { id: 401, nombre: 'Renault Kangoo', precio_por_dia: 15000, categoria_nombre: 'Utilitario' },
    { id: 402, nombre: 'Peugeot Partner', precio_por_dia: 14500, categoria_nombre: 'Utilitario' },
  ],
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [userState, setUserState] = useState<UserState>({
    isAuthenticated: false,
    role: null,
    username: null
  });
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [reservaEmail, setReservaEmail] = useState('');
  const [reservaCategoria, setReservaCategoria] = useState<number | null>(null);
  const [reservaFechaRetiro, setReservaFechaRetiro] = useState<Date | null>(null);
  const [reservaFechaDevolucion, setReservaFechaDevolucion] = useState<Date | null>(null);
  const [reservaModelos, setReservaModelos] = useState<Model[]>([]);
  const [reservaError, setReservaError] = useState<string | null>(null);
  const [reservaLoading, setReservaLoading] = useState(false);
  const [showRetiroModal, setShowRetiroModal] = useState(false);
  const [retiroReservaId, setRetiroReservaId] = useState('');
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [showRegistrarUsuarioModal, setShowRegistrarUsuarioModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState<CreateUserData>({
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    fecha_nacimiento: '',
    rol: 1 // Cliente por defecto
  });
  const [registrarUsuarioLoading, setRegistrarUsuarioLoading] = useState(false);
  const [registrarUsuarioError, setRegistrarUsuarioError] = useState<string | null>(null);
  const [registrarUsuarioSuccess, setRegistrarUsuarioSuccess] = useState(false);
  const [passwordGenerada, setPasswordGenerada] = useState<string>('');
  const [cancelarReservaId, setCancelarReservaId] = useState('');
  const [cancelarLoading, setCancelarLoading] = useState(false);
  const [cancelarError, setCancelarError] = useState<string | null>(null);
  const [cancelarConfirmado, setCancelarConfirmado] = useState(false);
  const [retiroReserva, setRetiroReserva] = useState<RetiroReserva | null>(null);
  const [retiroLoading, setRetiroLoading] = useState(false);
  const [retiroError, setRetiroError] = useState<string | null>(null);
  const [retiroConfirmado, setRetiroConfirmado] = useState(false);
  const [vehiculoPatente, setVehiculoPatente] = useState('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [vehiculoError, setVehiculoError] = useState<string | null>(null);
  const [vehiculoLoading, setVehiculoLoading] = useState(false);
  const [showAddVehiculoForm, setShowAddVehiculoForm] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState<Vehiculo | null>(null);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<Vehiculo | null>(null);
  const [sucursales, setSucursales] = useState<{ id: number; nombre: string }[]>([]);
  const [reservaSucursalRetiro, setReservaSucursalRetiro] = useState<number | null>(null);
  const [reservaSucursalDevolucion, setReservaSucursalDevolucion] = useState<number | null>(null);
  const [reservaCategoriasSucursal, setReservaCategoriasSucursal] = useState<{ id: number; nombre: string }[]>([]);
  const [reservaModelosSucursal, setReservaModelosSucursal] = useState<Model[]>([]);
  const [reservaModelo, setReservaModelo] = useState<number | null>(null);
  const [emailValido, setEmailValido] = useState<null | boolean>(null);
  const [modelosDisponibles, setModelosDisponibles] = useState<{ id: number; nombre: string; precio_por_dia: number; categoria_nombre: string }[]>([]);
  const [mostrarModelos, setMostrarModelos] = useState(false);
  const [montoACobrar, setMontoACobrar] = useState<number | null>(null);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [devolucionReservaId, setDevolucionReservaId] = useState('');
  const [devolucionReserva, setDevolucionReserva] = useState<RetiroReserva | null>(null);
  const [devolucionLoading, setDevolucionLoading] = useState(false);
  const [devolucionError, setDevolucionError] = useState<string | null>(null);
  const [devolucionConfirmado, setDevolucionConfirmado] = useState(false);
  const [cancelarReservaInfo, setCancelarReservaInfo] = useState<RetiroReserva | null>(null);
  const [cancelarReservaLoading, setCancelarReservaLoading] = useState(false);
  const [cancelarReservaError, setCancelarReservaError] = useState<string | null>(null);
  const [cancelarReservaConfirmado, setCancelarReservaConfirmado] = useState(false);
  
  // Variables de estado para registro de alquiler
  const [registrarClienteEmail, setRegistrarClienteEmail] = useState('');
  const [registrarModeloId, setRegistrarModeloId] = useState('');
  const [registrarSucursalRetiro, setRegistrarSucursalRetiro] = useState('');
  const [registrarSucursalDevolucion, setRegistrarSucursalDevolucion] = useState('');
  const [registrarFechaInicio, setRegistrarFechaInicio] = useState('');
  const [registrarFechaFin, setRegistrarFechaFin] = useState('');
  const [registrarError, setRegistrarError] = useState<string | null>(null);
  const [registrarLoading, setRegistrarLoading] = useState(false);
  const [registrarConfirmado, setRegistrarConfirmado] = useState(false);
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);
  // Estado para validación de email en el modal de registrar alquiler para cliente
  const [registrarEmailValido, setRegistrarEmailValido] = useState<null | boolean>(null);
  // Estado para categoría seleccionada en el modal de registrar alquiler para cliente
  const [registrarCategoria, setRegistrarCategoria] = useState<number | null>(null);
  const [registrarCategoriasSucursal, setRegistrarCategoriasSucursal] = useState<{ id: number; nombre: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserState({
        isAuthenticated: true,
        role: Number(user.rol),
        username: user.nombre
      });
    }
  }, []);

  const handleLoginSuccess = () => {
    const user = getCurrentUser();
    if (user) {
      setUserState({
        isAuthenticated: true,
        role: Number(user.rol),
        username: user.nombre
      });
      setShowLoginForm(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserState({
      isAuthenticated: false,
      role: null,
      username: null
    });
  };

  // Manejador del registro exitoso
  const handleRegisterSuccess = () => {
    setShowRegisterForm(false);
  };

  // Función para mostrar el formulario de login
  const handleShowLogin = () => {
    setShowLoginForm(true);
  };

  // Función para renderizar botones específicos según el rol
  const renderRoleSpecificButtons = () => {
    if (!userState.isAuthenticated) return null;

    switch (userState.role) {
      case 3: // ID del rol admin
        return (
          <>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/admin')}
            >
              Panel de Administración
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/admin/usuarios')}
            >
              Gestionar Usuarios
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/admin/reportes')}
            >
              Reportes
            </button>
          </>
        );
      case 2: // ID del rol empleado
        return (
          <>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/empleado/registrar-alquiler')}
            >
              Registrar Alquiler
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/empleado/vehiculos')}
            >
              Gestión de Vehículos
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/empleado/usuarios')}
            >
              Gestión de Usuarios
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => router.push('/empleado/reservas')}
            >
              Gestión de Reservas
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // Cargar todos los usuarios al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      if (userState.isAuthenticated && userState.role && [2, 3].includes(userState.role)) {
        setUsersLoading(true);
        try {
          const users = await getAllUsers();
          setAllUsers(users);
        } catch (error) {
          console.error('Error al cargar usuarios:', error);
        } finally {
          setUsersLoading(false);
        }
      }
    };

    loadUsers();
  }, [userState.isAuthenticated, userState.role]);

  // Actualizar la búsqueda para que filtre localmente
  useEffect(() => {
    if (searchEmail.trim()) {
      const filtered = allUsers.filter(user =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchEmail.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchEmail.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchEmail, allUsers]);

  const handleSearchEmail = (email: string) => {
    setSearchEmail(email);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      // Actualizar la lista de resultados
      setSearchResults(prev => prev.filter(user => user.id !== userId));
      // Actualizar también la lista completa de usuarios
      setAllUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Limpiar campos al abrir el modal, pero sin fetch ni sobrescribir categorías
  useEffect(() => {
    if (showReservaModal) {
      setReservaEmail('');
      setReservaCategoria(null);
      setReservaFechaRetiro(null);
      setReservaFechaDevolucion(null);
      setReservaModelos([]);
      setReservaError(null);
    }
  }, [showReservaModal]);

  // Limpiar fecha de devolución si la fecha de retiro cambia a una posterior
  useEffect(() => {
    if (reservaFechaRetiro && reservaFechaDevolucion && reservaFechaDevolucion < reservaFechaRetiro) {
      setReservaFechaDevolucion(null);
    }
  }, [reservaFechaRetiro]);

  const handleBuscarModelos = () => {
    setReservaError(null);
    setMostrarModelos(false);
    setMontoACobrar(null);
    if (!reservaCategoria || !reservaSucursalRetiro || !reservaFechaRetiro || !reservaFechaDevolucion) {
      setReservaError('Completa todos los campos para buscar modelos disponibles.');
      return;
    }
    // Simular modelos disponibles según la categoría
    setTimeout(() => {
      setModelosDisponibles(mockModelosPorCategoria[reservaCategoria] || []);
      setMostrarModelos(true);
    }, 500);
  };

  const handleBuscarReserva = async () => {
    setRetiroError(null);
    setRetiroReserva(null);
    setRetiroConfirmado(false);
    if (!retiroReservaId) {
      setRetiroError('Ingrese el número de reserva');
      return;
    }
    setRetiroLoading(true);
    try {
      const reservaData = await getReservaYCliente(Number(retiroReservaId));
      setRetiroReserva({
        id: reservaData.reserva.id,
        cliente: {
          nombre: reservaData.cliente.first_name,
          apellido: reservaData.cliente.last_name,
          email: reservaData.cliente.email
        },
        vehiculo: {
          marca: { nombre: reservaData.reserva.vehiculo.marca.nombre },
          modelo: { nombre: reservaData.reserva.vehiculo.modelo.nombre },
          patente: reservaData.reserva.vehiculo.patente
        },
        fecha_inicio: reservaData.reserva.fecha_inicio,
        fecha_fin: reservaData.reserva.fecha_fin
      });
    } catch (error) {
      setRetiroError(error instanceof Error ? error.message : 'Reserva no encontrada');
    } finally {
      setRetiroLoading(false);
    }
  };

  const handleConfirmarRetiro = async () => {
    if (!retiroReserva) return;
    
    try {
      await retirarVehiculo(retiroReserva.id);
      setRetiroConfirmado(true);
      setTimeout(() => {
        setShowRetiroModal(false);
        setRetiroConfirmado(false);
        setRetiroReservaId('');
        setRetiroReserva(null);
      }, 1500);
    } catch (error) {
      setRetiroError(error instanceof Error ? error.message : 'Error al confirmar retiro');
    }
  };

  const handleCancelarReserva = async () => {
    setCancelarError(null);
    if (!cancelarReservaId) {
      setCancelarError('Ingresa el número de reserva');
      return;
    }
    setCancelarLoading(true);
    try {
      await cancelarAlquilerParaCliente(Number(cancelarReservaId));
      setCancelarConfirmado(true);
      // Limpiar formulario y cerrar modal después de 1.5 segundos
      setTimeout(() => {
        setShowCancelarModal(false);
        setCancelarConfirmado(false);
        setCancelarReservaId('');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setCancelarError(error instanceof Error ? error.message : 'Error al cancelar la reserva');
    } finally {
      setCancelarLoading(false);
    }
  };

  const handleRegistrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrarUsuarioLoading(true);
    setRegistrarUsuarioError(null);
    setRegistrarUsuarioSuccess(false);
    setPasswordGenerada('');

    try {
      // Registrar usuario usando el endpoint real
      const result = await registerClient(nuevoUsuario);
      
      setRegistrarUsuarioSuccess(true);
      setPasswordGenerada(result.password_generada);
      
      // Agregar el nuevo usuario a la lista de resultados
      setSearchResults(prev => [...prev, result.usuario]);
      // Actualizar también la lista completa de usuarios
      setAllUsers(prev => [...prev, result.usuario]);
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setShowRegistrarUsuarioModal(false);
        setRegistrarUsuarioSuccess(false);
        setPasswordGenerada('');
        setNuevoUsuario({
          email: '',
          first_name: '',
          last_name: '',
          telefono: '',
          fecha_nacimiento: '',
          rol: 1 // Cliente por defecto
        });
      }, 3000);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setRegistrarUsuarioError(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setRegistrarUsuarioLoading(false);
    }
  };

  const handleVehiculoSearch = async () => {
    if (!vehiculoPatente.trim()) {
      setVehiculoError('Ingrese una patente para buscar');
      return;
    }
    setVehiculoLoading(true);
    setVehiculoError(null);
    try {
      const resultados = await buscarVehiculoPorPatente(vehiculoPatente);
      setVehiculos(resultados);
      if (resultados.length === 0) {
        setVehiculoError('No se encontraron vehículos con esa patente');
      }
    } catch (error) {
      setVehiculoError('Error al buscar vehículo. Por favor, intente nuevamente.');
      console.error('Error al buscar vehículo:', error);
    } finally {
      setVehiculoLoading(false);
    }
  };

  const handleVehiculoAdd = () => setShowAddVehiculoForm(true);

  const handleVehiculoCreado = () => {
    setShowAddVehiculoForm(false);
    if (vehiculoPatente.trim()) handleVehiculoSearch();
  };

  const handleVehiculoEdit = (vehiculo: Vehiculo) => setVehiculoAEditar(vehiculo);

  const handleVehiculoEditado = () => {
    setVehiculoAEditar(null);
    if (vehiculoPatente.trim()) handleVehiculoSearch();
  };

  const handleVehiculoDelete = (vehiculo: Vehiculo) => setVehiculoAEliminar(vehiculo);

  const confirmarEliminarVehiculo = async () => {
    if (!vehiculoAEliminar) return;
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No autorizado');
      const response = await fetch(`http://localhost:8000/api/vehiculos/${vehiculoAEliminar.id}/baja/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.error) throw new Error(errorData.error);
        throw new Error('Error al eliminar el vehículo');
      }
      setVehiculos(vehiculos.filter(v => v.id !== vehiculoAEliminar.id));
      setVehiculoAEliminar(null);
    } catch (error) {
      setVehiculoError(error instanceof Error ? error.message : 'Error al eliminar el vehículo. Por favor, intente nuevamente.');
    }
  };

  useEffect(() => {
    if (vehiculoPatente.trim() !== '') {
      handleVehiculoSearch();
    } else {
      setVehiculos([]);
      setVehiculoError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculoPatente]);

  // Limpiar campos al abrir el modal, pero sin fetch ni sobrescribir sucursales
  useEffect(() => {
    if (showReservaModal) {
      setReservaSucursalRetiro(null);
      setReservaSucursalDevolucion(null);
      setReservaCategoriasSucursal([]);
      setReservaCategoria(null);
      setReservaModelosSucursal([]);
      setReservaModelo(null);
      setReservaEmail('');
      setEmailValido(null);
      setReservaFechaRetiro(null);
      setReservaFechaDevolucion(null);
      setReservaError(null);
    }
  }, [showReservaModal]);

  // Validar email al salir del campo
  const handleEmailBlur = async () => {
    if (!reservaEmail) return;
    setEmailValido(true);
  };

  // Cargar categorías disponibles en la sucursal de retiro
  useEffect(() => {
    if (reservaSucursalRetiro) {
      setReservaCategoria(null);
    } else {
      setReservaCategoriasSucursal([]);
      setReservaCategoria(null);
    }
  }, [reservaSucursalRetiro]);

  // Mostrar modelos automáticamente cuando todos los campos estén completos
  useEffect(() => {
    if (reservaCategoria && reservaSucursalRetiro && reservaFechaRetiro && reservaFechaDevolucion) {
      setReservaError(null);
      setMostrarModelos(false);
      setMontoACobrar(null);
      setTimeout(() => {
        setModelosDisponibles(mockModelosPorCategoria[reservaCategoria] || []);
        setMostrarModelos(true);
      }, 500);
    } else {
      setMostrarModelos(false);
    }
  }, [reservaCategoria, reservaSucursalRetiro, reservaFechaRetiro, reservaFechaDevolucion]);

  // Calcular monto al elegir modelo
  useEffect(() => {
    if (reservaModelo && modelosDisponibles.length > 0 && reservaFechaRetiro && reservaFechaDevolucion) {
      const modelo = modelosDisponibles.find(m => m.id === reservaModelo);
      if (modelo) {
        const dias = Math.ceil((reservaFechaDevolucion.getTime() - reservaFechaRetiro.getTime()) / (1000 * 60 * 60 * 24));
        setMontoACobrar(dias * modelo.precio_por_dia);
      } else {
        setMontoACobrar(null);
      }
    } else {
      setMontoACobrar(null);
    }
  }, [reservaModelo, modelosDisponibles, reservaFechaRetiro, reservaFechaDevolucion]);

  // Función mock para buscar reserva (reutilizable)
  const buscarReservaMock = async (id: string) => {
    // Simula búsqueda y retardo
    await new Promise(res => setTimeout(res, 1000));
    if (!id) throw new Error('Ingrese el número de reserva');
    return {
      id: Number(id),
      cliente: { nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com' },
      vehiculo: { marca: { nombre: 'Toyota' }, modelo: { nombre: 'Corolla' }, patente: 'ABC123' },
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  // Handlers para devolución
  const handleBuscarDevolucion = async () => {
    setDevolucionError(null);
    setDevolucionReserva(null);
    setDevolucionConfirmado(false);
    if (!devolucionReservaId) {
      setDevolucionError('Ingrese el número de reserva');
      return;
    }
    setDevolucionLoading(true);
    try {
      const reservaData = await getReservaYCliente(Number(devolucionReservaId));
      setDevolucionReserva({
        id: reservaData.reserva.id,
        cliente: {
          nombre: reservaData.cliente.first_name,
          apellido: reservaData.cliente.last_name,
          email: reservaData.cliente.email
        },
        vehiculo: {
          marca: { nombre: reservaData.reserva.vehiculo.marca.nombre },
          modelo: { nombre: reservaData.reserva.vehiculo.modelo.nombre },
          patente: reservaData.reserva.vehiculo.patente
        },
        fecha_inicio: reservaData.reserva.fecha_inicio,
        fecha_fin: reservaData.reserva.fecha_fin
      });
    } catch (error) {
      setDevolucionError(error instanceof Error ? error.message : 'Reserva no encontrada');
    } finally {
      setDevolucionLoading(false);
    }
  };

  const handleConfirmarDevolucion = async () => {
    if (!devolucionReserva) return;
    
    try {
      await registrarDevolucion(devolucionReserva.id);
      setDevolucionConfirmado(true);
      setTimeout(() => {
        setShowDevolucionModal(false);
        setDevolucionConfirmado(false);
        setDevolucionReservaId('');
        setDevolucionReserva(null);
      }, 1500);
    } catch (error) {
      setDevolucionError(error instanceof Error ? error.message : 'Error al confirmar devolución');
    }
  };

  // Handlers para cancelar (mostrar info antes de confirmar)
  const handleBuscarCancelar = async () => {
    setCancelarReservaError(null);
    setCancelarReservaInfo(null);
    setCancelarReservaConfirmado(false);
    if (!cancelarReservaId) {
      setCancelarReservaError('Ingrese el número de reserva');
      return;
    }
    setCancelarReservaLoading(true);
    try {
      // Usar el endpoint real para buscar la reserva
      const reservaData = await getReservaYCliente(Number(cancelarReservaId));
      setCancelarReservaInfo({
        id: reservaData.reserva.id,
        cliente: {
          nombre: reservaData.cliente.first_name,
          apellido: reservaData.cliente.last_name,
          email: reservaData.cliente.email
        },
        vehiculo: {
          marca: { nombre: reservaData.reserva.vehiculo.marca.nombre },
          modelo: { nombre: reservaData.reserva.vehiculo.modelo.nombre },
          patente: reservaData.reserva.vehiculo.patente
        },
        fecha_inicio: reservaData.reserva.fecha_inicio,
        fecha_fin: reservaData.reserva.fecha_fin
      });
    } catch (e: any) {
      setCancelarReservaError(e.message || 'Reserva no encontrada');
    } finally {
      setCancelarReservaLoading(false);
    }
  };
  const handleConfirmarCancelar = async () => {
    if (!cancelarReservaInfo) return;
    setCancelarReservaLoading(true);
    setCancelarReservaError(null);
    try {
      await cancelarAlquilerParaCliente(cancelarReservaInfo.id);
      setCancelarReservaConfirmado(true);
      setTimeout(() => {
        setShowCancelarModal(false);
        setCancelarReservaConfirmado(false);
        setCancelarReservaId('');
        setCancelarReservaInfo(null);
      }, 1500);
    } catch (error) {
      setCancelarReservaError(error instanceof Error ? error.message : 'Error al cancelar la reserva');
    } finally {
      setCancelarReservaLoading(false);
    }
  };

  // 1. Agregar función para calcular monto total
  const calcularMontoReserva = (reserva: RetiroReserva) => {
    if (!reserva.fecha_inicio || !reserva.fecha_fin || !reserva.vehiculo?.modelo?.nombre) return null;
    // Mock precios por modelo
    const precios: Record<string, number> = {
      'Corolla': 20000,
      'Etios': 10000,
      'Mobi': 9500,
      'SW4': 20000,
      'Compass': 18000,
      'Mustang': 30000,
      'Camaro': 32000,
      'Kangoo': 15000,
      'Partner': 14500
    };
    const precio = precios[reserva.vehiculo.modelo.nombre] || 10000;
    const dias = Math.ceil((new Date(reserva.fecha_fin).getTime() - new Date(reserva.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24));
    return dias * precio;
  };

  const handleRegistrarAlquiler = async () => {
    setRegistrarError(null);
    if (!registrarClienteEmail || !registrarModeloId || !registrarSucursalRetiro || !registrarSucursalDevolucion || !registrarFechaInicio || !registrarFechaFin) {
      setRegistrarError('Todos los campos son obligatorios');
      return;
    }
    setRegistrarLoading(true);
    try {
      await registrarAlquilerParaCliente({
        cliente_email: registrarClienteEmail,
        modelo_id: Number(registrarModeloId),
        sucursal_retiro: Number(registrarSucursalRetiro),
        sucursal_devolucion: Number(registrarSucursalDevolucion),
        fecha_inicio: registrarFechaInicio,
        fecha_fin: registrarFechaFin
      });
      setRegistrarConfirmado(true);
      // Limpiar formulario y cerrar modal después de 1.5 segundos
      setTimeout(() => {
        setShowRegistrarModal(false);
        setRegistrarConfirmado(false);
        setRegistrarClienteEmail('');
        setRegistrarModeloId('');
        setRegistrarSucursalRetiro('');
        setRegistrarSucursalDevolucion('');
        setRegistrarFechaInicio('');
        setRegistrarFechaFin('');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setRegistrarError(error instanceof Error ? error.message : 'Error al registrar el alquiler');
    } finally {
      setRegistrarLoading(false);
    }
  };

  // Cargar modelos disponibles
  const cargarModelosDisponibles = async () => {
    console.log('Ejecutando cargarModelosDisponibles');
    try {
      if (!reservaSucursalRetiro) {
        setModelosDisponibles([]);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/vehiculos/`);
      if (!response.ok) {
        throw new Error('Error al cargar vehículos');
      }
      const autos = await response.json();
      console.log('Todos los autos:', autos);
      // Filtrar autos por sucursal seleccionada
      const autosFiltrados = autos.filter((auto: any) => auto.sucursal?.id === Number(reservaSucursalRetiro));
      console.log('Autos filtrados por sucursal:', autosFiltrados);
      // Mapear a modelos
      const modelos = autosFiltrados.map((auto: any) => auto.modelo);
      console.log('Modelos de autos filtrados:', modelos);
      // Eliminar modelos duplicados por id
      const modelosUnicos = modelos.filter((modelo: any, idx: number, arr: any[]) =>
        arr.findIndex((m) => m.id === modelo.id) === idx
      );
      console.log('Modelos únicos:', modelosUnicos);
      setModelosDisponibles(modelosUnicos);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      setModelosDisponibles([]);
    }
  };

  useEffect(() => {
    console.log('useEffect de modelos: showRegistrarModal', showRegistrarModal, 'reservaSucursalRetiro', reservaSucursalRetiro);
    if (showRegistrarModal && reservaSucursalRetiro) {
      cargarModelosDisponibles();
    } else {
      setModelosDisponibles([]);
    }
  }, [showRegistrarModal, reservaSucursalRetiro]);

  // Cargar sucursales reales
  const cargarSucursales = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sucursales/`);
      if (!response.ok) {
        throw new Error('Error al cargar sucursales');
      }
      const data = await response.json();
      setSucursales(data);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    }
  };

  // Cargar sucursales cuando se abre el modal de registrar alquiler
  useEffect(() => {
    if (showRegistrarModal) {
      cargarSucursales();
    }
  }, [showRegistrarModal]);

  useEffect(() => {
    if (!showCancelarModal) {
      setCancelarReservaId('');
      setCancelarReservaInfo(null);
      setCancelarReservaError(null);
      setCancelarReservaConfirmado(false);
      setCancelarReservaLoading(false);
    }
  }, [showCancelarModal]);

  // Cargar modelos cuando se selecciona una sucursal de retiro
  useEffect(() => {
    if (reservaSucursalRetiro) {
      cargarModelosDisponibles();
    } else {
      setModelosDisponibles([]);
    }
  }, [reservaSucursalRetiro]);

  // Limpiar modelos y sucursal al cerrar el modal
  useEffect(() => {
    if (!showRegistrarModal) {
      setModelosDisponibles([]);
      setReservaSucursalRetiro(null);
    }
  }, [showRegistrarModal]);

  // Cargar modelos cuando se selecciona una sucursal de retiro en el modal de registrar alquiler para cliente
  useEffect(() => {
    if (registrarSucursalRetiro) {
      cargarModelosDisponiblesCliente();
    } else {
      setModelosDisponibles([]);
    }
  }, [registrarSucursalRetiro]);

  // Limpiar modelos y sucursal al cerrar el modal de registrar alquiler para cliente
  useEffect(() => {
    if (!showRegistrarModal) {
      setModelosDisponibles([]);
      setRegistrarSucursalRetiro('');
    }
  }, [showRegistrarModal]);

  // Nueva función para cargar modelos en el flujo de registrar alquiler para cliente
  const cargarModelosDisponiblesCliente = async () => {
    console.log('Ejecutando cargarModelosDisponiblesCliente');
    try {
      if (!registrarSucursalRetiro) {
        setModelosDisponibles([]);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/vehiculos/`);
      if (!response.ok) {
        throw new Error('Error al cargar vehículos');
      }
      const autos = await response.json();
      console.log('Todos los autos:', autos);
      // Filtrar autos por sucursal seleccionada
      const autosFiltrados = autos.filter((auto: any) => auto.sucursal?.id === Number(registrarSucursalRetiro));
      console.log('Autos filtrados por sucursal:', autosFiltrados);
      // Mapear a modelos
      const modelos = autosFiltrados.map((auto: any) => ({
        id: auto.modelo.id,
        nombre: auto.modelo.nombre,
        precio_por_dia: auto.categoria?.precio
      }));
      console.log('Modelos de autos filtrados:', modelos);
      // Eliminar modelos duplicados por id
      const modelosUnicos = modelos.filter((modelo: any, idx: number, arr: any[]) =>
        arr.findIndex((m) => m.id === modelo.id) === idx
      );
      console.log('Modelos únicos:', modelosUnicos);
      setModelosDisponibles(modelosUnicos);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      setModelosDisponibles([]);
    }
  };

  // Función para validar email al salir del campo en el modal de registrar alquiler para cliente
  const handleRegistrarEmailBlur = async () => {
    if (!registrarClienteEmail) return;
    try {
      const users = await searchUsersByEmail(registrarClienteEmail);
      setRegistrarEmailValido(
        Array.isArray(users) && users.some(u => u.email.toLowerCase() === registrarClienteEmail.toLowerCase())
      );
    } catch (error) {
      setRegistrarEmailValido(false);
    }
  };

  // Cargar categorías disponibles cuando se selecciona sucursal de retiro
  useEffect(() => {
    if (registrarSucursalRetiro) {
      setRegistrarCategoria(null);
    } else {
      setRegistrarCategoriasSucursal([]);
      setRegistrarCategoria(null);
    }
  }, [registrarSucursalRetiro]);

  // Filtrar modelos disponibles cuando cambia la categoría o la sucursal en el modal de registrar alquiler para cliente
  useEffect(() => {
    const fetchModelos = async () => {
      if (registrarSucursalRetiro && registrarCategoria) {
        const autosSucursal = await fetch(`${API_BASE_URL}/api/vehiculos/`).then(res => res.json());
        // Filtrar autos por sucursal y categoría
        const autosFiltrados = autosSucursal.filter((auto: any) =>
          auto.sucursal?.id === Number(registrarSucursalRetiro) &&
          auto.categoria?.id === registrarCategoria
        );
        // Mapear a modelos únicos incluyendo el precio
        const modelos = autosFiltrados.map((auto: any) => ({
          id: auto.modelo.id,
          nombre: auto.modelo.nombre,
          precio_por_dia: auto.categoria?.precio
        }));
        const modelosUnicos = modelos.filter((modelo: any, idx: number, arr: any[]) =>
          arr.findIndex((m) => m.id === modelo.id) === idx
        );
        setModelosDisponibles(modelosUnicos);
      } else {
        setModelosDisponibles([]);
      }
    };
    fetchModelos();
  }, [registrarSucursalRetiro, registrarCategoria]);

  const EXTRA_SUCURSAL = 7500;
  // Calcular monto total y extra cuando se selecciona modelo, fechas y sucursales
  const calcularMontoTotal = () => {
    if (!registrarModeloId || !registrarFechaInicio || !registrarFechaFin) return null;
    const modelo = modelosDisponibles.find(m => String(m.id) === String(registrarModeloId));
    if (!modelo) return null;
    const dias = Math.ceil((new Date(registrarFechaFin).getTime() - new Date(registrarFechaInicio).getTime()) / (1000 * 60 * 60 * 24));
    if (dias <= 0) return null;
    const montoBase = dias * Number(modelo.precio_por_dia);
    const extra = registrarSucursalRetiro && registrarSucursalDevolucion && registrarSucursalRetiro !== registrarSucursalDevolucion ? EXTRA_SUCURSAL : 0;
    return { montoBase, extra, total: montoBase + extra };
  };

  return (
    <div className="min-h-screen bg-[#5e3e5a]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-[#4c3246] relative z-40">
        {/* Logo flotante */}
        <div className="absolute left-8 -bottom-24 z-50 bg-transparent">
          <Image 
            src="/Icono_AlquilappCar.png" 
            alt="Logo de AlquilappCar - Servicio de alquiler de vehículos" 
            width={200} 
            height={200}
            priority
          />
        </div>
        {/* Espacio para que el logo no tape el header */}
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          {/* Información del usuario y botones de autenticación */}
          {!userState.isAuthenticated ? (
            <>
              <button 
                className="bg-[#e94b5a] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#b13e4a] transition-colors"
                onClick={() => setShowLoginForm(true)}
              >
                Iniciar sesión
              </button>
              <button 
                className="text-white px-4 py-2 rounded-md font-semibold hover:text-[#e94b5a] transition-colors border border-transparent hover:border-[#e94b5a]"
                onClick={() => setShowRegisterForm(true)}
              >
                Registrate
              </button>
            </>
          ) : (
            <>
              <span className="text-white">
                Bienvenido, {userState.username}
                {userState.role === 3 && ' (Administrador)'}
              </span>
              <button 
                className="bg-[#e94b5a] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#b13e4a] transition-colors"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          )}
          {/* Botón menú hamburguesa */}
          <button 
            className="p-2 rounded-md hover:bg-[#a16bb7] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e94b5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Pop-up de inicio de sesión */}
      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} onLoginSuccess={handleLoginSuccess} />}

      {/* Pop-up de registro */}
      {showRegisterForm && (
        <RegisterForm 
          onClose={() => setShowRegisterForm(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onShowLogin={handleShowLogin}
        />
      )}

      {/* Modal de Registrar Reserva */}
      {showReservaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowReservaModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Registrar Reserva</h2>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email del usuario"
                  value={reservaEmail}
                  onChange={e => { setReservaEmail(e.target.value); setEmailValido(null); }}
                  onBlur={handleEmailBlur}
                  className={`w-full bg-[#3d2342] border ${emailValido === null ? 'border-[#a16bb7]' : emailValido ? 'border-green-500' : 'border-red-500'} rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none`}
                />
                {emailValido === false && <div className="text-[#e94b5a] text-sm">El email no está registrado</div>}
              </div>
              {/* Primera fila: Sucursales */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-white">Sucursal de retiro</label>
                  <select
                    value={reservaSucursalRetiro ?? ''}
                    onChange={e => {
                      const value = Number(e.target.value) || null;
                      setReservaSucursalRetiro(value);
                      console.log('Sucursal de retiro seleccionada:', value);
                    }}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                  >
                    <option value="">Seleccionar sucursal</option>
                    {sucursales.length > 0 ? (
                      sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))
                    ) : (
                      <option value="" disabled>No hay sucursales disponibles</option>
                    )}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-white">Sucursal de devolución</label>
                  <select
                    value={reservaSucursalDevolucion ?? ''}
                    onChange={e => setReservaSucursalDevolucion(Number(e.target.value) || null)}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                  >
                    <option value="">Seleccionar sucursal</option>
                    {sucursales.length > 0 ? (
                      sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))
                    ) : (
                      <option value="" disabled>No hay sucursales disponibles</option>
                    )}
                  </select>
                </div>
              </div>
              {/* Segunda fila: Categoría */}
              <div>
                <label className="text-white">Categoría</label>
                <select
                  value={reservaCategoria ?? ''}
                  onChange={e => setReservaCategoria(Number(e.target.value) || null)}
                  className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                  disabled={!reservaSucursalRetiro}
                >
                  <option value="">Seleccionar categoría</option>
                  {reservaCategoriasSucursal.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              {/* Tercera fila: Fechas */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-white">Fecha de inicio</label>
                  <DatePicker
                    selected={reservaFechaRetiro}
                    onChange={setReservaFechaRetiro}
                    minDate={new Date()}
                    placeholderText="Fecha de inicio"
                    isDisabled={!reservaCategoria || !reservaSucursalRetiro}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-white">Fecha de fin</label>
                  <DatePicker
                    selected={reservaFechaDevolucion}
                    onChange={setReservaFechaDevolucion}
                    minDate={reservaFechaRetiro || new Date()}
                    placeholderText="Fecha de fin"
                    isDisabled={!reservaCategoria || !reservaSucursalRetiro}
                  />
                </div>
              </div>
              {/* Modelos disponibles solo después de buscar */}
              {mostrarModelos && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Modelos disponibles</h3>
                  <select
                    value={reservaModelo ?? ''}
                    onChange={e => setReservaModelo(Number(e.target.value) || null)}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                  >
                    <option value="">Seleccionar modelo</option>
                    {modelosDisponibles.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre} - ${m.precio_por_dia}/día</option>
                    ))}
                  </select>
                  {modelosDisponibles.length === 0 && <div className="text-[#e94b5a] text-sm mt-2">No hay modelos disponibles para la selección.</div>}
                </div>
              )}
              {montoACobrar !== null && (
                <div className="mt-4 text-white text-lg font-semibold">
                  El monto a cobrar es: ${montoACobrar}
                </div>
              )}
              {reservaError && <div className="text-[#e94b5a] text-sm">{reservaError}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Retirar Vehículo */}
      {showRetiroModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowRetiroModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Retirar Vehículo</h2>
            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Número de reserva"
                value={retiroReservaId}
                onChange={e => setRetiroReservaId(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                disabled={retiroReserva !== null}
              />
              <button
                className="w-full h-12 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold"
                onClick={handleBuscarReserva}
                disabled={retiroLoading || retiroReserva !== null}
              >
                {retiroLoading ? 'Buscando...' : 'Registrar Retiro'}
              </button>
              {retiroError && <div className="text-[#e94b5a] text-sm">{retiroError}</div>}
              {retiroReserva && (
                <div className="bg-[#3d2342] rounded-md p-4 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Reserva #{retiroReserva.id}</h3>
                  <p className="text-white mb-1">Usuario: {retiroReserva.cliente?.nombre} {retiroReserva.cliente?.apellido}</p>
                  <p className="text-white mb-1">Email: {retiroReserva.cliente?.email}</p>
                  <p className="text-white mb-1">Vehículo: {retiroReserva.vehiculo?.marca?.nombre} {retiroReserva.vehiculo?.modelo?.nombre} ({retiroReserva.vehiculo?.patente})</p>
                  <p className="text-white mb-1">Fecha inicio: {retiroReserva.fecha_inicio ? new Date(retiroReserva.fecha_inicio).toLocaleString() : ''}</p>
                  <p className="text-white mb-1">Fecha fin: {retiroReserva.fecha_fin ? new Date(retiroReserva.fecha_fin).toLocaleString() : ''}</p>
                  <p className="text-white mb-1 font-semibold">Monto total: ${calcularMontoReserva(retiroReserva) ?? '-'}</p>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="w-full h-12 bg-[#a16bb7] text-white rounded-md hover:bg-[#e94b5a] transition-colors font-semibold"
                      onClick={handleConfirmarRetiro}
                      disabled={retiroConfirmado}
                    >
                      {retiroConfirmado ? 'Retiro Confirmado' : 'Confirmar'}
                    </button>
                    <button
                      className="w-full h-12 border border-[#a16bb7] text-[#a16bb7] rounded-md hover:text-[#e94b5a] hover:border-[#e94b5a] transition-colors font-semibold bg-transparent"
                      onClick={() => setShowRetiroModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                  {retiroConfirmado && <div className="text-green-400 mt-2">Retiro registrado exitosamente.</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Registrar Usuario */}
      {showRegistrarUsuarioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowRegistrarUsuarioModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Registrar Nuevo Cliente</h2>
            <form className="space-y-4" onSubmit={handleRegistrarUsuario}>
              <input
                type="email"
                placeholder="Email del cliente"
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                required
              />
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoUsuario.first_name}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, first_name: e.target.value})}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={nuevoUsuario.last_name}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, last_name: e.target.value})}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                required
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={nuevoUsuario.telefono}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, telefono: e.target.value})}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                required
              />
              <input
                type="date"
                placeholder="Fecha de nacimiento"
                value={nuevoUsuario.fecha_nacimiento}
                onChange={(e) => setNuevoUsuario({...nuevoUsuario, fecha_nacimiento: e.target.value})}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                required
              />
              <button
                type="submit"
                className="w-full h-12 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold"
                disabled={registrarUsuarioLoading}
              >
                {registrarUsuarioLoading ? 'Registrando...' : 'Registrar Cliente'}
              </button>
              {registrarUsuarioError && <div className="text-[#e94b5a] text-sm">{registrarUsuarioError}</div>}
              {registrarUsuarioSuccess && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
                  <p>✅ Cliente registrado exitosamente</p>
                  <p>Email: {nuevoUsuario.email}</p>
                  <p className="font-semibold mt-2">Contraseña generada: {passwordGenerada}</p>
                  <p className="text-xs mt-1">Guarde esta contraseña para proporcionársela al cliente</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal de Cancelar Reserva */}
      {showCancelarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowCancelarModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Cancelar Reserva</h2>
            {cancelarReservaConfirmado ? (
              <div className="text-center">
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <p className="text-white text-lg">Reserva cancelada exitosamente</p>
              </div>
            ) : cancelarReservaInfo ? (
              <div>
                <div className="bg-[#3d2342] rounded-md p-4 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Reserva #{cancelarReservaInfo.id}</h3>
                  <p className="text-white mb-1">Usuario: {cancelarReservaInfo.cliente?.nombre} {cancelarReservaInfo.cliente?.apellido}</p>
                  <p className="text-white mb-1">Email: {cancelarReservaInfo.cliente?.email}</p>
                  <p className="text-white mb-1">Vehículo: {cancelarReservaInfo.vehiculo?.marca?.nombre} {cancelarReservaInfo.vehiculo?.modelo?.nombre} ({cancelarReservaInfo.vehiculo?.patente})</p>
                  <p className="text-white mb-1">Fecha inicio: {cancelarReservaInfo.fecha_inicio ? new Date(cancelarReservaInfo.fecha_inicio).toLocaleString() : ''}</p>
                  <p className="text-white mb-1">Fecha fin: {cancelarReservaInfo.fecha_fin ? new Date(cancelarReservaInfo.fecha_fin).toLocaleString() : ''}</p>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="w-full h-12 bg-[#a16bb7] text-white rounded-md hover:bg-[#e94b5a] transition-colors font-semibold"
                      onClick={handleConfirmarCancelar}
                      disabled={cancelarReservaLoading}
                    >
                      {cancelarReservaLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
                    </button>
                    <button
                      className="w-full h-12 border border-[#a16bb7] text-[#a16bb7] rounded-md hover:text-[#e94b5a] hover:border-[#e94b5a] transition-colors font-semibold bg-transparent"
                      onClick={() => setShowCancelarModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                  {cancelarReservaError && <div className="text-[#e94b5a] text-sm mt-2">{cancelarReservaError}</div>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Número de reserva"
                  value={cancelarReservaId}
                  onChange={e => setCancelarReservaId(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                  disabled={cancelarReservaLoading}
                />
                <button
                  className="w-full h-12 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold"
                  onClick={handleBuscarCancelar}
                  disabled={cancelarReservaLoading}
                >
                  {cancelarReservaLoading ? 'Buscando...' : 'Buscar Reserva'}
                </button>
                {cancelarReservaError && (
                  <div className="p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
                    {cancelarReservaError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Devolución de Vehículo */}
      {showDevolucionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowDevolucionModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Devolución de Vehículo</h2>
            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Número de reserva"
                value={devolucionReservaId}
                onChange={e => setDevolucionReservaId(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                disabled={devolucionReserva !== null}
              />
              <button
                className="w-full h-12 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold"
                onClick={handleBuscarDevolucion}
                disabled={devolucionLoading || devolucionReserva !== null}
              >
                {devolucionLoading ? 'Buscando...' : 'Buscar Reserva'}
              </button>
              {devolucionError && <div className="text-[#e94b5a] text-sm">{devolucionError}</div>}
              {devolucionReserva && (
                <div className="bg-[#3d2342] rounded-md p-4 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Reserva #{devolucionReserva.id}</h3>
                  <p className="text-white mb-1">Usuario: {devolucionReserva.cliente?.nombre} {devolucionReserva.cliente?.apellido}</p>
                  <p className="text-white mb-1">Email: {devolucionReserva.cliente?.email}</p>
                  <p className="text-white mb-1">Vehículo: {devolucionReserva.vehiculo?.marca?.nombre} {devolucionReserva.vehiculo?.modelo?.nombre} ({devolucionReserva.vehiculo?.patente})</p>
                  <p className="text-white mb-1">Fecha inicio: {devolucionReserva.fecha_inicio ? new Date(devolucionReserva.fecha_inicio).toLocaleString() : ''}</p>
                  <p className="text-white mb-1">Fecha fin: {devolucionReserva.fecha_fin ? new Date(devolucionReserva.fecha_fin).toLocaleString() : ''}</p>
                  <p className="text-white mb-1 font-semibold">Monto total: ${calcularMontoReserva(devolucionReserva) ?? '-'}</p>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="w-full h-12 bg-[#a16bb7] text-white rounded-md hover:bg-[#e94b5a] transition-colors font-semibold"
                      onClick={handleConfirmarDevolucion}
                      disabled={devolucionConfirmado}
                    >
                      {devolucionConfirmado ? 'Devolución Confirmada' : 'Confirmar'}
                    </button>
                    <button
                      className="w-full h-12 border border-[#a16bb7] text-[#a16bb7] rounded-md hover:text-[#e94b5a] hover:border-[#e94b5a] transition-colors font-semibold bg-transparent"
                      onClick={() => setShowDevolucionModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                  {devolucionConfirmado && <div className="text-green-400 mt-2">Devolución registrada exitosamente.</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Menú lateral */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-[#2d1830]/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabecera del menú */}
        <div className="flex justify-between items-center p-4 border-b border-white/30">
          <h2 className="text-white text-xl font-semibold">Menú</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-white hover:text-[#e94b5a] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        {/* Opciones del menú */}
        <nav className="p-4">
          <div className="flex flex-col divide-y divide-white/30 border-b border-white/30">
            {/* Opciones comunes para todos los usuarios */}
            {userState.isAuthenticated && (
              <button 
                className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
                onClick={() => router.push('/mis-reservas')}
              >
                Mis Reservas
              </button>
            )}
            {/* Opciones específicas según el rol */}
            {renderRoleSpecificButtons()}
            {/* Botón Mi Cuenta - Maneja la navegación condicional basada en autenticación */}
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => {
                if (userState.isAuthenticated) {
                  router.push('/mi-cuenta');
                } else {
                  setShowLoginForm(true);
                  setIsMenuOpen(false);
                }
              }}
            >
              Mi cuenta
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => {
                if (userState.isAuthenticated) {
                  router.push('/flota');
                } else {
                  setShowLoginForm(true);
                  setIsMenuOpen(false);
                }
              }}
            >
              Flota
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => console.log('Sucursales clicked')}
            >
              Sucursales
            </button>

            {/* Opciones comunes para todos los usuarios */}
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => {
                if (userState.isAuthenticated) {
                  router.push('/politicas');
                } else {
                  setShowLoginForm(true);
                  setIsMenuOpen(false);
                }
              }}
            >
              Politicas de uso
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => console.log('Sobre nosotros clicked')}
            >
              Sobre nosotros
            </button>
            <button 
              className="text-white text-left px-4 py-3 rounded-md hover:bg-[#a16bb7]/50 backdrop-blur-md transition-colors"
              onClick={() => console.log('Preguntas frecuentes clicked')}
            >
              Preguntas frecuentes
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-[#3d2342]/30 transition-all duration-300 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Hero Section y Listado de vehículos */}
      <main className="w-full flex flex-col items-center justify-center py-12 bg-transparent">
        <div className="hero-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {userState.isAuthenticated 
              ? `Bienvenido a AlquilappCar, ${userState.username}!` 
              : 'Manejá tu camino'}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-[#a16bb7]">
            {userState.role === 3 
              ? 'Panel de administración y gestión de AlquilappCar' 
              : 'Encontrá el vehículo perfecto para tu próxima aventura'}
          </p>
          <div className="flex flex-col gap-4 justify-center cta-buttons">
            {userState.role === 3 ? (
              <div className="flex flex-col gap-4">
                <button 
                  className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                  onClick={() => router.push('/admin/vehiculos')}
                >
                  Gestión de Vehículos
                </button>
                <button 
                  className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                  onClick={() => router.push('/admin/usuarios')}
                >
                  Gestionar usuarios
                </button>
                <button 
                  className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                  onClick={() => router.push('/admin/sucursales')}
                >
                  Gestionar sucursales
                </button>
                <button 
                  className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                  onClick={() => router.push('/admin/categorias')}
                >
                  Gestionar categorías
                </button>
                <button 
                  className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                  onClick={() => router.push('/admin/estadisticas')}
                >
                  Ver estadísticas
                </button>
              </div>
            ) : userState.role === 2 ? (
              <div className="w-full max-w-7xl px-4 space-y-8">
                {/* Sección de Gestión de Reservas */}
                <div className="bg-[#2d1830] p-8 rounded-lg shadow-lg w-full">
                  <h2 className="text-2xl font-semibold mb-6 text-white">Gestión de Reservas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full justify-items-center">
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors w-full"
                      onClick={() => setShowRegistrarModal(true)}
                    >
                      Registrar Alquiler
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors w-full"
                      onClick={() => setShowRetiroModal(true)}
                    >
                      Retirar Vehículo
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors w-full"
                      onClick={() => setShowDevolucionModal(true)}
                    >
                      Devolución de Vehículo
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors w-full"
                      onClick={() => setShowCancelarModal(true)}
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                </div>

                {/* Sección de Gestión de Vehículos */}
                <div className="bg-[#2d1830] p-8 rounded-lg shadow-lg flex flex-col items-center">
                  <h2 className="text-2xl font-semibold mb-6 text-white">Gestión de Vehículos</h2>
                  {/* Barra de búsqueda y botón de agregar */}
                  <div className="flex gap-4 mb-8 w-full max-w-2xl">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={vehiculoPatente}
                        onChange={e => setVehiculoPatente(e.target.value.toUpperCase())}
                        placeholder="Buscar por patente..."
                        className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                      />
                      <button
                        onClick={handleVehiculoSearch}
                        disabled={vehiculoLoading}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#e94b5a] hover:text-[#b13e4a] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handleVehiculoAdd}
                      className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Agregar Vehículo
                    </button>
                  </div>
                  {/* Mensaje de error */}
                  {vehiculoError && (
                    <div className="mb-4 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md w-full max-w-2xl">{vehiculoError}</div>
                  )}
                  {/* Estado de carga */}
                  {vehiculoLoading && (
                    <div className="text-center text-white mb-4 w-full max-w-2xl">Buscando vehículos...</div>
                  )}
                  {/* Tabla de resultados */}
                  {vehiculos.length > 0 && (
                    <div className="bg-[#3d2342] rounded-lg shadow-lg overflow-hidden w-full max-w-2xl">
                      <table className="w-full text-white">
                        <thead className="bg-[#4c3246]">
                          <tr>
                            <th className="px-6 py-3 text-left">Patente</th>
                            <th className="px-6 py-3 text-left">Marca</th>
                            <th className="px-6 py-3 text-left">Modelo</th>
                            <th className="px-6 py-3 text-left">Año</th>
                            <th className="px-6 py-3 text-left">Estado</th>
                            <th className="px-6 py-3 text-left">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4c3246]">
                          {vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id} className="hover:bg-[#4c3246]/50">
                              <td className="px-6 py-4">{vehiculo.patente}</td>
                              <td className="px-6 py-4">{vehiculo.marca?.nombre || 'N/A'}</td>
                              <td className="px-6 py-4">{vehiculo.modelo?.nombre || 'N/A'}</td>
                              <td className="px-6 py-4">{vehiculo.anio_fabricacion}</td>
                              <td className="px-6 py-4">{vehiculo.estado?.nombre || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleVehiculoEdit(vehiculo)}
                                    className="text-[#a16bb7] hover:text-[#e94b5a] transition-colors"
                                    title="Editar vehículo"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleVehiculoDelete(vehiculo)}
                                    className="text-[#e94b5a] hover:text-[#b13e4a] transition-colors"
                                    title="Eliminar vehículo"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 4a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                      <path d="M4 6h12M9 6v6m2-6v6m-7 6a2 2 0 002 2h6a2 2 0 002-2V6H5v12z" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* Modales de agregar, editar y eliminar */}
                  {showAddVehiculoForm && (
                    <AgregarVehiculoForm onClose={() => setShowAddVehiculoForm(false)} onVehiculoCreado={handleVehiculoCreado} />
                  )}
                  {vehiculoAEditar && (
                    <EditarVehiculoForm vehiculo={vehiculoAEditar} onClose={() => setVehiculoAEditar(null)} onVehiculoEditado={handleVehiculoEditado} />
                  )}
                  {vehiculoAEliminar && (
                    <ConfirmarEliminarVehiculo patente={vehiculoAEliminar.patente} onConfirm={confirmarEliminarVehiculo} onCancel={() => setVehiculoAEliminar(null)} />
                  )}
                </div>

                {/* Sección de Gestión de Usuarios */}
                <div className="bg-[#2d1830] p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold mb-6 text-white">Gestión de Usuarios</h2>
                  <div className="space-y-6">
                    <div className="relative flex gap-4 items-center">
                      <input
                        type="email"
                        placeholder="Buscar usuario por email..."
                        value={searchEmail}
                        onChange={(e) => handleSearchEmail(e.target.value)}
                        className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a] h-12"
                      />
                      <button
                        className="h-12 px-8 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold flex items-center justify-center whitespace-nowrap text-base"
                        style={{ minWidth: '180px' }}
                        onClick={() => setShowRegistrarUsuarioModal(true)}
                      >
                        Agregar usuario
                      </button>
                    </div>
                    
                    {/* Indicador de carga */}
                    {usersLoading && (
                      <div className="text-center text-white py-4">
                        Cargando usuarios...
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {searchResults.map((user) => (
                        <div key={user.id} className="flex items-center justify-between bg-[#3d2342] p-4 rounded-md">
                          <div>
                            <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                            <p className="text-[#a16bb7]">{user.email}</p>
                            <p className="text-[#a16bb7] text-sm">Tel: {user.telefono}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-[#e94b5a] hover:text-[#b13e4a] transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {!usersLoading && searchEmail && searchResults.length === 0 && (
                        <div className="text-center text-[#a16bb7] py-4">
                          No se encontraron usuarios con ese criterio de búsqueda
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-12">
                  <CategoryList setShowLoginForm={setShowLoginForm} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Registrar Alquiler */}
      {showRegistrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowRegistrarModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Registrar Alquiler para Cliente</h2>
            
            {registrarConfirmado ? (
              <div className="text-center">
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <p className="text-white text-lg">Alquiler registrado exitosamente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Email del cliente */}
                <div>
                  <label className="text-white block mb-2">Email del cliente</label>
                  <input
                    type="email"
                    placeholder="Email del cliente"
                    value={registrarClienteEmail}
                    onChange={e => { setRegistrarClienteEmail(e.target.value); setRegistrarEmailValido(null); }}
                    onBlur={handleRegistrarEmailBlur}
                    className={`w-full bg-[#3d2342] border ${registrarEmailValido === null ? 'border-[#a16bb7]' : registrarEmailValido ? 'border-green-500' : 'border-red-500'} rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]`}
                  />
                  {registrarEmailValido === false && <div className="text-[#e94b5a] text-sm">El email no está registrado</div>}
                </div>

                {/* Sucursales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2">Sucursal de retiro</label>
                    <select
                      value={registrarSucursalRetiro}
                      onChange={e => {
                        setRegistrarSucursalRetiro(e.target.value);
                        console.log('Sucursal de retiro seleccionada (cliente):', e.target.value);
                      }}
                      className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                    >
                      <option value="">Seleccionar sucursal</option>
                      {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white block mb-2">Sucursal de devolución</label>
                    <select
                      value={registrarSucursalDevolucion}
                      onChange={e => setRegistrarSucursalDevolucion(e.target.value)}
                      className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                    >
                      <option value="">Seleccionar sucursal</option>
                      {sucursales.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="text-white block mb-2">Categoría</label>
                  <select
                    value={registrarCategoria ?? ''}
                    onChange={e => setRegistrarCategoria(Number(e.target.value) || null)}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                    disabled={!registrarSucursalRetiro}
                  >
                    <option value="">Seleccionar categoría</option>
                    {registrarCategoriasSucursal.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white block mb-2">Fecha de inicio</label>
                    <input
                      type="date"
                      value={registrarFechaInicio}
                      onChange={e => setRegistrarFechaInicio(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="text-white block mb-2">Fecha de fin</label>
                    <input
                      type="date"
                      value={registrarFechaFin}
                      onChange={e => setRegistrarFechaFin(e.target.value)}
                      min={registrarFechaInicio || new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-200"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                {/* Modelos disponibles solo después de seleccionar sucursal, categoría y fechas */}
                {registrarSucursalRetiro && registrarCategoria && registrarFechaInicio && registrarFechaFin && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Modelos disponibles</h3>
                    <select
                      value={registrarModeloId}
                      onChange={e => setRegistrarModeloId(e.target.value)}
                      className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                    >
                      <option value="">Seleccionar modelo</option>
                      {modelosDisponibles.map(modelo => (
                        <option key={modelo.id} value={modelo.id}>
                          {modelo.nombre} - ${modelo.precio_por_dia}/día
                        </option>
                      ))}
                    </select>
                    {modelosDisponibles.length === 0 && <div className="text-[#e94b5a] text-sm mt-2">No hay modelos disponibles para la selección.</div>}
                  </div>
                )}

                {/* Error */}
                {registrarError && (
                  <div className="p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
                    {registrarError}
                  </div>
                )}

                {/* Mostrar monto total y extra luego de seleccionar modelo, fechas y sucursales */}
                {registrarModeloId && registrarFechaInicio && registrarFechaFin && (
                  (() => {
                    const monto = calcularMontoTotal();
                    if (!monto) return null;
                    return (
                      <div className="mt-4 text-white text-lg font-semibold">
                        El monto a cobrar es: ${monto.montoBase}
                        {monto.extra > 0 && (
                          <span> + ${EXTRA_SUCURSAL} extra por devolución en sucursal distinta</span>
                        )}<br/>
                        <span>Monto total: ${monto.total}</span>
                      </div>
                    );
                  })()
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleRegistrarAlquiler}
                    disabled={registrarLoading}
                    className="flex-1 bg-[#e94b5a] text-white py-2 px-4 rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50"
                  >
                    {registrarLoading ? 'Registrando...' : 'Registrar Alquiler'}
                  </button>
                  <button
                    onClick={() => setShowRegistrarModal(false)}
                    className="flex-1 bg-[#3d2342] text-white py-2 px-4 rounded-md hover:bg-[#4c3246] transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Registrar Usuario */}
      {showRegistrarUsuarioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2d1830] rounded-lg p-8 w-full max-w-md relative">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setShowRegistrarUsuarioModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-white mb-6">Registrar Nuevo Usuario</h2>
            
            {registrarUsuarioSuccess ? (
              <div className="text-center">
                <div className="text-green-400 text-6xl mb-4">✓</div>
                <p className="text-white text-lg mb-2">Usuario registrado exitosamente</p>
                <p className="text-[#a16bb7] text-sm">Contraseña generada: <span className="font-mono bg-[#3d2342] px-2 py-1 rounded">{passwordGenerada}</span></p>
              </div>
            ) : (
              <form onSubmit={handleRegistrarUsuario} className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Email</label>
                  <input
                    type="email"
                    value={nuevoUsuario.email}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nuevoUsuario.first_name}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, first_name: e.target.value})}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Apellido</label>
                  <input
                    type="text"
                    value={nuevoUsuario.last_name}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, last_name: e.target.value})}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={nuevoUsuario.telefono}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, telefono: e.target.value})}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={nuevoUsuario.fecha_nacimiento}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, fecha_nacimiento: e.target.value})}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                    required
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Rol</label>
                  <select
                    value={nuevoUsuario.rol}
                    onChange={e => setNuevoUsuario({...nuevoUsuario, rol: Number(e.target.value)})}
                    className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
                  >
                    <option value={1}>Cliente</option>
                    <option value={2}>Empleado</option>
                    <option value={3}>Administrador</option>
                  </select>
                </div>

                {registrarUsuarioError && (
                  <div className="p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
                    {registrarUsuarioError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={registrarUsuarioLoading}
                    className="flex-1 bg-[#e94b5a] text-white py-2 px-4 rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50"
                  >
                    {registrarUsuarioLoading ? 'Registrando...' : 'Registrar Usuario'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegistrarUsuarioModal(false)}
                    className="flex-1 bg-[#3d2342] text-white py-2 px-4 rounded-md hover:bg-[#4c3246] transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}