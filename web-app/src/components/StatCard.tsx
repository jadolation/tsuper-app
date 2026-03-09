interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#111',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '4px',
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
