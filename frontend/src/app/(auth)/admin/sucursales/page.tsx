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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sucursalEliminando, setSucursalEliminando] = useState<Sucursal | null>(null);
  const [sucursalEditando, setSucursalEditando] = useState<Sucursal | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });
  const [newSucursalData, setNewSucursalData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

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
    setNewSucursalData({
      nombre: '',
      direccion: '',
      telefono: '',
      email: ''
    });
    setShowAddModal(true);
  };

  const handleEditarSucursal = (sucursal: Sucursal) => {
    setSucursalEditando(sucursal);
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
      email: sucursal.email
    });
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (!sucursalEditando) return;

    try {
      // TODO: Implementar llamada a API para actualizar sucursal
      // await fetch(`/api/sucursales/${sucursalEditando.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Actualizar estado local
      const sucursalesActualizadas = sucursales.map(sucursal =>
        sucursal.id === sucursalEditando.id
          ? { ...sucursal, ...formData }
          : sucursal
      );
      
      setSucursales(sucursalesActualizadas);
      setShowEditModal(false);
      setSucursalEditando(null);
      setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
    }
  };

  const handleCancelarEdicion = () => {
    setShowEditModal(false);
    setSucursalEditando(null);
    setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
  };

  const handleGuardarNuevaSucursal = async () => {
    try {
      // TODO: Implementar llamada a API para crear sucursal
      // const response = await fetch('/api/sucursales', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newSucursalData)
      // });
      // const nuevaSucursal = await response.json();

      // Crear nueva sucursal con ID temporal
      const nuevaSucursal: Sucursal = {
        id: Math.max(...sucursales.map(s => s.id)) + 1,
        nombre: newSucursalData.nombre,
        direccion: newSucursalData.direccion,
        telefono: newSucursalData.telefono,
        email: newSucursalData.email,
        latitud: -34.6037, // Coordenadas por defecto (Buenos Aires)
        longitud: -58.3816
      };

      // Agregar a la lista de sucursales
      setSucursales([...sucursales, nuevaSucursal]);
      setShowAddModal(false);
      setNewSucursalData({ nombre: '', direccion: '', telefono: '', email: '' });
    } catch (error) {
      console.error('Error al crear sucursal:', error);
    }
  };

  const handleCancelarAgregar = () => {
    setShowAddModal(false);
    setNewSucursalData({ nombre: '', direccion: '', telefono: '', email: '' });
  };

  const handleEliminarSucursal = (sucursal: Sucursal) => {
    setSucursalEliminando(sucursal);
    setShowDeleteModal(true);
  };

  const confirmarEliminarSucursal = async () => {
    if (!sucursalEliminando) return;

    try {
      // TODO: Implementar eliminación de sucursal
      // await fetch(`/api/sucursales/${sucursalEliminando.id}`, { method: 'DELETE' });
      setSucursales(sucursales.filter(s => s.id !== sucursalEliminando.id));
      setShowDeleteModal(false);
      setSucursalEliminando(null);
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
    }
  };

  const cancelarEliminarSucursal = () => {
    setShowDeleteModal(false);
    setSucursalEliminando(null);
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

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-300 ${showEditModal || showAddModal || showDeleteModal ? 'filter blur-sm pointer-events-none select-none' : ''}`}>
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
                        onClick={() => handleEditarSucursal(sucursal)}
                        className="text-[#a16bb7] hover:text-white text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarSucursal(sucursal)}
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

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2d1830] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Editar Sucursal</h2>
              <button
                onClick={handleCancelarEdicion}
                className="text-[#a16bb7] hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleGuardarEdicion(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelarEdicion}
                  className="flex-1 px-4 py-2 bg-[#3d2342] text-white rounded-lg hover:bg-[#4d2b52] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#a16bb7] text-white rounded-lg hover:bg-[#8a5a9a] transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Agregar Sucursal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2d1830] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Agregar Nueva Sucursal</h2>
              <button
                onClick={handleCancelarAgregar}
                className="text-[#a16bb7] hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleGuardarNuevaSucursal(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={newSucursalData.nombre}
                    onChange={(e) => setNewSucursalData({ ...newSucursalData, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={newSucursalData.direccion}
                    onChange={(e) => setNewSucursalData({ ...newSucursalData, direccion: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={newSucursalData.telefono}
                    onChange={(e) => setNewSucursalData({ ...newSucursalData, telefono: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#a16bb7] text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newSucursalData.email}
                    onChange={(e) => setNewSucursalData({ ...newSucursalData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelarAgregar}
                  className="flex-1 px-4 py-2 bg-[#3d2342] text-white rounded-lg hover:bg-[#4d2b52] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#a16bb7] text-white rounded-lg hover:bg-[#8a5a9a] transition-colors"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2d1830] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Confirmar Eliminación</h2>
              <button
                onClick={cancelarEliminarSucursal}
                className="text-[#a16bb7] hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white mb-2">
                ¿Está seguro de que desea eliminar esta sucursal?
              </p>
              <p className="text-[#a16bb7] font-semibold text-lg">
                {sucursalEliminando?.nombre}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={cancelarEliminarSucursal}
                className="flex-1 px-4 py-2 bg-[#3d2342] text-white rounded-lg hover:bg-[#4d2b52] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarSucursal}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 