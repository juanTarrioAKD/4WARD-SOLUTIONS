'use client';

import { useState, useEffect } from 'react';
import AddEmployee from '../../../../components/admin/users/AddEmployee';
import { User } from '@/services/users';
import { getAllUsers, deleteUser } from '@/services/users';

export default function UserManagement() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (error) {
        // Manejo de error opcional
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchEmail.trim()) {
      const filtered = allUsers.filter(user =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchEmail.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchEmail.toLowerCase()))
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
      setSearchResults(prev => prev.filter(user => user.id !== userId));
      setAllUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      // Manejo de error opcional
    }
  };

  const handleEmployeeAdded = (newUser: User) => {
    setAllUsers(prev => [...prev, newUser]);
    if (
      newUser.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
      (newUser.first_name && newUser.first_name.toLowerCase().includes(searchEmail.toLowerCase())) ||
      (newUser.last_name && newUser.last_name.toLowerCase().includes(searchEmail.toLowerCase()))
    ) {
      setSearchResults(prev => [...prev, newUser]);
    }
  };

  return (
    <div className="min-h-screen bg-[#5e3e5a] p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Gestión de Usuarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Buscador de usuario + resultados */}
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg flex flex-col justify-between min-h-[400px]">
          <h2 className="text-xl font-semibold text-white mb-4">Buscar Usuario</h2>
          <input
            type="email"
            placeholder="Buscar usuario por email, nombre o apellido..."
            value={searchEmail}
            onChange={e => handleSearchEmail(e.target.value)}
            className="w-full bg-[#3d2342] border border-[#a16bb7] rounded-md px-4 py-2 text-white placeholder-[#a16bb7] focus:outline-none focus:border-[#e94b5a] mb-4"
          />
          {usersLoading && (
            <div className="text-center text-white py-2">Cargando usuarios...</div>
          )}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-2">Usuarios Encontrados</h3>
            <div className="space-y-2">
              {searchResults.length === 0 && !usersLoading && (
                <div className="text-[#a16bb7] text-center">No se encontraron usuarios con ese criterio de búsqueda</div>
              )}
              {searchResults.map((user) => (
                <div key={user.id} className="bg-[#3d2342] p-2 rounded flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white font-medium leading-tight">{user.first_name} {user.last_name}</p>
                    <p className="text-[#a16bb7] leading-tight">{user.email}</p>
                    <p className="text-[#a16bb7] text-xs leading-tight">Rol: {typeof user.rol === 'number' ? (user.rol === 1 ? 'Cliente' : user.rol === 2 ? 'Empleado' : user.rol === 3 ? 'Admin' : user.rol) : user.rol}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-[#e94b5a] hover:text-[#b13e4a] transition-colors ml-2"
                    title="Eliminar usuario"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 4a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2zm2 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      <path d="M4 6h12M9 6v6m2-6v6m-7 6a2 2 0 002 2h6a2 2 0 002-2V6H5v12z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Alta de empleado */}
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
        </div>
      </div>
    </div>
  );
} 