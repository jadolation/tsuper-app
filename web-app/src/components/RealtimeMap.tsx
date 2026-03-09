'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: LatLngExpression = [16.0433, 120.3333]; // Dagupan
const DEFAULT_ZOOM = 14;

interface DriverData {
  lat: number;
  lng: number;
  heading?: number;
  status?: string;
  timestamp: number;
}

interface PassengerData {
  lat: number;
  lng: number;
  route_needed?: string;
}

interface RealtimeMapProps {
  activeJeeps: Record<string, DriverData>;
  waitingPassengers: Record<string, PassengerData>;
}

export default function RealtimeMap({ activeJeeps, waitingPassengers }: RealtimeMapProps) {
  const [isClient, setIsClient] = useState(false);
  const mapKeyRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
    
    // Fix for default marker icons in Next.js
    import('leaflet').then((leaflet) => {
      delete (leaflet.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    });
  }, []);

  if (!isClient) {
    return (
      <div style={{ 
        height: '500px', 
        background: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '12px'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      key={mapKeyRef.current}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Active Jeepneys - Orange markers */}
      {Object.entries(activeJeeps).map(([driverId, data]) => (
        <Marker
          key={`jeep-${driverId}`}
          position={[data.lat, data.lng] as LatLngExpression}
        >
          <Popup>
            <div style={{ minWidth: '150px' }}>
              <strong style={{ color: '#FF6B00' }}>🚐 Jeepney</strong><br />
              <span>Status: {data.status || 'Active'}</span><br />
              <span>Last update: {new Date(data.timestamp).toLocaleTimeString()}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Waiting Passengers - Blue markers */}
      {Object.entries(waitingPassengers).map(([userId, data]) => (
        <Marker
          key={`passenger-${userId}`}
          position={[data.lat, data.lng] as LatLngExpression}
        >
          <Popup>
            <div style={{ minWidth: '150px' }}>
              <strong style={{ color: '#1D7FE8' }}>👤 Waiting Passenger</strong><br />
              {data.route_needed && <span>Route: {data.route_needed}</span>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
