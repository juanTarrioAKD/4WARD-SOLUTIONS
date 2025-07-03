'use client';

import { useState } from 'react';
import { User } from '@/types/user';

interface AddEmployeeData {
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
  password: string;
  confirmPassword: string;
}

interface AddEmployeeProps {
  onEmployeeAdded: (user: User) => void;
}

export default function AddEmployee({ onEmployeeAdded }: AddEmployeeProps) {
  const [formData, setFormData] = useState<AddEmployeeData>({
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    fecha_nacimiento: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/usuarios/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          telefono: formData.telefono.trim(),
          fecha_nacimiento: formData.fecha_nacimiento,
          rol: '2' // 2 es el ID del rol empleado por defecto
        }),
      });

      if (!response.ok) throw new Error('Error al crear empleado');
      
      const newUser = await response.json();
      onEmployeeAdded(newUser);
      
      // Limpiar el formulario
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        telefono: '',
        fecha_nacimiento: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Error al crear el empleado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Agregar Nuevo Empleado</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#a16bb7]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-[#a16bb7]">
            Nombre
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-[#a16bb7]">
            Apellido
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-[#a16bb7]">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <div>
          <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-[#a16bb7]">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#a16bb7]">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#a16bb7]">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#a16bb7] text-white py-2 px-4 rounded-md hover:bg-[#8a5a9d] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Agregando...' : 'Agregar Empleado'}
        </button>
      </form>
    </div>
  );
} 