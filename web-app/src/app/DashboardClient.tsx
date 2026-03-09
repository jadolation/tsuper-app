'use client';

import { useEffect, useState } from 'react';
import RealtimeMap from '@/components/RealtimeMap';
import StatCard from '@/components/StatCard';
import {
  subscribeToActiveJeeps,
  subscribeToWaitingPassengers,
  type DriverLocation,
  type WaitingPassenger,
} from '@/lib/firebase';

export default function DashboardClient() {
  const [activeJeeps, setActiveJeeps] = useState<Record<string, DriverLocation>>({});
  const [waitingPassengers, setWaitingPassengers] = useState<Record<string, WaitingPassenger>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('--:--:--');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    let unsubJeeps: (() => void) | undefined;
    let unsubPassengers: (() => void) | undefined;
    
    subscribeToActiveJeeps((data) => {
      setActiveJeeps(data as Record<string, DriverLocation>);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsConnected(true);
    }).then((unsub) => {
      unsubJeeps = unsub;
    });

    subscribeToWaitingPassengers((data) => {
      setWaitingPassengers(data as Record<string, WaitingPassenger>);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsConnected(true);
    }).then((unsub) => {
      unsubPassengers = unsub;
    });

    return () => {
      unsubJeeps?.();
      unsubPassengers?.();
    };
  }, []);

  const jeepCount = Object.keys(activeJeeps).length;
  const passengerCount = Object.keys(waitingPassengers).length;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7FA' }}>
      {/* Header */}
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#111' }}>
            🚐 Tsuper Admin
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#666' }}>
            Real-time transport monitoring
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isConnected ? '#22C55E' : '#EF4444',
            }}
          />
          <span style={{ fontSize: '14px', color: '#666' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <StatCard
            title="Active Jeepneys"
            value={jeepCount}
            icon="🚐"
            color="#FFF3E8"
          />
          <StatCard
            title="Waiting Passengers"
            value={passengerCount}
            icon="👤"
            color="#E8F4FE"
          />
          <StatCard
            title="Total Active"
            value={jeepCount + passengerCount}
            icon="📍"
            color="#F0FDF4"
          />
          <StatCard
            title="Last Update"
            value={isClient ? lastUpdate : '--:--:--'}
            icon="🕐"
            color="#FEF3C7"
          />
        </div>

        {/* Map Section */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600', color: '#111' }}>
            Live Map
          </h2>
          <RealtimeMap
            activeJeeps={activeJeeps}
            waitingPassengers={waitingPassengers}
          />
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              gap: '24px',
              fontSize: '14px',
              color: '#666',
            }}
          >
            <span>
              <span style={{ color: '#FF6B00', fontWeight: '600' }}>●</span> Active Jeepneys ({jeepCount})
            </span>
            <span>
              <span style={{ color: '#1D7FE8', fontWeight: '600' }}>●</span> Waiting Passengers ({passengerCount})
            </span>
          </div>
        </div>

        {/* Lists Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
            marginTop: '24px',
          }}
        >
          {/* Active Jeepneys List */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#111' }}>
              Active Jeepneys ({jeepCount})
            </h3>
            {jeepCount === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>No active jeepneys</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {Object.entries(activeJeeps).map(([id, data]) => (
                  <li
                    key={id}
                    style={{
                      padding: '12px 0',
                      borderBottom: '1px solid #F3F4F6',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      <strong>{id.slice(0, 8)}...</strong>
                    </span>
                    <span style={{ color: '#666', fontSize: '13px' }}>
                      {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
                    </span>
                    <span
                      style={{
                        background: data.status === 'seats_available' ? '#DCFCE7' : '#FEF3C7',
                        color: data.status === 'seats_available' ? '#166534' : '#92400E',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {data.status || 'Active'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Waiting Passengers List */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#111' }}>
              Waiting Passengers ({passengerCount})
            </h3>
            {passengerCount === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>No waiting passengers</p>
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {Object.entries(waitingPassengers).map(([id, data]) => (
                  <li
                    key={id}
                    style={{
                      padding: '12px 0',
                      borderBottom: '1px solid #F3F4F6',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      <strong>{id.slice(0, 8)}...</strong>
                    </span>
                    <span style={{ color: '#666', fontSize: '13px' }}>
                      {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
                    </span>
                    <span
                      style={{
                        background: '#E8F4FE',
                        color: '#1D7FE8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      {data.route_needed || 'Any route'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
