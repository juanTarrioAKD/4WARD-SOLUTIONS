'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import BackButton from '@/components/common/BackButton';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación al cargar
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#3d2342]">
      {pathname !== '/' && <BackButton />}
      <div className="pt-16">
      {/* Aquí podrías agregar una barra de navegación específica para usuarios autenticados */}
      {children}
      </div>
    </div>
  );
} 