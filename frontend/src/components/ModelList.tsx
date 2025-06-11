'use client';

import { Model, formatModelPrice, getVehicleCapacityText, getAvailabilityText } from '@/types/models';
import Image from 'next/image';

interface ModelListProps {
  models: Model[];
  onSelectModel: (modelId: number) => void;
}

export default function ModelList({ models, onSelectModel }: ModelListProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#a16bb7]">No hay modelos disponibles para las fechas seleccionadas</p>
      </div>
    );
  }

  const getAvailabilityText = (quantity: number) => {
    return `${quantity} ${quantity === 1 ? 'unidad disponible' : 'unidades disponibles'}`;
  };

  const getVehicleCapacityText = (capacity: number) => {
    return `${capacity} ${capacity === 1 ? 'persona' : 'personas'}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <div
          key={model.id}
          className="bg-[#2d1830]/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
          onClick={() => onSelectModel(model.id)}
        >
          <div className="relative h-48">
            <img
              src="/default-car.jpg"
              alt={`Modelo ${model.nombre}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              {model.nombre}
            </h3>
            <div className="space-y-2 mb-4">
              <p className="text-[#a16bb7]">
                {getAvailabilityText(model.cantidad_disponible)}
              </p>
              {model.vehiculos[0] && (
                <div className="text-white text-sm space-y-1">
                  <p>Marca: {model.vehiculos[0].marca}</p>
                  <p>Año: {model.vehiculos[0].año}</p>
                  <p>Capacidad: {getVehicleCapacityText(model.vehiculos[0].capacidad)}</p>
                </div>
              )}
            </div>
            <button 
              className="w-full px-4 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelectModel(model.id);
              }}
            >
              Seleccionar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 