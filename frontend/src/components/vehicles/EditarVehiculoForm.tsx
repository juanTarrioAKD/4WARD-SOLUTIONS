import { useState, useEffect } from 'react';
import { Vehiculo, modificarVehiculo } from '@/services/vehiculos';
import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

interface EditarVehiculoFormProps {
  vehiculo: Vehiculo;
  onClose: () => void;
  onVehiculoEditado: () => void;
}

export default function EditarVehiculoForm({ vehiculo, onClose, onVehiculoEditado }: EditarVehiculoFormProps) {
  const [formData, setFormData] = useState({
    patente: vehiculo.patente || '',
    marca: vehiculo.marca?.id?.toString() || '',
    modelo: vehiculo.modelo || '',
    año_fabricacion: vehiculo.año_fabricacion?.toString() || new Date().getFullYear().toString(),
    categoria: vehiculo.categoria?.id?.toString() || '',
    estado: vehiculo.estado?.id?.toString() || '',
    sucursal: vehiculo.sucursal?.id?.toString() || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén completos
      if (!formData.patente || !formData.marca || !formData.modelo || 
          !formData.año_fabricacion || !formData.categoria || !formData.estado || 
          !formData.sucursal) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar formato de patente
      const patenteRegex = /^[A-Z0-9]+$/;
      if (!patenteRegex.test(formData.patente)) {
        throw new Error('La patente solo debe contener letras y números');
      }

      const vehiculoData = {
        patente: formData.patente.toUpperCase(),
        marca: parseInt(formData.marca),
        modelo: formData.modelo,
        año_fabricacion: parseInt(formData.año_fabricacion),
        categoria: parseInt(formData.categoria),
        estado: parseInt(formData.estado),
        sucursal: parseInt(formData.sucursal)
      };

      await modificarVehiculo(vehiculo.id, vehiculoData);
      onVehiculoEditado();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el vehículo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-[#3d2342]/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2d1830] rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#e94b5a] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Editar Vehículo</h2>

        {error && (
          <div className="mb-4 p-4 bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Patente</label>
              <input
                type="text"
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Marca</label>
              <select
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              >
                <option value="">Seleccionar marca</option>
                <option value="1">Toyota</option>
                <option value="2">Honda</option>
                <option value="3">Volkswagen</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Año de Fabricación</label>
              <input
                type="number"
                name="año_fabricacion"
                value={formData.año_fabricacion}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="1">SUV</option>
                <option value="2">Sedán</option>
                <option value="3">Deportivo</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="1">Disponible</option>
                <option value="2">En mantenimiento</option>
                <option value="3">No disponible</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Sucursal</label>
              <select
                name="sucursal"
                value={formData.sucursal}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              >
                <option value="">Seleccionar sucursal</option>
                <option value="1">Sucursal Central</option>
                <option value="2">Sucursal Norte</option>
                <option value="3">Sucursal Sur</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-white hover:text-[#e94b5a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 