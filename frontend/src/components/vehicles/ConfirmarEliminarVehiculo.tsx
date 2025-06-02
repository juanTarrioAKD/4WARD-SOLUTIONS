interface ConfirmarEliminarVehiculoProps {
  patente: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmarEliminarVehiculo({ patente, onConfirm, onCancel }: ConfirmarEliminarVehiculoProps) {
  return (
    <div className="fixed inset-0 bg-[#3d2342]/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2d1830] rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Confirmar Eliminación</h2>
        
        <p className="text-white mb-6">
          ¿Está seguro que desea eliminar el vehículo con patente <span className="font-bold">{patente}</span>?
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-white hover:text-[#e94b5a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#e94b5a] text-white rounded-md hover:bg-[#b13e4a] transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
} 