'use client';

import VehicleList from '@/components/vehicles/VehicleList';

export default function FlotaPage() {
  return (
    <div className="min-h-screen bg-[#5e3e5a] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Nuestra Flota
        </h1>
        <VehicleList />
      </div>
    </div>
  );
} 