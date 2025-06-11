'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Category, CategoryFormData } from '@/services/categories';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CategoryForm({ 
  category, 
  onSubmit, 
  onCancel,
  isLoading 
}: CategoryFormProps) {
  const [nombre, setNombre] = useState(category?.name || '');
  const [descripcion, setDescripcion] = useState(category?.description || '');
  const [precio, setPrecio] = useState(category?.price.toString() || '');
  const [imagen, setImagen] = useState<File | null>(null);
  const [caracteristicas, setCaracteristicas] = useState<string[]>(category?.features || []);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [previewUrl, setPreviewUrl] = useState(category?.image || '');
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddCaracteristica = () => {
    if (nuevaCaracteristica.trim()) {
      setCaracteristicas([...caracteristicas, nuevaCaracteristica.trim()]);
      setNuevaCaracteristica('');
    }
  };

  const handleRemoveCaracteristica = (index: number) => {
    setCaracteristicas(caracteristicas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      setError('El precio debe ser un número válido mayor a 0');
      return;
    }

    try {
      await onSubmit({
        nombre,
        descripcion,
        precio: Number(precio),
        imagen,
        caracteristicas
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar la categoría');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-[#e94b5a]/10 border border-[#e94b5a] text-[#e94b5a] px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-white mb-2">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-white mb-2">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-white mb-2">Precio por día:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
          min="0"
          step="0.01"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-white mb-2">Imagen:</label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
          disabled={isLoading}
        />
        {previewUrl && (
          <div className="mt-2 relative h-48 rounded-md overflow-hidden">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-white mb-2">Características:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={nuevaCaracteristica}
            onChange={(e) => setNuevaCaracteristica(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-[#3d2342] text-white border border-[#a16bb7] focus:border-[#e94b5a] focus:outline-none"
            placeholder="Nueva característica"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddCaracteristica}
            className="px-4 py-2 bg-[#a16bb7] text-white rounded-md hover:bg-[#8a5b9d] transition-colors disabled:opacity-50"
            disabled={isLoading || !nuevaCaracteristica.trim()}
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {caracteristicas.map((caracteristica, index) => (
            <div
              key={index}
              className="bg-[#3d2342] px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span className="text-white">{caracteristica}</span>
              <button
                type="button"
                onClick={() => handleRemoveCaracteristica(index)}
                className="text-[#e94b5a] hover:text-[#b13e4a] transition-colors"
                disabled={isLoading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-white hover:text-[#e94b5a] transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
} 