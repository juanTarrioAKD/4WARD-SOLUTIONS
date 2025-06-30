"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buscarVehiculoPorPatente, type Vehiculo } from "@/services/vehiculos";
import { API_BASE_URL } from "@/config/config";
import AgregarVehiculoForm from "@/components/vehicles/AgregarVehiculoForm";
import EditarVehiculoForm from "@/components/vehicles/EditarVehiculoForm";
import ConfirmarEliminarVehiculo from "@/components/vehicles/ConfirmarEliminarVehiculo";
import { getAuthToken } from "@/services/auth";

export default function EmpleadoGestionVehiculos() {
  const [patente, setPatente] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState<Vehiculo | null>(null);
  const [vehiculoAEliminar, setVehiculoAEliminar] = useState<Vehiculo | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!patente.trim()) {
      setError("Ingrese una patente para buscar");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const resultados = await buscarVehiculoPorPatente(patente);
      setVehiculos(resultados);
      if (resultados.length === 0) {
        setError("No se encontraron vehículos con esa patente");
      }
    } catch (error) {
      setError("Error al buscar vehículo. Por favor, intente nuevamente.");
      console.error("Error al buscar vehículo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setShowAddForm(true);
  };

  const handleVehiculoCreado = () => {
    if (patente.trim()) {
      handleSearch();
    }
  };

  const handleEditVehicle = (vehiculo: Vehiculo) => {
    setVehiculoAEditar(vehiculo);
  };

  const handleDeleteVehicle = (vehiculo: Vehiculo) => {
    setVehiculoAEliminar(vehiculo);
  };

  const confirmarEliminarVehiculo = async () => {
    if (!vehiculoAEliminar) return;
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No autorizado");
      }
      const response = await fetch(`${API_BASE_URL}/api/vehiculos/${vehiculoAEliminar.id}/baja/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.error) {
          throw new Error(errorData.error);
        }
        throw new Error("Error al eliminar el vehículo");
      }
      setVehiculos(vehiculos.filter((v) => v.id !== vehiculoAEliminar.id));
      setVehiculoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al eliminar el vehículo. Por favor, intente nuevamente."
      );
    }
  };

  return (
    <div className="w-full">
      <div className={`transition-all duration-300 ${showAddForm || vehiculoAEditar || vehiculoAEliminar ? "blur-sm" : ""}`}>
        {/* Barra de búsqueda y botón de agregar */}
        <div className="flex gap-4 mb-8 w-full">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={patente}
                onChange={(e) => setPatente(e.target.value.toUpperCase())}
                placeholder="Buscar por patente..."
                className="w-full px-4 py-2 rounded-md bg-[#2d1830] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
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
                    <td className="px-6 py-4">{typeof vehiculo.marca === 'object' && vehiculo.marca ? vehiculo.marca.nombre : 'N/A'}</td>
                    <td className="px-6 py-4">{typeof vehiculo.modelo === 'object' && vehiculo.modelo ? vehiculo.modelo.nombre : 'N/A'}</td>
                    <td className="px-6 py-4">{vehiculo.año_fabricacion}</td>
                    <td className="px-6 py-4">{typeof vehiculo.estado === 'object' && vehiculo.estado ? vehiculo.estado.nombre : 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditVehicle(vehiculo)}
                          className="text-[#a16bb7] hover:text-[#e94b5a] transition-colors"
                          title="Editar vehículo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehiculo)}
                          className="text-[#a16bb7] hover:text-[#e94b5a] transition-colors"
                          title="Eliminar vehículo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3.5A1.5 1.5 0 002 5.5v1A.5.5 0 002.5 7H3v9.5A2.5 2.5 0 005.5 19h9a2.5 2.5 0 002.5-2.5V7h.5a.5.5 0 00.5-.5v-1A1.5 1.5 0 0018.5 4H17V3a1 1 0 00-1-1H6zm2 3V4h4v1H8zm-3 2h10v9.5a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5V7z" clipRule="evenodd" />
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

      {/* Formularios y modales */}
      {showAddForm && (
        <AgregarVehiculoForm
          onClose={() => setShowAddForm(false)}
          onVehiculoCreado={handleVehiculoCreado}
        />
      )}
      {vehiculoAEditar && (
        <EditarVehiculoForm
          vehiculo={vehiculoAEditar}
          onClose={() => setVehiculoAEditar(null)}
          onVehiculoActualizado={handleVehiculoCreado}
        />
      )}
      {vehiculoAEliminar && (
        <ConfirmarEliminarVehiculo
          vehiculo={vehiculoAEliminar}
          onClose={() => setVehiculoAEliminar(null)}
          onConfirm={confirmarEliminarVehiculo}
        />
      )}
    </div>
  );
} 