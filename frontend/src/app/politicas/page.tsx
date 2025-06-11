'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PoliciesList from '@/components/policies/PoliciesList';
import { getCurrentUser } from '@/services/auth';

export default function PoliciesPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#5e3e5a] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Políticas de Cancelación</h1>
          <Link 
            href="/"
            className="text-white bg-[#e94b5a] px-4 py-2 rounded-md hover:bg-[#b13e4a] transition-colors"
          >
            Volver
          </Link>
        </div>
        <PoliciesList />
      </div>
    </div>
  );
} 