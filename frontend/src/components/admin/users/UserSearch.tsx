'use client';

import { useState } from 'react';
import { User } from '@/types/user';

interface UserSearchProps {
  onUsersFound: (users: User[]) => void;
}

export default function UserSearch({ onUsersFound }: UserSearchProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/search?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Error al buscar usuarios');    
      
      const data = await response.json();
      onUsersFound(data);
    } catch (error) {
      console.error('Error:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Buscar Usuarios</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#a16bb7]">
            Email del Usuario
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md bg-[#3d2342] border-[#a16bb7] text-white shadow-sm focus:border-[#a16bb7] focus:ring-[#a16bb7]"
            placeholder="ejemplo@email.com"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#a16bb7] text-white py-2 px-4 rounded-md hover:bg-[#8a5a9d] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
    </div>
  );
} 