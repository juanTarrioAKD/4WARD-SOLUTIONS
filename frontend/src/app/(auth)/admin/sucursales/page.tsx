'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { sucursalesService, Sucursal, CreateSucursalData, UpdateSucursalData } from '@/services/sucursales';
import { localidadesService, Localidad } from '@/services/localidades';
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

// Extender la interfaz Sucursal para incluir coordenadas del mapa
interface SucursalWithCoords extends Sucursal {
  latitud: number;
  longitud: number;
}

// Función para geocodificar direcciones usando Nominatim
const geocodificarDireccion = async (direccion: string, localidad?: string): Promise<{latitud: number, longitud: number} | null> => {
  try {
    const query = localidad ? `${direccion}, ${localidad}, Argentina` : `${direccion}, Argentina`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitud: parseFloat(data[0].lat),
        longitud: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al geocodificar dirección:', error);
    return null;
  }
};

// Función para esperar un tiempo entre llamadas a la API (para respetar límites de rate)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function GestionSucursales() {
  const router = useRouter();
  const [sucursales, setSucursales] = useState<SucursalWithCoords[]>([]);
  const [sucursalesFiltradas, setSucursalesFiltradas] = useState<SucursalWithCoords[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sucursalEliminando, setSucursalEliminando] = useState<SucursalWithCoords | null>(null);
  const [sucursalEditando, setSucursalEditando] = useState<SucursalWithCoords | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    localidad_id: 0
  });
  const [newSucursalData, setNewSucursalData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    localidad_id: 0
  });
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadBusqueda, setLocalidadBusqueda] = useState('');

  // Cargar sucursales al montar el componente
  useEffect(() => {
    console.log('Cargando sucursales...');
    cargarSucursales();
    // Cargar localidades
    localidadesService.getLocalidades().then(data => {
      setLocalidades(data);
      console.log('Localidades cargadas:', data);
    });
  }, []);

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
      
      // Llamada real a la API
      const sucursalesData = await sucursalesService.getSucursales();
      
      // Geocodificar direcciones para obtener coordenadas reales
      const sucursalesConCoords: SucursalWithCoords[] = [];
      
      for (const sucursal of sucursalesData) {
        const coordenadas = await geocodificarDireccion(sucursal.direccion, sucursal.localidad);
        
        sucursalesConCoords.push({
          ...sucursal,
          latitud: coordenadas?.latitud || -34.6037, // Coordenadas por defecto (Buenos Aires) si falla la geocodificación
          longitud: coordenadas?.longitud || -58.3816
        });
        
        // Esperar 1 segundo entre llamadas para respetar los límites de la API
        await delay(200);
      }
      
      setSucursales(sucursalesConCoords);
      setSucursalesFiltradas(sucursalesConCoords);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      // En caso de error, mostrar mensaje y lista vacía
      setSucursales([]);
      setSucursalesFiltradas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarSucursal = () => {
    setNewSucursalData({
      nombre: '',
      direccion: '',
      telefono: '',
      localidad_id: 0
    });
    setLocalidadBusqueda('');
    setShowAddModal(true);
  };

  const handleEditarSucursal = (sucursal: SucursalWithCoords) => {
    const localidadId = localidades.find(l => l.nombre === sucursal.localidad)?.id || 0;
    setSucursalEditando(sucursal);
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono,
      localidad_id: localidadId
    });
    setLocalidadBusqueda('');
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async () => {
    if (!sucursalEditando) return;

    try {
      // Llamada real a la API para actualizar sucursal
      const sucursalActualizada = await sucursalesService.updateSucursal(
        sucursalEditando.id,
        formData
      );

      // Geocodificar la nueva dirección
      const localidadNombreEditar = localidades.find(l => l.id === formData.localidad_id)?.nombre || '';
      const coordenadas = await geocodificarDireccion(formData.direccion, localidadNombreEditar);

      // Actualizar estado local con nuevas coordenadas
      const sucursalesActualizadas = sucursales.map(sucursal =>
        sucursal.id === sucursalEditando.id
          ? { 
              ...sucursal, 
              ...sucursalActualizada,
              latitud: coordenadas?.latitud || sucursal.latitud || -34.6037,
              longitud: coordenadas?.longitud || sucursal.longitud || -58.3816
            }
          : sucursal
      );
      
      setSucursales(sucursalesActualizadas);
      setSucursalesFiltradas(sucursalesActualizadas);
      setShowEditModal(false);
      setSucursalEditando(null);
      setFormData({ nombre: '', direccion: '', telefono: '', localidad_id: 0 });
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
    }
  };

  const handleCancelarEdicion = () => {
    setShowEditModal(false);
    setSucursalEditando(null);
    setFormData({ nombre: '', direccion: '', telefono: '', localidad_id: 0 });
  };

  const handleGuardarNuevaSucursal = async () => {
    try {
      // Llamada real a la API para crear sucursal
      const nuevaSucursal = await sucursalesService.createSucursal(newSucursalData);

      // Geocodificar la dirección de la nueva sucursal
      const localidadNombreNueva = localidades.find(l => l.id === newSucursalData.localidad_id)?.nombre || '';
      const coordenadas = await geocodificarDireccion(newSucursalData.direccion, localidadNombreNueva);

      // Agregar coordenadas para el mapa
      const nuevaSucursalConCoords: SucursalWithCoords = {
        ...nuevaSucursal,
        latitud: coordenadas?.latitud || -34.6037, // Coordenadas por defecto (Buenos Aires)
        longitud: coordenadas?.longitud || -58.3816
      };

      // Agregar a la lista de sucursales
      const sucursalesActualizadas = [...sucursales, nuevaSucursalConCoords];
      setSucursales(sucursalesActualizadas);
      setSucursalesFiltradas(sucursalesActualizadas);
      setShowAddModal(false);
      setNewSucursalData({ nombre: '', direccion: '', telefono: '', localidad_id: 0 });
    } catch (error: any) {
      let msg = 'Error al crear sucursal';
      if (error && error.nombre && Array.isArray(error.nombre) && error.nombre[0].toLowerCase().includes('ya existe')) {
        msg = 'La sucursal ya se encuentra registrada en el sistema.';
      }
      console.error('Error al crear sucursal:', error);
      alert(msg);
    }
  };

  const handleCancelarAgregar = () => {
    setShowAddModal(false);
    setNewSucursalData({ nombre: '', direccion: '', telefono: '', localidad_id: 0 });
  };

  const handleEliminarSucursal = (sucursal: SucursalWithCoords) => {
    setSucursalEliminando(sucursal);
    setShowDeleteModal(true);
  };

  const confirmarEliminarSucursal = async () => {
    if (!sucursalEliminando) return;

    try {
      // Llamada real a la API para eliminar sucursal
      await sucursalesService.deleteSucursal(sucursalEliminando.id);
      
      // Actualizar estado local
      const sucursalesActualizadas = sucursales.filter(s => s.id !== sucursalEliminando.id);
      setSucursales(sucursalesActualizadas);
      setSucursalesFiltradas(sucursalesActualizadas);
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
                  <p className="text-[#a16bb7] text-sm">{sucursal.localidad}</p>
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
                    Localidad
                  </label>
                  <select
                    value={formData.localidad_id.toString()}
                    onChange={e => setFormData({ ...formData, localidad_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  >
                    <option value="0">Seleccionar localidad</option>
                    {localidades
                      .map(l => (
                        <option key={l.id} value={l.id.toString()}>{l.nombre}</option>
                      ))}
                  </select>
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
                    Localidad
                  </label>
                  <select
                    value={newSucursalData.localidad_id.toString()}
                    onChange={e => setNewSucursalData({ ...newSucursalData, localidad_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1a0f1c] text-white border border-[#3d2342] rounded-lg focus:outline-none focus:border-[#a16bb7]"
                    required
                  >
                    <option value="0">Seleccionar localidad</option>
                    {localidades
                      .map(l => (
                        <option key={l.id} value={l.id.toString()}>{l.nombre}</option>
                      ))}
                  </select>
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