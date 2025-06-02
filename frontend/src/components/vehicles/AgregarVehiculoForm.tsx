import { useState, useEffect } from 'react';
import { crearVehiculo } from '@/services/vehiculos';
import { API_BASE_URL } from '@/config/config';
import { getAuthToken } from '@/services/auth';

interface Marca {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
}

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
    sucursal: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  // Cargar marcas al montar el componente
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/marcas/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar las marcas');
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error('Error al cargar marcas:', error);
        setError('Error al cargar las marcas');
      }
    };
    fetchMarcas();
  }, []);

  // Cargar modelos cuando se selecciona una marca
  useEffect(() => {
    const fetchModelos = async () => {
      if (!formData.marca) {
        setModelos([]);
        return;
      }
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/modelos/?marca=${formData.marca}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar los modelos');
        const data = await response.json();
        setModelos(data);
      } catch (error) {
        console.error('Error al cargar modelos:', error);
        setError('Error al cargar los modelos');
      }
    };
    fetchModelos();
  }, [formData.marca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén completos
      if (!formData.patente || !formData.marca || !formData.modelo || 
          !formData.año || !formData.categoria || !formData.estado || 
          !formData.sucursal) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar formato de patente (letras y números sin espacios ni caracteres especiales)
      const patenteRegex = /^[A-Z0-9]+$/;
      if (!patenteRegex.test(formData.patente)) {
        throw new Error('La patente solo debe contener letras y números');
      }

      // Convertir los IDs a números y crear el objeto de datos
      const vehiculoData = {
        patente: formData.patente.toUpperCase(),
        marca: parseInt(formData.marca),
        modelo: parseInt(formData.modelo),
        año_fabricacion: parseInt(formData.año.toString()),
        categoria: parseInt(formData.categoria),
        estado: parseInt(formData.estado),
        sucursal: parseInt(formData.sucursal)
      };

      console.log('Enviando datos:', vehiculoData);
      await crearVehiculo(vehiculoData);
      onVehiculoCreado();
      onClose();
    } catch (error) {
      console.error('Error en el formulario:', error);
      setError(error instanceof Error ? error.message : 'Error al crear el vehículo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Si se cambia la marca, resetear el modelo
      ...(name === 'marca' ? { modelo: '' } : {})
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
                {marcas.map(marca => (
                  <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Modelo</label>
              <select
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
                required
                disabled={!formData.marca}
              >
                <option value="">Seleccionar modelo</option>
                {modelos.map(modelo => (
                  <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Año de Fabricación</label>
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
                <option value="1">Apto discapacitados</option>
                <option value="2">Chico</option>
                <option value="3">Deportivo</option>
                <option value="4">Mediano</option>
                <option value="5">SUV</option>
                <option value="6">Van</option>
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
              {isLoading ? 'Guardando...' : 'Guardar Vehículo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 