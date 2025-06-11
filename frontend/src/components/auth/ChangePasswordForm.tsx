'use client';

import { useState } from 'react';
import { changePassword, verifyCurrentPassword } from '@/services/password';

interface ChangePasswordFormProps {
  onClose: () => void;
  onChangeSuccess: () => void;
}

export default function ChangePasswordForm({ onClose, onChangeSuccess }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Validación de la contraseña
  const validatePassword = (password: string): { isValid: boolean; error?: string } => {
    if (password.length < 8) {
      return { isValid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'La contraseña debe contener al menos una letra mayúscula' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'La contraseña debe contener al menos una letra minúscula' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'La contraseña debe contener al menos un número' };
    }
    return { isValid: true };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si se cambia la contraseña actual, resetear la verificación
    if (name === 'currentPassword') {
      setIsCurrentPasswordVerified(false);
      setError('');
    }
  };

  const handleVerifyPassword = async () => {
    if (!formData.currentPassword) {
      setError('Por favor, ingrese su contraseña actual');
      return;
    }

    setIsVerifying(true);
    setError('');
    
    const result = await verifyCurrentPassword(formData.currentPassword);
    
    if (result.success) {
      setIsCurrentPasswordVerified(true);
      setError('');
    } else {
      setIsCurrentPasswordVerified(false);
      setError('Contraseña actual incorrecta');
    }
    
    setIsVerifying(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validar que todos los campos estén completos
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setError('Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }

    // Validar que las contraseñas nuevas coincidan
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden');
      setIsLoading(false);
      return;
    }

    // Validar el formato de la nueva contraseña
    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      setError(validation.error || 'La contraseña no cumple con los requisitos');
      setIsLoading(false);
      return;
    }

    try {
      const result = await changePassword({
        contraseña: formData.currentPassword,
        nueva_contraseña: formData.newPassword
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onChangeSuccess();
          onClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error al cambiar la contraseña. Por favor, intente nuevamente.');
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
          <h2 className="text-white text-xl font-semibold">Cambiar Contraseña</h2>
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
              ¡Contraseña actualizada exitosamente!
            </div>
          )}

          {/* Campo de contraseña actual con botón de verificación */}
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-white mb-2">
                Contraseña actual:
                {isVerifying && (
                  <span className="ml-2 text-[#a16bb7] text-sm">Verificando...</span>
                )}
                {isCurrentPasswordVerified && (
                  <span className="ml-2 text-green-500 text-sm">✓ Verificada</span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-2 rounded-md bg-[#3d2342] text-white border ${
                    isCurrentPasswordVerified ? 'border-green-500' : 'border-[#a16bb7]'
                  } focus:border-[#e94b5a] focus:outline-none`}
                  disabled={isLoading || isVerifying}
                />
                <button
                  type="button"
                  onClick={handleVerifyPassword}
                  disabled={isLoading || isVerifying || !formData.currentPassword}
                  className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                    isLoading || isVerifying || !formData.currentPassword
                      ? 'opacity-50 cursor-not-allowed bg-[#a16bb7]'
                      : 'bg-[#a16bb7] hover:bg-[#8a5a9e]'
                  } text-white`}
                >
                  {isVerifying ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>

            {/* Campo de nueva contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-white mb-2">Nueva contraseña:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                disabled={!isCurrentPasswordVerified || isLoading}
              />
            </div>

            {/* Campo de confirmar nueva contraseña */}
            <div>
              <label htmlFor="confirmNewPassword" className="block text-white mb-2">Confirmar nueva contraseña:</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                disabled={!isCurrentPasswordVerified || isLoading}
              />
            </div>
          </div>

          {/* Botón de cambiar contraseña */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className={`w-full py-2 rounded-md font-semibold transition-colors ${
                !isCurrentPasswordVerified || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              } bg-[#e94b5a] hover:bg-[#b13e4a] text-white`}
              disabled={!isCurrentPasswordVerified || isLoading}
            >
              {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 