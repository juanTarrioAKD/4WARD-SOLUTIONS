'use client';
import { useState, useEffect } from 'react';
import { getPolicies } from '@/services/policies';
import Link from 'next/link';

interface Policy {
  id: number;
  nombre: string;
  descripcion: string;
  porcentaje: number;
}

export default function PoliciesList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        console.log('Iniciando fetch de políticas...');
        const data = await getPolicies();
        console.log('Políticas obtenidas:', data);
        setPolicies(data);
        setLoading(false);
      } catch (err) {
        console.error('Error en el componente:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las políticas de cancelación');
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">
          <span className="animate-pulse">Cargando políticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-[#4c3246]/50 rounded-lg p-6 max-w-md w-full backdrop-blur-sm">
          <h3 className="text-[#e94b5a] text-xl font-semibold mb-4">Error de conexión</h3>
          <p className="text-white mb-6">{error}</p>
          <div className="flex flex-col gap-4">
            <p className="text-[#a16bb7] text-sm">
              Sugerencias:
              <ul className="list-disc list-inside mt-2">
                <li>Verifica que el servidor backend esté corriendo</li>
                <li>Comprueba la conexión a internet</li>
                <li>Intenta recargar la página</li>
              </ul>
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="text-white bg-[#a16bb7] px-4 py-2 rounded-md hover:bg-[#8f5ea3] transition-colors"
              >
                Reintentar
              </button>
              <Link 
                href="/"
                className="text-white bg-[#e94b5a] px-4 py-2 rounded-md hover:bg-[#b13e4a] transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {policies.map((policy) => (
        <div
          key={policy.id}
          className="bg-[#4c3246] rounded-lg p-6 shadow-lg backdrop-blur-sm"
        >
          <h2 className="text-2xl font-semibold text-white mb-3">{policy.nombre}</h2>
          <p className="text-[#a16bb7] mb-4">{policy.descripcion}</p>
          <div className="bg-[#2d1830] rounded p-4">
            <p className="text-white">
              Porcentaje de devolución: {policy.porcentaje}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 