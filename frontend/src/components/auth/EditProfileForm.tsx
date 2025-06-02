'use client';

import { useState } from 'react';
import { updateProfile } from '@/services/profile';

interface EditProfileFormProps {
  onClose: () => void;
  onUpdateSuccess: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
}

export default function EditProfileForm({ onClose, onUpdateSuccess, initialData }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    phoneNumber: initialData.phoneNumber
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

  // Validación del número de teléfono
  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^(\+?54\s?9\s?)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación de campos vacíos
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      setError('Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }

    // Validación del número de teléfono
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setError('El número de teléfono no es válido. Debe ser un número argentino de 10 dígitos');
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdateSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setError('Error al actualizar el perfil. Por favor, intente nuevamente.');
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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2d1830] p-8 rounded-xl shadow-lg z-50 w-[500px]">
        {/* Cabecera del formulario */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">Editar Perfil</h2>
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
              ¡Perfil actualizado exitosamente!
            </div>
          )}

          {/* Campo de nombre */}
          <div>
            <label htmlFor="firstName" className="block text-white mb-2">Nombre:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Campo de apellido */}
          <div>
            <label htmlFor="lastName" className="block text-white mb-2">Apellido:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Campo de teléfono */}
          <div>
            <label htmlFor="phoneNumber" className="block text-white mb-2">Número de teléfono:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+54 9 XXX XXX-XXXX"
              className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Botón de actualizar */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } bg-[#e94b5a] hover:bg-[#b13e4a] text-white`}
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 