'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import dynamic from 'next/dynamic';

// Importación dinámica del mapa para evitar errores de SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1a0f1c] h-96 rounded-lg flex items-center justify-center">
      <div className="text-center text-[#a16bb7]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a16bb7] mx-auto mb-4"></div>
        <p>Cargando mapa...</p>
      </div>
    </div>
  )
});

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  latitud: number;
  longitud: number;
}

export default function GestionSucursales() {
  const router = useRouter();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalesFiltradas, setSucursalesFiltradas] = useState<Sucursal[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  // Verificar que el usuario es admin al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    const userRoleId = Number(user?.rol);
    if (!user || userRoleId !== 3) {
      router.push('/');
      return;
    }
    
    // Cargar sucursales (placeholder - implementar llamada a API)
    cargarSucursales();
  }, [router]);

  // Filtrar sucursales basado en la búsqueda
  useEffect(() => {
    const filtradas = sucursales.filter(sucursal =>
      sucursal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      sucursal.direccion.toLowerCase().includes(busqueda.toLowerCase())
    );
    setSucursalesFiltradas(filtradas);
  }, [busqueda, sucursales]);

  const cargarSucursales = async () => {
    try {
      setLoading(true);
      // TODO: Implementar llamada a API para obtener sucursales
      // const response = await fetch('/api/sucursales');
      // const data = await response.json();
      // setSucursales(data);
      
      // Datos de ejemplo - Coordenadas dentro de la provincia de Buenos Aires
      const sucursalesEjemplo: Sucursal[] = [
        {
          id: 1,
          nombre: 'Sucursal La Plata',
          direccion: 'Av. 7 1234, La Plata',
          telefono: '0221-1234-5678',
          email: 'laplata@4ward.com',
          latitud: -34.9215,
          longitud: -57.9545
        },
        {
          id: 2,
          nombre: 'Sucursal Mar del Plata',
          direccion: 'Av. Colón 456, Mar del Plata',
          telefono: '0223-8765-4321',
          email: 'mardelplata@4ward.com',
          latitud: -38.0023,
          longitud: -57.5425
        },
        {
          id: 3,
          nombre: 'Sucursal Bahía Blanca',
          direccion: 'Alsina 789, Bahía Blanca',
          telefono: '0291-5555-1234',
          email: 'bahiablanca@4ward.com',
          latitud: -38.7183,
          longitud: -62.2663
        }
      ];
      
      setSucursales(sucursalesEjemplo);
      setSucursalesFiltradas(sucursalesEjemplo);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarSucursal = () => {
    // TODO: Implementar modal o página para agregar sucursal
    console.log('Agregar nueva sucursal');
  };

  const handleEditarSucursal = (id: number) => {
    // TODO: Implementar edición de sucursal
    console.log('Editar sucursal:', id);
  };

  const handleEliminarSucursal = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar esta sucursal?')) {
      try {
        // TODO: Implementar eliminación de sucursal
        // await fetch(`/api/sucursales/${id}`, { method: 'DELETE' });
        setSucursales(sucursales.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Cargando sucursales...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Sucursales</h1>
        <button
          onClick={handleAgregarSucursal}
          className="bg-[#a16bb7] hover:bg-[#8a5a9a] text-white px-6 py-2 rounded-lg transition-colors"
        >
          + Agregar Sucursal
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar sucursales por nombre o dirección..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-[#2d1830] text-white border border-[#a16bb7] rounded-lg focus:outline-none focus:border-[#8a5a9a]"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-[#a16bb7]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mapa */}
        <div className="bg-[#2d1830] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Mapa de Sucursales</h2>
          <div className="bg-[#1a0f1c] h-96 rounded-lg overflow-hidden">
            <MapComponent sucursales={sucursalesFiltradas} />
          </div>
        </div>

        {/* Lista de Sucursales */}
        <div className="bg-[#2d1830] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Sucursales ({sucursalesFiltradas.length})
          </h2>
          
          {sucursalesFiltradas.length === 0 ? (
            <div className="text-center text-[#a16bb7] py-8">
              <p>No se encontraron sucursales</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sucursalesFiltradas.map((sucursal) => (
                <div
                  key={sucursal.id}
                  className="bg-[#1a0f1c] p-4 rounded-lg border border-[#3d2342]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold">{sucursal.nombre}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditarSucursal(sucursal.id)}
                        className="text-[#a16bb7] hover:text-white text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarSucursal(sucursal.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <p className="text-[#a16bb7] text-sm mb-1">{sucursal.direccion}</p>
                  <p className="text-[#a16bb7] text-sm mb-1">{sucursal.telefono}</p>
                  <p className="text-[#a16bb7] text-sm">{sucursal.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 