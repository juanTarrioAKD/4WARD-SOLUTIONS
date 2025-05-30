'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import ReservationList from '@/components/reservations/ReservationList';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function MisReservas() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/');
      return;
    }

    setUserData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setIsLoading(false);
  }, [router]);

  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3d2342] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Mis Reservas</h1>
        
        <div className="bg-[#2d1830] p-6 rounded-lg shadow-lg">
          <ReservationList 
            userEmail={userData.email}
            userName={userData.firstName}
            userLastName={userData.lastName}
          />
        </div>
      </div>
    </div>
  );
} 