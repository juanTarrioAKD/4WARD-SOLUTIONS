import { useState } from 'react';
import { crearVehiculo } from '@/services/vehiculos';

interface AgregarVehiculoFormProps {
  onClose: () => void;
  onVehiculoCreado: () => void;
}

export default function AgregarVehiculoForm({ onClose, onVehiculoCreado }: AgregarVehiculoFormProps) {
  const [formData, setFormData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    año: new Date().getFullYear(),
    categoria: '',
    estado: '',
    sucursal: '',
    politica: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Convertir los IDs a números
      const vehiculoData = {
        ...formData,
        marca: parseInt(formData.marca),
        categoria: parseInt(formData.categoria),
        estado: parseInt(formData.estado),
        sucursal: parseInt(formData.sucursal),
        politica: parseInt(formData.politica),
        año: parseInt(formData.año.toString())
      };

      await crearVehiculo(vehiculoData);
      onVehiculoCreado();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear el vehículo');
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
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-[#2d1830]/95 backdrop-blur-md rounded-lg p-8 max-w-2xl w-full mx-4 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#e94b5a] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Agregar Nuevo Vehículo</h2>

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
              <label className="block text-white mb-2">Año</label>
              <input
                type="number"
                name="año"
                value={formData.año}
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

            <div>
              <label className="block text-white mb-2">Política</label>
              <select
                name="politica"
                value={formData.politica}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
              >
                <option value="">Seleccionar política</option>
                <option value="1">Estándar</option>
                <option value="2">Premium</option>
                <option value="3">Básica</option>
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
              {isLoading ? 'Guardando...' : 'Guardar Vehículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 