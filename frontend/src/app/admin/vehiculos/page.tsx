'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { buscarVehiculoPorPatente, type Vehiculo } from '@/services/vehiculos';
import AgregarVehiculoForm from '@/components/vehicles/AgregarVehiculoForm';

export default function GestionVehiculos() {
  const [patente, setPatente] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  // Verificar que el usuario es admin al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.rol !== 3) {
      router.push('/');
    }
  }, [router]);

  const handleSearch = async () => {
    if (!patente.trim()) {
      setError('Ingrese una patente para buscar');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const resultados = await buscarVehiculoPorPatente(patente);
      setVehiculos(resultados);
      if (resultados.length === 0) {
        setError('No se encontraron vehículos con esa patente');
      }
    } catch (error) {
      setError('Error al buscar vehículo. Por favor, intente nuevamente.');
      console.error('Error al buscar vehículo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setShowAddForm(true);
  };

  const handleVehiculoCreado = () => {
    // Si hay una búsqueda activa, actualizarla
    if (patente.trim()) {
      handleSearch();
    }
  };

  const handleEditVehicle = (id: number) => {
    router.push(`/admin/vehiculos/editar/${id}`);
  };

  const handleDeleteVehicle = async (id: number) => {
    // Implementar lógica de eliminación
    console.log('Eliminar vehículo:', id);
  };

  return (
    <div className="min-h-screen bg-[#3d2342] p-8">
      <div className={`max-w-6xl mx-auto transition-all duration-300 ${showAddForm ? 'blur-sm' : ''}`}>
        <h1 className="text-3xl font-bold text-white mb-8">Gestión de Vehículos</h1>
        
        {/* Barra de búsqueda y botón de agregar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={patente}
                onChange={(e) => setPatente(e.target.value.toUpperCase())}
                placeholder="Buscar por patente..."
                className="w-full px-4 py-2 rounded-md bg-[#2d1830] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#e94b5a] hover:text-[#b13e4a] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleAddVehicle}
            className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Vehículo
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
            {error}
          </div>
        )}

        {/* Estado de carga */}
        {isLoading && (
          <div className="text-center text-white mb-4">
            Buscando vehículos...
          </div>
        )}

        {/* Tabla de resultados */}
        {vehiculos.length > 0 && (
          <div className="bg-[#2d1830] rounded-lg shadow-lg overflow-hidden">
            <table className="w-full text-white">
              <thead className="bg-[#4c3246]">
                <tr>
                  <th className="px-6 py-3 text-left">Patente</th>
                  <th className="px-6 py-3 text-left">Marca</th>
                  <th className="px-6 py-3 text-left">Modelo</th>
                  <th className="px-6 py-3 text-left">Año</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4c3246]">
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className="hover:bg-[#4c3246]/50">
                    <td className="px-6 py-4">{vehiculo.patente}</td>
                    <td className="px-6 py-4">{vehiculo.marca.nombre}</td>
                    <td className="px-6 py-4">{vehiculo.modelo}</td>
                    <td className="px-6 py-4">{vehiculo.año}</td>
                    <td className="px-6 py-4">{vehiculo.estado.nombre}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditVehicle(vehiculo.id)}
                          className="text-[#a16bb7] hover:text-[#e94b5a] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehiculo.id)}
                          className="text-[#a16bb7] hover:text-[#e94b5a] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario de agregar vehículo */}
      {showAddForm && (
        <AgregarVehiculoForm
          onClose={() => setShowAddForm(false)}
          onVehiculoCreado={handleVehiculoCreado}
        />
      )}
    </div>
  );
} 