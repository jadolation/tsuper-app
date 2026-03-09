'use client';

import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F5F7FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p>Loading dashboard...</p>
    </div>
  ),
});

export default function Home() {
  return <Dashboard />;
}
