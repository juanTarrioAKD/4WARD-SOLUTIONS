'use client';

import { useState } from 'react';
import { registerUser } from '@/services/register';

// Definición de las props del componente
interface RegisterFormProps {
  onClose: () => void;
  onRegisterSuccess: () => void;
  onShowLogin: () => void;
}

export default function RegisterForm({ onClose, onRegisterSuccess, onShowLogin }: RegisterFormProps) {
  // Estados para manejar los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    fecha_nacimiento: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para calcular la edad
  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setIsLoading(true);

    // Validación de campos vacíos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono || 
        !formData.password || !formData.confirmPassword || !formData.fecha_nacimiento) {
      setError('Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }

    // Validación de edad
    const age = calculateAge(formData.fecha_nacimiento);
    if (age < 18) {
      setError('El registro de usuario solo se puede realizar por personas mayores de 18 años');
      setFormData(prev => ({
        ...prev,
        fecha_nacimiento: ''
      }));
      setIsLoading(false);
      return;
    }

    // Validación de contraseñas coincidentes
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      setIsLoading(false);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      setFormData(prev => ({
        ...prev,
        email: ''
      }));
      setIsLoading(false);
      return;
    }

    // Validación de teléfono (solo números y mínimo 8 dígitos)
    const phoneRegex = /^\d{8,}$/;
    if (!phoneRegex.test(formData.telefono)) {
      setError('El teléfono debe contener al menos 8 dígitos numéricos');
      setFormData(prev => ({
        ...prev,
        telefono: ''
      }));
      setIsLoading(false);
      return;
    }

    try {
      // Llamada al servicio de registro
      const result = await registerUser({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        fecha_nacimiento: formData.fecha_nacimiento
      });

      if (result.success) {
        setSuccess(true);
        setError(''); // Limpiar error si hubo éxito
        // Esperamos 2 segundos para mostrar el mensaje de éxito
        setTimeout(() => {
          onRegisterSuccess();
          onClose();
          // Abrimos el formulario de login
          onShowLogin();
        }, 2000);
      } else {
        setError(result.error || 'Error al registrar el usuario');
        // Si el error es de usuario existente, limpiar el campo de usuario
        if (result.error?.includes('usuario ya está en uso')) {
          setFormData(prev => ({
            ...prev,
            nombre: '',
            apellido: ''
          }));
        }
        // Si el error es de email existente, limpiar el campo de email
        if (result.error?.includes('email ya está registrado')) {
          setFormData(prev => ({
            ...prev,
            email: ''
          }));
        }
      }
    } catch (error) {
      setError('Hubo un error al intentar registrar el usuario. Por favor, intente nuevamente.');
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
      {/* Formulario de registro */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2d1830] p-8 rounded-xl shadow-lg z-50 max-w-3xl">
        {/* Cabecera del formulario */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">Registro</h2>
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

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Mensaje de error */}
          {error && (
            <div className="bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
              ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-white mb-2">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white mb-2">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white mb-2">Contraseña:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="fecha_nacimiento" className="block text-white mb-2">Fecha de nacimiento:</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <div>
                <label htmlFor="apellido" className="block text-white mb-2">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-white mb-2">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-white mb-2">Confirmar contraseña:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="mt-2">
                <p className="text-[#a16bb7] text-sm">
                  Requisitos de contraseña:
                  <ul className="list-disc list-inside mt-1">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos 1 letra mayúscula</li>
                    <li>Al menos 1 número</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                error 
                  ? 'bg-[#ff0000] hover:bg-[#cc0000] text-white border-2 border-[#ff0000]' 
                  : 'bg-[#e94b5a] hover:bg-[#b13e4a] text-white'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 