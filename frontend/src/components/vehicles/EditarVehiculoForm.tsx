import { useState, useEffect } from 'react';
import { Vehiculo, modificarVehiculo } from '@/services/vehiculos';
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

interface Sucursal {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Estado {
  id: number;
  nombre: string;
}

interface EditarVehiculoFormProps {
  vehiculo: Vehiculo;
  onClose: () => void;
  onVehiculoEditado: () => void;
}

export default function EditarVehiculoForm({ vehiculo, onClose, onVehiculoEditado }: EditarVehiculoFormProps) {
  const [formData, setFormData] = useState({
    patente: vehiculo.patente || '',
    marca: vehiculo.marca?.id?.toString() || '',
    modelo: vehiculo.modelo?.id?.toString() || '',
    anio_fabricacion: vehiculo.anio_fabricacion?.toString() || new Date().getFullYear().toString(),
    categoria: vehiculo.categoria?.id?.toString() || '',
    estado: vehiculo.estado?.id?.toString() || '',
    sucursal: vehiculo.sucursal?.id?.toString() || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estados, setEstados] = useState<Estado[]>([ // Puedes reemplazar esto por fetch si tienes endpoint
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'En mantenimiento' },
    { id: 3, nombre: 'No disponible' },
  ]);

  // Cargar marcas al montar
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/marcas/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al cargar las marcas');
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        setError('Error al cargar las marcas');
      }
    };
    fetchMarcas();
  }, []);

  // Cargar modelos cuando cambia la marca
  useEffect(() => {
    const fetchModelos = async () => {
      if (!formData.marca) {
        setModelos([]);
        return;
      }
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/modelos/?marca=${formData.marca}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al cargar los modelos');
        const data = await response.json();
        setModelos(data);
      } catch (error) {
        setError('Error al cargar los modelos');
      }
    };
    fetchModelos();
  }, [formData.marca]);

  // Cargar sucursales al montar
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sucursales/`);
        if (!response.ok) throw new Error('Error al cargar las sucursales');
        const data = await response.json();
        setSucursales(data);
      } catch (error) {
        setError('Error al cargar las sucursales');
      }
    };
    fetchSucursales();
  }, []);

  // Cargar categorías al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categorias/`);
        if (!response.ok) throw new Error('Error al cargar las categorías');
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        setError('Error al cargar las categorías');
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén completos
      if (!formData.patente || !formData.marca || !formData.modelo || 
          !formData.anio_fabricacion || !formData.categoria || !formData.estado || 
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
        modelo: parseInt(formData.modelo),
        anio_fabricacion: parseInt(formData.anio_fabricacion),
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
      [name]: value,
      ...(name === 'marca' ? { modelo: '' } : {}) // reset modelo si cambia marca
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
                name="anio_fabricacion"
                value={formData.anio_fabricacion}
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
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
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
                {estados.map(est => (
                  <option key={est.id} value={est.id}>{est.nombre}</option>
                ))}
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
                {sucursales.map(suc => (
                  <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                ))}
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