'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

export default function MiCuenta() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  // Verificar que el usuario está autenticado al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/'); // Redirigir al home si no está autenticado
    } else {
      setUserData(user);
    }
  }, [router]);

  if (!userData) {
    return <div className="p-8 text-white">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Mi Cuenta</h1>
      
      <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg max-w-2xl">
        {/* Información del usuario */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Información Personal</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[#a16bb7] text-sm">Nombre de usuario</label>
              <p className="text-white">{userData.username}</p>
            </div>
            <div>
              <label className="block text-[#a16bb7] text-sm">Email</label>
              <p className="text-white">{userData.email}</p>
            </div>
            <div>
              <label className="block text-[#a16bb7] text-sm">Rol</label>
              <p className="text-white">{userData.role}</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button 
            className="w-full bg-[#e94b5a] text-white py-2 rounded-md font-semibold hover:bg-[#b13e4a] transition-colors"
            onClick={() => console.log('Editar perfil')}
          >
            Editar Perfil
          </button>
          <button 
            className="w-full bg-transparent text-white py-2 rounded-md font-semibold border border-[#e94b5a] hover:bg-[#e94b5a]/10 transition-colors"
            onClick={() => console.log('Cambiar contraseña')}
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
} 