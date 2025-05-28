'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

export default function AdminDashboard() {
  const router = useRouter();

  // Verificar que el usuario es admin al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/'); // Redirigir al home si no es admin
    }
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Gestión de Vehículos */}
        <div 
          className="bg-[#2d1830] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-[#3d2342] transition-colors"
          onClick={() => router.push('/admin/vehiculos')}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Gestión de Vehículos</h2>
          <p className="text-[#a16bb7]">Administrar el catálogo de vehículos disponibles</p>
        </div>

        {/* Tarjeta de Gestión de Usuarios */}
        <div 
          className="bg-[#2d1830] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-[#3d2342] transition-colors"
          onClick={() => router.push('/admin/usuarios')}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Gestión de Usuarios</h2>
          <p className="text-[#a16bb7]">Administrar usuarios y permisos</p>
        </div>

        {/* Tarjeta de Gestión de Sucursales */}
        <div 
          className="bg-[#2d1830] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-[#3d2342] transition-colors"
          onClick={() => router.push('/admin/sucursales')}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Gestión de Sucursales</h2>
          <p className="text-[#a16bb7]">Administrar sucursales y ubicaciones</p>
        </div>

        {/* Tarjeta de Gestión de Publicaciones */}
        <div 
          className="bg-[#2d1830] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-[#3d2342] transition-colors"
          onClick={() => router.push('/admin/publicaciones')}
        >
          <h2 className="text-xl font-semibold text-white mb-2">Gestión de Publicaciones</h2>
          <p className="text-[#a16bb7]">Administrar publicaciones y ofertas</p>
        </div>
      </div>
    </div>
  );
} 