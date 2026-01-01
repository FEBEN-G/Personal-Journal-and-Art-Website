export default function DateTime({ date, time }: { date: string, time: string }) {
  return (
    <div style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.6rem 1.5rem', 
      border: '1px solid var(--border-color)', 
      borderRadius: '50px',
      backgroundColor: 'var(--bg-secondary)',
      fontSize: '0.9rem',
      color: 'var(--text-secondary)',
      boxShadow: 'var(--shadow)',
      marginBottom: '2rem'
    }}>
      <span style={{ fontWeight: 600 }}>{date}</span>
      <span style={{ color: 'var(--accent-vibrant)' }}>✧</span>
      <span style={{ fontWeight: 500, opacity: 0.8 }}>{time}</span>
    </div>
  );
}
