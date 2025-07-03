'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { getCurrentUser, logout } from '@/services/auth';
import { useRouter } from 'next/navigation';
import ModelList from '@/components/ModelList';
import DatePicker from '@/components/DatePicker';
import { getCategories, getAvailableModels, type Category } from '@/services/categories';
import { getAlquilerById } from '@/services/alquiler';
import { getAuthToken } from '@/services/auth';
import 'leaflet/dist/leaflet.css';


const CategoryList = dynamic(() => import('@/components/CategoryList'), { ssr: false });

interface UserState {
  isAuthenticated: boolean;
  role: number | null;
  username: string | null;
}

interface User {
  id: number;
  email: string;
  first_name: string;
}

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
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [reservaEmail, setReservaEmail] = useState('');
  const [reservaCategoria, setReservaCategoria] = useState<number | null>(null);
  const [reservaCategorias, setReservaCategorias] = useState<Category[]>([]);
  const [reservaFechaRetiro, setReservaFechaRetiro] = useState<Date | null>(null);
  const [reservaFechaDevolucion, setReservaFechaDevolucion] = useState<Date | null>(null);
  const [reservaModelos, setReservaModelos] = useState<any[]>([]);
  const [reservaError, setReservaError] = useState<string | null>(null);
  const [reservaLoading, setReservaLoading] = useState(false);
  const [showRetiroModal, setShowRetiroModal] = useState(false);
  const [retiroReservaId, setRetiroReservaId] = useState('');
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [showRegistrarUsuarioModal, setShowRegistrarUsuarioModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    fecha_nacimiento: ''
  });
  const [registrarUsuarioLoading, setRegistrarUsuarioLoading] = useState(false);
  const [registrarUsuarioError, setRegistrarUsuarioError] = useState<string | null>(null);
  const [registrarUsuarioSuccess, setRegistrarUsuarioSuccess] = useState(false);
  const [passwordGenerada, setPasswordGenerada] = useState('');
  const [cancelarEmail, setCancelarEmail] = useState('');
  const [cancelarReservaId, setCancelarReservaId] = useState('');
  const [cancelarLoading, setCancelarLoading] = useState(false);
  const [cancelarError, setCancelarError] = useState<string | null>(null);
  const [cancelarConfirmado, setCancelarConfirmado] = useState(false);
  const [retiroReserva, setRetiroReserva] = useState<any>(null);
  const [retiroLoading, setRetiroLoading] = useState(false);
  const [retiroError, setRetiroError] = useState<string | null>(null);
  const [retiroConfirmado, setRetiroConfirmado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserState({
        isAuthenticated: true,
        role: Number(user.rol),
        username: user.first_name
      });
    }
  }, []);

  const handleLoginSuccess = () => {
    const user = getCurrentUser();
    if (user) {
      setUserState({
        isAuthenticated: true,
        role: Number(user.rol),
        username: user.first_name
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

  const handleSearchEmail = async (email: string) => {
    setSearchEmail(email);
    // Aquí iría la llamada al backend para buscar usuarios
    // Por ahora usamos datos de ejemplo
    if (email) {
      const mockResults = [
        { id: 1, email: 'usuario1@example.com', first_name: 'Usuario 1' },
        { id: 2, email: 'usuario2@example.com', first_name: 'Usuario 2' },
      ].filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    // Aquí iría la llamada al backend para eliminar el usuario
    console.log('Eliminar usuario:', userId);
    setSearchResults(prev => prev.filter(user => user.id !== userId));
  };

  // Cargar categorías al abrir el modal
  useEffect(() => {
    if (showReservaModal) {
      getCategories().then(setReservaCategorias).catch(() => setReservaCategorias([]));
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

  const handleBuscarModelos = async () => {
    setReservaError(null);
    if (!reservaEmail || !reservaCategoria || !reservaFechaRetiro || !reservaFechaDevolucion) {
      setReservaError('Completa todos los campos para buscar modelos disponibles.');
      return;
    }
    setReservaLoading(true);
    try {
      const fechaInicioStr = reservaFechaRetiro.toISOString();
      const fechaFinStr = reservaFechaDevolucion.toISOString();
      const response = await getAvailableModels(reservaCategoria, fechaInicioStr, fechaFinStr);
      setReservaModelos(response.modelos_disponibles || []);
    } catch (e: any) {
      setReservaError(e.message || 'Error al buscar modelos disponibles.');
      setReservaModelos([]);
    } finally {
      setReservaLoading(false);
    }
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
      const token = getAuthToken();
      if (!token) throw new Error('No autenticado');
      const reserva = await getAlquilerById(Number(retiroReservaId), token);
      setRetiroReserva(reserva);
    } catch (e: any) {
      setRetiroError(e.message || 'Reserva no encontrada');
    } finally {
      setRetiroLoading(false);
    }
  };

  const handleConfirmarRetiro = () => {
    // Aquí iría la llamada al backend para confirmar el retiro
    setRetiroConfirmado(true);
  };

  const handleCancelarReserva = async () => {
    setCancelarError(null);
    if (!cancelarReservaId) {
      setCancelarError('Ingresa el número de reserva');
      return;
    }
    setCancelarLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No autenticado');

      const response = await fetch(`http://localhost:8000/api/alquileres/${cancelarReservaId}/cancelar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cancelar la reserva');
      }

      setCancelarConfirmado(true);
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setShowCancelarModal(false);
        setCancelarConfirmado(false);
        setCancelarReservaId('');
      }, 3000);
      
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

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No autenticado');

      const response = await fetch('http://localhost:8000/api/usuarios/registrar-cliente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: nuevoUsuario.email,
          first_name: nuevoUsuario.first_name,
          last_name: nuevoUsuario.last_name,
          telefono: nuevoUsuario.telefono,
          fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
          rol: 1 // Cliente
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el cliente');
      }

      // Éxito
      setRegistrarUsuarioSuccess(true);
      setPasswordGenerada(data.password_generada);
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setShowRegistrarUsuarioModal(false);
        setRegistrarUsuarioSuccess(false);
        setNuevoUsuario({
          email: '',
          first_name: '',
          last_name: '',
          telefono: '',
          fecha_nacimiento: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setRegistrarUsuarioError(error instanceof Error ? error.message : 'Error al registrar el cliente');
    } finally {
      setRegistrarUsuarioLoading(false);
    }
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
              <input
                type="email"
                placeholder="Email del usuario"
                value={reservaEmail}
                onChange={e => setReservaEmail(e.target.value)}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
              />
              <select
                value={reservaCategoria ?? ''}
                onChange={e => setReservaCategoria(Number(e.target.value) || null)}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#e94b5a]"
              >
                <option value="">Seleccionar categoría</option>
                {reservaCategorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              <div className="flex gap-4">
                <div className="flex-1">
                  <DatePicker
                    selected={reservaFechaRetiro}
                    onChange={setReservaFechaRetiro}
                    minDate={new Date()}
                    placeholderText="Fecha de retiro"
                    isDisabled={!reservaCategoria}
                  />
                </div>
                <div className="flex-1">
                  <DatePicker
                    selected={reservaFechaDevolucion}
                    onChange={setReservaFechaDevolucion}
                    minDate={reservaFechaRetiro || new Date()}
                    placeholderText="Fecha de devolución"
                    isDisabled={!reservaCategoria}
                  />
                </div>
                <button
                  className="h-12 px-6 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold mt-6"
                  onClick={handleBuscarModelos}
                  disabled={reservaLoading}
                >
                  {reservaLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {reservaError && <div className="text-[#e94b5a] text-sm">{reservaError}</div>}
              {reservaModelos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Modelos disponibles</h3>
                  <ModelList models={reservaModelos} onSelectModel={() => {}} />
                </div>
              )}
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
                  <p className="text-white">Usuario: {retiroReserva.cliente?.nombre} {retiroReserva.cliente?.apellido}</p>
                  <p className="text-white">Vehículo: {retiroReserva.vehiculo?.marca?.nombre} {retiroReserva.vehiculo?.modelo?.nombre} ({retiroReserva.vehiculo?.patente})</p>
                  <p className="text-white">Fecha inicio: {new Date(retiroReserva.fecha_inicio).toLocaleString()}</p>
                  <p className="text-white">Fecha fin: {new Date(retiroReserva.fecha_fin).toLocaleString()}</p>
                  <button
                    className="w-full h-12 mt-4 bg-[#a16bb7] text-white rounded-md hover:bg-[#e94b5a] transition-colors font-semibold"
                    onClick={handleConfirmarRetiro}
                    disabled={retiroConfirmado}
                  >
                    {retiroConfirmado ? 'Retiro Confirmado' : 'Confirmar'}
                  </button>
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
                  <p>Contraseña: {passwordGenerada}</p>
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
            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Número de reserva"
                value={cancelarReservaId}
                onChange={(e) => setCancelarReservaId(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a]"
                disabled={cancelarConfirmado}
              />
              <button
                className="w-full h-12 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors font-semibold"
                onClick={handleCancelarReserva}
                disabled={cancelarLoading || cancelarConfirmado}
              >
                {cancelarLoading ? 'Cancelando...' : 'Cancelar Reserva'}
              </button>
              {cancelarError && <div className="text-[#e94b5a] text-sm">{cancelarError}</div>}
              {cancelarConfirmado && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
                  ✅ Reserva cancelada exitosamente
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                      onClick={() => setShowReservaModal(true)}
                    >
                      Registrar Reserva
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                      onClick={() => setShowRetiroModal(true)}
                    >
                      Retirar Vehículo
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                      onClick={() => router.push('/empleado/reservas/entregar')}
                    >
                      Entregar Vehículo
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                      onClick={() => router.push('/empleado/reservas/devolver')}
                    >
                      Devolución de Vehículo
                    </button>
                    <button 
                      className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                      onClick={() => setShowCancelarModal(true)}
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                </div>

                {/* Sección de Gestión de Vehículos */}
                <div className="bg-[#2d1830] p-8 rounded-lg shadow-lg flex flex-col items-center">
                  <h2 className="text-2xl font-semibold mb-6 text-white">Gestión de Vehículos</h2>
                  <button
                    className="w-full md:w-1/2 bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-4 rounded-md transition-colors text-lg"
                    onClick={() => router.push('/admin/vehiculos')}
                  >
                    Gestión de Vehículos
                  </button>
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
                    <div className="space-y-2">
                      {searchResults.map((user) => (
                        <div key={user.id} className="flex items-center justify-between bg-[#3d2342] p-4 rounded-md">
                          <div>
                            <p className="text-white font-medium">{user.first_name}</p>
                            <p className="text-[#a16bb7]">{user.email}</p>
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
    </div>
  );
}