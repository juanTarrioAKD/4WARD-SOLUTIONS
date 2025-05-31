'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { getCurrentUser, logout } from '@/services/auth';
import { useRouter } from 'next/navigation';

const CategoryList = dynamic(() => import('@/components/CategoryList'), { ssr: false });

interface UserState {
  isAuthenticated: boolean;
  role: number | null;
  username: string | null;
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
      default:
        return null;
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
            alt="Logo AlquilappCar" 
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
                  Gestionar vehículos
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
                  onClick={() => router.push('/admin/publicaciones')}
                >
                  Gestionar publicaciones
                </button>
                <button 
                  className="bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                  onClick={() => router.push('/admin/estadisticas')}
                >
                  Ver estadísticas
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <button 
                    className="inline-flex bg-[#e94b5a] hover:bg-[#b13e4a] text-white font-semibold px-6 py-3 rounded-md transition-colors primary-btn"
                    onClick={() => {
                      if (userState.isAuthenticated) {
                        router.push('/buscar-categorias');
                      } else {
                        setShowLoginForm(true);
                      }
                    }}
                  >
                    Reservar Ahora
                  </button>
                </div>
                <div className="mt-12">
                  <CategoryList />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}