'use client';

import { useState } from 'react';
import UserSearch from '../../../../components/admin/users/UserSearch';
import AddEmployee from '../../../../components/admin/users/AddEmployee';
import { User } from '../../../../types/user';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Gestión de Usuarios</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
          <UserSearch onUsersFound={setUsers} />
        </div>

        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
          <AddEmployee onEmployeeAdded={(newUser) => setUsers([...users, newUser])} />
        </div>

        {/* Lista de usuarios encontrados */}
        {users.length > 0 && (
          <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Usuarios Encontrados</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-[#3d2342] p-4 rounded-lg">
                  <p className="text-white">Email: {user.email}</p>
                  <p className="text-[#a16bb7]">Rol: {user.rol}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 