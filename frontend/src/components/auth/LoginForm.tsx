'use client';
import { useState } from 'react';
import { login } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginForm({ onClose, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requireAdminCode, setRequireAdminCode] = useState(false);
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validación de campos vacíos
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingrese un email válido');
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(email, password, requireAdminCode ? adminCode : undefined);

      // Verificar si necesitamos código de administrador
      if ('require_admin_code' in response) {
        setRequireAdminCode(true);
        setError(response.error);
        return;
      }

      // Si el login fue exitoso
      authLogin(response);
      onLoginSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      {/* Formulario */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2d1830] p-8 rounded-xl shadow-lg z-50 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">
            {requireAdminCode ? 'Ingreso Administrador' : 'Iniciar Sesión'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#e94b5a] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contenedor del mensaje de error - Se muestra solo cuando hay un error */}
          {error && (
            <div className="bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-white mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
              disabled={isLoading || requireAdminCode}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white mb-2">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
              disabled={isLoading || requireAdminCode}
              required
            />
          </div>

          {requireAdminCode && (
            <div>
              <label htmlFor="adminCode" className="block text-white mb-2">Código de Administrador:</label>
              <input
                type="text"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                disabled={isLoading}
                required
                autoFocus
              />
            </div>
          )}
          
          <button
            type="submit"
            className={`w-full bg-[#e94b5a] text-white py-2 rounded-md font-semibold hover:bg-[#b13e4a] transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : requireAdminCode ? 'Verificar Código' : 'Ingresar'}
          </button>

          {!requireAdminCode && (
            <button
              type="button"
              className="text-white text-sm hover:text-[#e94b5a] transition-colors"
              disabled={isLoading}
            >
              Olvidé mi contraseña
            </button>
          )}
        </form>
      </div>
    </>
  );
} 