'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  latitud: number;
  longitud: number;
}

interface MapComponentProps {
  sucursales: Sucursal[];
}

export default function MapComponent({ sucursales }: MapComponentProps) {
  const [isClient, setIsClient] = useState(false);

  // Coordenadas del centro de la provincia de Buenos Aires
  const center: [number, number] = [-36.6769, -60.5586];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-[#a16bb7]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a16bb7] mx-auto mb-4"></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {sucursales.map((sucursal) => (
        <Marker
          key={sucursal.id}
          position={[sucursal.latitud, sucursal.longitud]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg text-gray-800">{sucursal.nombre}</h3>
              <p className="text-gray-600 text-sm mb-1">{sucursal.direccion}</p>
              <p className="text-gray-600 text-sm mb-1">{sucursal.telefono}</p>
              <p className="text-gray-600 text-sm">{sucursal.email}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 